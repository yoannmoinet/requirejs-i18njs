var expect = require('expect.js');
var fs = require('fs');
var exec = require('child_process').exec;
var pathBuilder = './node_modules/requirejs/bin/r.js';
var requirejs = require('requirejs');

describe('requirejs-i18njs', function () {
    // Some data to test templating feature.
    var data = {
        interpolate: 'Hello',
        escape: '\'<the>\' `&` "World"'
    };

    var parse = function (obj, cb) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (typeof obj[i] === 'object') {
                    parse(obj[i], cb);
                } else {
                    cb(obj[i], i);
                }
            }
        }
    };

    before(function (done) {
        // We configure requirejs before each unit.
        requirejs.config({
            deps: ['i18njs'],
            paths: {
                i18njs: '../../node_modules/i18njs/dist/i18njs'
            },
            baseUrl: 'test/files',
            nodeRequire: require,
            packages: [
                {
                    'name': 'i18n',
                    'location': '../../src/',
                    'main': 'requirejs-i18njs'
                }
            ]
        });
        done();
    });

    after(function (done) {
        // We remove temp files and folder.
        fs.unlinkSync('./test/files/temp/main.built.js');
        fs.unlinkSync('./test/files/temp/main.deli.built.js');
        fs.rmdirSync('./test/files/temp');
        done();
    });

    describe('development', function () {
        it('should return a string for templates', function (done) {
            requirejs(['app'], function (app) {
                var dico = app.getDico();
                parse(dico, function (a) {
                    expect(a).to.be.a('string');
                });
                done();
            });
        });
        it('should return the correct value for normals', function (done) {
            requirejs(['app'], function (app) {
                expect(app.get('normal')).to.be.eql('simple');
                expect(app.get('spaced key')).to.be.eql('key');
                done();
            });
        });
        it('should correctly behave with templates', function (done) {
            requirejs(['app'], function (app) {
                expect(app.get('interpolate', data))
                    .to.be.eql(data.interpolate);
                expect(app.get('escape', data)).to.be
                    .eql('&#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.get('namespace.in', data)).to.be
                    .eql('We\'re in &#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                done();
            });
        });
        it('should correctly behave with defaults', function (done) {
            requirejs(['app'], function (app) {
                expect(app.get('keyDefaultEN')).to.be.eql('DefaultEN');
                expect(app.get('keyDefault')).to.be.eql('Default');
                expect(app.get('keyAuto')).to.be.eql('Automatic');
                expect(app.get('interpolateDefault')).to.be.eql('Default');
                expect(app.get('interpolateDefaultEN')).to.be.eql('DefaultEN');
                done();
            });
        });
    });

    describe('build', function () {
        it('should build the file', function (done) {
            exec('node ' + pathBuilder + ' -o ./test/files/build.js',
                function (err, stdout, stderr) {
                    expect(fs.existsSync('./test/files/temp/main.built.js'))
                        .to.be.ok();
                    done(err);
                });
        });

        it('should build the file with new delimiters', function (done) {
            exec('node ' + pathBuilder + ' -o ./test/files/build.deli.js',
                function (err, stdout, stderr) {
                    expect(fs
                        .existsSync('./test/files/temp/main.deli.built.js'))
                        .to.be.ok();
                    done(err);
                });
        });
    });

    describe('production', function () {
        it('should return the correct value for normals', function (done) {
            requirejs.config({
                baseUrl: './test/files/temp'
            });
            requirejs.undef('app');
            requirejs(['main.built'], function () {
                var app = requirejs('app');
                expect(app.get('normal')).to.be.eql('simple');
                expect(app.get('spaced key')).to.be.eql('key');
                done();
            });
        });
        it('should correctly behave with templates', function (done) {
            requirejs(['main.built'], function () {
                var app = requirejs('app');
                expect(app.get('interpolate', data))
                    .to.be.eql(data.interpolate);
                expect(app.get('escape', data)).to.be
                    .eql('&#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.get('namespace.in', data)).to.be
                    .eql('We\'re in &#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                done();
            });
        });
        it('should correctly behave with defaults', function (done) {
            requirejs(['main.built'], function () {
                var app = requirejs('app');
                expect(app.get('keyDefaultEN')).to.be.eql('DefaultEN');
                expect(app.get('keyDefault')).to.be.eql('Default');
                expect(app.get('keyAuto')).to.be.eql('Automatic');
                expect(app.get('interpolateDefault')).to.be.eql('Default');
                expect(app.get('interpolateDefaultEN'))
                    .to.be.eql('DefaultEN');
                done();
            });
        });
    });

    describe('production with new delimiters', function (done) {
        it('should return the correct value for normals', function (done) {
            requirejs.config({
                baseUrl: './test/files/temp'
            });
            requirejs.undef('app');
            requirejs(['main.deli.built'], function () {
                var app = requirejs('app');
                expect(app.get('deli.normal')).to.be.eql('simple');
                expect(app.get('deli.spaced key')).to.be.eql('key');
                done();
            });
        });
        it('should correctly behave with templates', function (done) {
            requirejs(['main.deli.built'], function () {
                var app = requirejs('app');
                expect(app.get('deli.interpolate', data))
                    .to.be.eql(data.interpolate);
                expect(app.get('deli.escape', data)).to.be
                    .eql('&#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.get('deli.namespace.in', data)).to.be
                    .eql('We\'re in &#x27;&lt;the&gt;&#x27; ' +
                    '&#x60;&amp;&#x60; &quot;World&quot;');
                done();
            });
        });
        it('should correctly behave with defaults', function (done) {
            requirejs(['main.deli.built'], function () {
                var app = requirejs('app');
                expect(app.get('keyDefaultEN')).to.be.eql('DefaultEN');
                expect(app.get('keyDefault')).to.be.eql('Default');
                expect(app.get('keyAuto')).to.be.eql('Automatic');
                expect(app.get('interpolateDefault')).to.be.eql('Default');
                expect(app.get('interpolateDefaultEN'))
                    .to.be.eql('DefaultEN');
                done();
            });
        });
    });
});
