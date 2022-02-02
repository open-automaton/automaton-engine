module.exports = (Automaton, should)=>{
    const base = require('../base.js')(Automaton);

    return (engine, complete)=>{
        let startTime = (new Date()).getTime();
        base.endpointsAgainstDefinition({
            "GET" : {
                "/" : (req, res)=>{
                    res.setHeader('content-type', 'text/html')
                    res.send(`<html>
                        <head>
                            <script>
                                let toRender = '${base.render.table([
                                    ['foo', 'bar', 'baz']
                                ])}';
                                setTimeout(()=>{
                                    document.body.innerHTML = toRender;
                                }, 5 * 1000);
                            </script>
                        </head>
                        <body></body>
                    </html>`);
                }
            }
        }, `
        <go url="http://\${host}/" until-exists="//table">
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
            let finishTime = (new Date()).getTime();
            let difference = finishTime - startTime;
            difference.should.be.above(5000);
            should.not.exist(err);
            should.exist(data);
            should.exist(data.matches);
            should.exist(data.matches[0]);
            should.exist(data.matches[0].first);
            should.exist(data.matches[0].second);
            should.exist(data.matches[0].third);
            data.matches[0].first.should.equal('foo');
            data.matches[0].second.should.equal('bar');
            data.matches[0].third.should.equal('baz');
            cleanup(()=>{
                complete();
            })
        });
    }
}
