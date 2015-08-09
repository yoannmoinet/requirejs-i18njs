({
    baseUrl: './',
    name: 'app',
    out: './temp/main.built.js',
    optimize: 'none',
    packages: [
        {
            'name': 'i18njs',
            'location': '../../src/',
            'main': 'requirejs-i18njs'
        }
    ]
})
