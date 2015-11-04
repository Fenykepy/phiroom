'use strict';

var page = require('page');
var Promise = require('es6-promise').Promise;

class RouteStore {

    constructor() {

        // store this.alt
        this.ActionCreators = this.alt.getActions('ActionCreators');
        this.bindActions(this.ActionCreators);

        this.currentView = '----';

        this.exportPublicMethods({
            viewDefaultPortfolio: this.viewDefaultPortfolio.bind(this, this.ActionCreators),
            viewOnePortfolio: this.viewOnePortfolio.bind(this, this.ActionCreators),
            getCurrentView: this.getCurrentView.bind(this)
        });

        // page() routing, routing rules, browser, client side routing, stores, dispatcher, actions

        if ('undefined' !== typeof window) {
            // routing table, routing rules
            var routes = require('../routing.js');

            routes.forEach((item) => {
                page(item.path, this[item.handler].bind(this, this.ActionCreators));
            });

            setTimeout(function() {
                // router, client side routing
                page();
                console.log('Client Router');
            }, 0)
        }

    };

    viewDefaultPortfolio(ac, ctx) {
        return ac.r;

    getCurrentView() {
        return this.currentView;
    }

}


module.exports = RouteStore;
