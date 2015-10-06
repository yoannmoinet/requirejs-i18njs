define(function (require) {
    var i18njs = require('../../node_modules/i18njs/dist/i18njs');
    var en = require('i18n!en.json');
    var enDeli = require('i18n!en.deli.json');
    i18njs.add('en', en);
    i18njs.add('en', 'deli', enDeli);
    return i18njs;
});
