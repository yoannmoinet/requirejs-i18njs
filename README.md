# requirejs-i18njs
----
> A [RequireJS](http://requirejs.org/) plugin to pre-compile [I18NJS](https://github.com/yoannmoinet/i18njs)' translations

[![npm version](https://img.shields.io/npm/v/requirejs-i18njs.svg?style=flat)](http://badge.fury.io/js/i18njs)
[![bower version](https://img.shields.io/bower/v/requirejs-i18njs.svg?style=flat)](http://bower.io/search/?q=i18njs)
[![travis](https://travis-ci.org/yoannmoinet/requirejs-i18njs.svg)](https://travis-ci.org/yoannmoinet/i18njs)

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
To use with [RequireJS](http://requirejs.org/) and [I18NJS](https://github.com/yoannmoinet/i18njs).

You'll have to configure a new [package](http://requirejs.org/docs/api.html#config-packages) in your RequireJS' config.

```javascript
({
    packages: [
        {
            'name': 'i18njs',
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
            'name': 'i18njs',
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
