define({
    version: '0.0.1',
    pluginBuilder: './i18njs-builder',
    load: function (name, req, onload, config) {
        req('json!' + name, function (raw) {
            console.log('IS BUILD ? ' + config.isBuild ? true : false);
            onload(raw);
        });
    }
});
