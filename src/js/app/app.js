'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;


var Weblog = require('./components/Weblog');

var routes = (
    <Route handler={PhiroomApp}>
        <Route path="weblog" handler={Weblog}/>
        <Route path="portfolios" handler={Portfolio}/>
        <Route path="contact" handler={Contact}/>
        <Route path="librairy" handler={Librairy}/>
    </Route>
);


// render main component
Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
});


