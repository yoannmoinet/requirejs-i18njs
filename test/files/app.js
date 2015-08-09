define(function (require) {
    var i18njs = require('../../node_modules/i18njs/i18njs');
    var en = require('i18njs!en.json');
    var enDeli = require('i18njs!en.deli.json');
    i18njs.add('en', en);
    i18njs.add('en', 'deli', enDeli);
    return i18njs;
});
