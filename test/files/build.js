({
    deps: ['i18njs'],
    paths: {
        i18njs: '../../node_modules/i18njs/dist/i18njs'
    },
    baseUrl: './',
    name: 'app',
    out: './temp/main.built.js',
    optimize: 'none',
    packages: [
        {
            'name': 'i18n',
            'location': '../../src/',
            'main': 'requirejs-i18njs'
        }
    ]
});
