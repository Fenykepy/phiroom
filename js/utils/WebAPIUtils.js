'use strict';

var Promise = require('es6-promise').Promise;
var API = require('../api/portfolios');
module.exports = {
    
    getPortfolios: function() {
        return API.getPortfolios();
    },

    getDefaultPortfolio: function() {
        return API.getDefaultPortfolio();
    },

    getOnPortfolio: function(slug) {
        return API.getOnePortfolio(slug);
    }
};



