define({
    version: '0.0.1',
    // Target our builder for the optimizer.
    pluginBuilder: './i18njs-builder',
    load: function (name, req, onload, config) {
        // Inject plugins.
        config.paths.json = '../../node_modules/requirejs-plugins/src/json';
        config.paths.text = '../../node_modules/requirejs-plugins/lib/text';
        // Load the file as JSON
        req(['json!' + name], function (raw) {
            // We're in development, so we deliver the file raw.
            onload(raw);
        });
    }
});
