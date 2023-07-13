const should = require('chai').should();
const { DOM } = require('../src/dom-tool.js');

describe('strip-mine', function(){
    describe('automaton', function(){
        it('xpath works', function(){
            const result = DOM.xpathText(
                '//bar/baz/text()',
                '<foo><bar><baz>woot</baz></bar></foo>'
            );
            result.length.should.equal(1);
            should.exist(result[0]);
            result[0].should.equal('woot');
        });
    });
});
