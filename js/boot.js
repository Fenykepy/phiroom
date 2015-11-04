'use strict';

require('es5-shim');
require('es5-shim/es5-sham');

var React = require('react');
var App = require('./components/App.jsx');

var Iso = require('iso');
var Flux = require('./flux');
var flux = new Flux();

// bootstrap server side encoded store
Iso.bootstrap(function (state, meta, container) {
    flux.bootstrap(state);

    // render with flux instance
    React.render( React.createElement(App, {flux: flux}), container);
});
