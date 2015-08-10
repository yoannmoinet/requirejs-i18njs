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

    before(function (done) {
        // We configure requirejs before each unit.
        requirejs.config({
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

    it('should behave as expected in development and return a string for templates', function (done) {
        requirejs(['app'], function (app) {
            expect(app.get('normal')).to.be.eql('simple');
            expect(app.get('interpolate', data)).to.be.eql(data.interpolate);
            expect(app.get('escape', data)).to.be.eql('&#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;');
            expect(app.getDico().en.evaluate).to.be.a('string');
            done();
        });
    });

    it('should build the file', function (done) {
        exec('node ' + pathBuilder + ' -o ./test/files/build.js', function (err) {
            expect(fs.existsSync('./test/files/temp/main.built.js')).to.be.ok();
            done(err);
        });
    });

    it('should build the file with new delimiters', function (done) {
        exec('node ' + pathBuilder + ' -o ./test/files/build.deli.js', function (err) {
            expect(fs.existsSync('./test/files/temp/main.deli.built.js')).to.be.ok();
            done(err);
        });
    });

    it('should behave as expected in production and returns a function for templates', function (done) {
        requirejs.config({
            baseUrl: './test/files/temp'
        });
        requirejs.undef('app');
        requirejs(['main.built'], function () {
            requirejs(['app'], function (app) {
                expect(app.get('normal')).to.eql('simple');
                expect(app.get('interpolate', data)).to.be.eql(data.interpolate);
                expect(app.get('escape', data)).to.be.eql('&#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.get('namespace.in', data)).to.be.eql('We\'re in &#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.getDico().en.evaluate).to.be.a('function');
                done();
            });
        });
    });

    it('should behave as expected in production with new delimiters', function (done) {
        requirejs.undef('app');
        requirejs(['main.deli.built'], function () {
            requirejs(['app'], function (app) {
                expect(app.get('deli.normal')).to.eql('simple');
                expect(app.get('deli.interpolate', data)).to.be.eql(data.interpolate);
                expect(app.get('deli.escape', data)).to.be.eql('&#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.get('deli.namespace.in', data)).to.be.eql('We\'re in &#x27;&lt;the&gt;&#x27; &#x60;&amp;&#x60; &quot;World&quot;');
                expect(app.getDico().en.deli.evaluate).to.be.a('function');
                done();
            });
        });
    });

});
