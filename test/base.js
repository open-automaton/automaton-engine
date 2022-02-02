const path = require('path');
const express = require('express');

module.exports = (Automaton)=>{
    return {
        render : {
            table : (h, b)=>{
                let headers = b && h;
                let body = b || h;
                let result = '';
                if(headers) result += `<thead>${body.map((row)=>{
                    return `<tr>${row.map((item)=>{
                        return `<th>${item}</th>`
                    })}</tr>`
                })}</thead>`;
                result += `<tbody>${body.map((row)=>{
                    return `<tr>${row.map((item)=>{
                        return `<td>${item}</td>`
                    })}</tr>`
                })}</tbody>`;
                return `<table>${result}</table>`
            }
        },
        endpointsAgainstDefinition : function(endpoints, xml, engine, values, instance, complete){
            let done = complete;
            let app = instance;
            let data = values;
            if(typeof instance === 'function' && !complete){
                done = instance;
                app = null;
            }
            if(typeof values === 'function' && !complete){
                done = values;
                data = {};
                app = null;
            }
            if(!app) app = express();
            Object.keys(endpoints).forEach((method)=>{
                Object.keys(endpoints[method]).forEach((path)=>{
                    app[method.toLowerCase()](path, endpoints[method][path]);
                });
            });
            let server = app.listen(8080, (err)=>{
                if(err) throw err;
                let scraper = new Automaton({
                    body: xml,
                    environment : data
                }, engine);
                scraper.run((err, resultData)=>{
                    done(err, resultData, (cleanupComplete)=>{
                        server.close(()=>{
                            if(cleanupComplete) cleanupComplete();
                        });
                    });
                });
            });
        }
    };
};
