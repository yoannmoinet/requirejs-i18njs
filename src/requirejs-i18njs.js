define({
    // Target our builder for the optimizer.
    pluginBuilder: './i18njs-builder',
    load: function (name, req, onload, config) {
        var args = {};
        var i18njs;
        var arName = name.split(/(?:\?|\&)/g);
        name = arName[0];

        if (req.defined('i18njs')) {
            i18njs = req('i18njs');
        }

        // Export parameters
        arName.splice(1)
            .forEach(function (val) {
                var vals = val.split('=');
                args[vals[0]] = vals[1];
            });

        // Inject plugins.
        config.paths.json = '../../node_modules/requirejs-plugins/src/json';
        config.paths.text = '../../node_modules/requirejs-plugins/lib/text';

        // Simply load the file as JSON
        req(['json!' + name], function (raw) {
            if (i18njs && typeof i18njs.add === 'function') {
                // Add to the dico
                if (args.lang) {
                    i18njs.add(args.lang, raw);
                }
            } else if (args.lang || args.defaults) {
                console.warn('[requirejs-i18njs]\n' +
                    'I18nJS isn\'t defined.\n' +
                    'You need to import it before using this plugin to' +
                        'register your locales.');
            }
            // We're in development, so we deliver the file raw.
            onload(raw);
        });
    }
});
