module.exports = (Automaton, should)=>{
    const base = require('../base.js')(Automaton);

    return (engine, complete)=>{
        let startTime = (new Date()).getTime();
        base.endpointsAgainstDefinition({
            "GET" : {
                "/" : (req, res)=>{
                    res.setHeader('content-type', 'text/html')
                    res.send(`<html>
                        <head></head>
                        <body>${base.render.table([ ['foo', 'bar', 'baz'] ])}</body>
                    </html>`);
                }
            }
        }, `
        <go url="http://\${host}/" delay="5s" timeout="2s">
            <set xpath="//table/tbody/tr" push="true" variable="matches">
                <set xpath="//td[1]/text()" variable="first"></set>
                <set xpath="//td[2]/text()" variable="second"></set>
                <set xpath="//td[3]/text()" variable="third"></set>
            </set>
            <emit variables="matches"></emit>
        </go>
        `, engine, {
            host : 'localhost:8080'
        }, (err, data, cleanup)=>{
            should.exist(err);
            should.exist(err.message);
            err.message.should.equal('Action timed out');
            let finishTime = (new Date()).getTime();
            let difference = finishTime - startTime;
            difference.should.be.above(2000);
            difference.should.be.below(5000);
            cleanup(()=>{
                complete();
            })
        });
    }
}
