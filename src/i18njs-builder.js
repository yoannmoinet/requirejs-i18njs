define(function () {
    var fs = nodeRequire('fs');
    var buildMap = {};
    var escapedDoubleQuotes = '__escaped_double_quote';
    var escapedSingleQuotes = '__escaped_single_quote';
    var regexEscapedDoubleQuotes = new RegExp(escapedDoubleQuotes, 'g');
    var regexEscapedSingleQuotes = new RegExp(escapedSingleQuotes, 'g');
    // Get the template builder.
    var template = nodeRequire('i18njs/bin/templateI18njs.js');
    // Simple self iterative function
    var parse = function (obj, fn) {
        for (var i in obj) {
            if (typeof obj[i] === 'object') {
                obj[i] = parse(obj[i], fn);
            } else {
                obj[i] = fn(obj[i], i);
            }
        }
        return obj;
    };

    return {
        load: function (name, req, onload, config) {
            var toLoad = req.toUrl(name);
            // We load the file.
            var fileContent = fs.readFileSync(toLoad).toString();
            var localConfig;
            var pkgs = config.packages;
            // Default delimiters
            var delimiters = {
                evaluate: /\{\{([\s\S]+?)\}\}/g,
                interpolate: /\{\{=([\s\S]+?)\}\}/g,
                escape: /\{\{-([\s\S]+?)\}\}/g
            };

            // Find the package's config
            pkgs.forEach(function (pkg, key) {
                if (pkg.name === 'i18n') {
                    localConfig = pkg;
                }
            });

            // Replace options passed with the package
            if (typeof localConfig.delimiters === 'object') {
                if (localConfig.delimiters.evaluate &&
                    localConfig.delimiters.interpolate &&
                    localConfig.delimiters.escape) {
                        delimiters = localConfig.delimiters;
                }
            }

            // Pre-compile the templates
            // and store it for later use.
            // TODO : Make it only if we find moustaches.
            buildMap[name] = parse(JSON.parse(fileContent), function (obj) {
                return template(obj, delimiters).source;
            });
            onload();
        },
        write: function (pluginName, name, write) {
            var toWrite = 'define(\'i18njs!' + name + '\', [], function () {\n    return ';
            var compiled = {};
            // Little hack to keep quotes on key names.
            function changeKeys (src, dest) {
                for (var i in src) {
                    if (typeof src[i] === 'object') {
                        dest[escapedSingleQuotes + i + escapedSingleQuotes] = {};
                        changeKeys(src[i], dest[escapedSingleQuotes + i + escapedSingleQuotes]);
                    } else {
                        dest[escapedSingleQuotes + i + escapedSingleQuotes] = src[i];
                    }
                }
            }

            changeKeys(buildMap[name], compiled);

            // We clean the stringify to be a simple string
            // parsed as javascript later.
            toWrite += JSON.stringify(compiled)
                // Save escaped quotes
                .replace(/\\\"/g, escapedDoubleQuotes)
                .replace(/\\\'/g, escapedSingleQuotes)
                // Remove new lines and double quotes
                .replace(/(\"|\\r|\\n|(  )+)/g, '')
                // Unescape what's too much escaped
                .replace(/\\\\/g, '\\')
                // Replace previously saved quotes
            // TODO : Add quotes for object's keys.
            toWrite += ';\n});\n';
                .replace(regexEscapedDoubleQuotes, '\"')
                .replace(regexEscapedSingleQuotes, '\'');
            write(toWrite);
        }
    }
});
