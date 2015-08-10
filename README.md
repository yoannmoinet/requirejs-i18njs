# requirejs-i18njs

> A [RequireJS](http://requirejs.org/) plugin to pre-compile [I18NJS](https://github.com/yoannmoinet/i18njs)' translations

[![npm version](https://img.shields.io/npm/v/requirejs-i18njs.svg?style=flat)](http://badge.fury.io/js/requirejs-i18njs)
[![bower version](https://img.shields.io/bower/v/requirejs-i18njs.svg?style=flat)](http://bower.io/search/?q=requirejs-i18njs)
[![travis](https://travis-ci.org/yoannmoinet/requirejs-i18njs.svg)](https://travis-ci.org/yoannmoinet/requirejs-i18njs)

----

## Overview

This plugins lets you pre-compile the templates in your translation files.

You won't have any unsafe eval in your production code and will gain some execution time too.

----

## Install
Either

```node
npm install requirejs-i18njs --save
```
or

```node
bower install requirejs-i18njs --save
```

----

## Test

```node
npm test
```

----

## Usage
### Configuration
To use with [RequireJS](http://requirejs.org/) and [I18NJS](https://github.com/yoannmoinet/i18njs).

You'll have to configure a new [package](http://requirejs.org/docs/api.html#config-packages) in your RequireJS' config.

```javascript
({
    packages: [
        {
            'name': 'i18n',
            // The location where the package is installed
            'location': './node_modules/requirejs-i18njs/src/',
            // The main file
            'main': 'requirejs-i18njs'
        }
    ]
})
```

You can also configure some new delimiters for your templates :

```javascript
({
    packages: [
        {
            'name': 'i18n',
            'location': './node_modules/requirejs-i18njs/src/',
            'main': 'requirejs-i18njs',
            'delimiters': {
                'evaluate': /<%([\s\S]+?)%>/g,
                'interpolate': /<%=([\s\S]+?)%>/g,
                'escape': /<%-([\s\S]+?)%>/g
            }
        }
    ]
})
```
This will result in pre-compiling delimiters in the form of `<%=interpolate%>`, `<%evaluate%>` or `<%-escape%>`.

### Usage
You'll then be able to import your locales with :

```javascript
var fr = require('i18n!./locales/fr.json');
i18njs.add('fr', fr);
```

Also, you can tell which language you want to subscribe your strings to by providing the lang as a parameter :

```javascript
require('i18n!./locales/fr.json?lang=fr');
```
It will execute `i18n.add('fr', locales);` directly from the plugin.

For this to work, you'll need to have [I18NJS](https://github.com/yoannmoinet/i18njs) imported first.

You can use your [`require.config.deps`](http://requirejs.org/docs/api.html#config-deps) for this :
```javascript
require.config({
    // Note that this is at the root of the config.
    deps: ['i18njs']
});
```
This will load `i18njs` before everything else.
