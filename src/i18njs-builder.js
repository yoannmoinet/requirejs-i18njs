define({
    version: '0.0.1',
    load: function (name, req, onload, config) {
        req(['i18njs'], function (i18njs) {
            console.log(name, config);
        });
    }
});
