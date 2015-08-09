({
    baseUrl: './',
    name: 'app',
    out: './temp/main.deli.built.js',
    optimize: 'none',
    packages: [
        {
            'name': 'i18njs',
            'location': '../../src/',
            'main': 'requirejs-i18njs',
            'delimiters': {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            }
        }
    ]
})
