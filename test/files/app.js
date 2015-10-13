define(function (require) {
    var i18njs = require('i18njs');
    var en = require('i18n!en.json');
    var enDeli = require('i18n!en.deli.json');
    require('i18n!enAuto.json?lang=en');
    require('i18n!enDefaults.json?defaults=true');
    i18njs.add('en', en);
    i18njs.add('en', 'deli', enDeli);
    return i18njs;
});
