define(function () {
    var fs = nodeRequire('fs');
    var buildMap = {};
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
        version: '0.0.1',
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
                if (pkg.name === 'i18njs') {
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

            // Precompile the templates
            // TODO : Make it only if we find moustaches.
            var result = parse(JSON.parse(fileContent), function (obj) {
                return template(obj, delimiters).source;
            });

            // Store it for later use.
            buildMap[name] = result;
            onload();
        },
        write: function (pluginName, name, write) {
            var compiled = buildMap[name];
            var toWrite = 'define(\'i18njs!' + name + '\', [], function () {\n    return ';
            // We clean the stringify to be a simple string
            // parsed as javascript later.
            toWrite += JSON.stringify(compiled)
                // Save escaped quotes
                .replace(/\\\"/g, '__escaped_double_quote')
                .replace(/\\\'/g, '__escaped_single_quote')
                // Remove new lines and double quotes
                .replace(/(\"|\\r|\\n|(  )+)/g, '')
                // Unescape what's too much escaped
                .replace(/\\\\/g, '\\')
                // Replace previously saved quotes
                .replace(/__escaped_double_quote/g, '\"')
                .replace(/__escaped_single_quote/g, '\'');
            // TODO : Add quotes for object's keys.
            toWrite += ';\n});\n';
            write(toWrite);
        }
    }
});
