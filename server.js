'use strict';


let React = require('react');
let express = require('express');
let path = require('path');

let Iso = require('iso');
let Flux = require('./js/flux');
let App = require('./js/components/App.jsx');

let app = express();


// Static directories to make css and js work
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// To generate index.html on the fly
let htmlStart = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <title></title>
            <meta charset="utf-8" />
            <base href="/">
            <link rel="stylesheet" href="/assets/css/phiroom.min.css" />

            <link rel="icon" type="image/png" href="/assets/images/phiroom-favicon.png" />
    
            <link
                rel = "alternate"
                type = "application/atom+xml"
                title = ""
                href = ""
            />
        </head>
        <body>
    `;

let htmlEnd = `
            <script src="build/bundle.js"></script>
        </body>
    </html>
`;


var routes = require('./js/routing.js');

routes.forEach((item) => {
    console.log( 'server routing rule> ', item );

    app.get(item.path, (req, res) => {

        console.log( '\n\nserver routing rule> ', req.url );

        // request flux instance
        var flux = new Flux();

        var RouteStore = flux.getStore('RouteStore');

        RouteStore[item.handler](req)
        .then( function success(result) {
            
            let markup = React.renderToString(React.createElement(App, {flux: flux}));

            let body = Iso.render(markup, flux.flush());

            res.send(`${htmlStart}${body}${htmlEnd}`);
        },

        function fail(err) {
            console.log('\nserver: ', err);
            res.sen('404 - Page Not Found');
        })

        .catch(function(foo){
            console.log('\nserver catch: ', foo );
        })
    });

})


app.get('*', function(req, res) {
    res.send('404 - Page Not Found');
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});









