/**
 * Mocking client-server processing
 */
'use strict';

var Portfolios = exports;

var _portfoliosList = require('./portfoliosList.json');

var TIMEOUT = 100;

Portfolios.getPortfoliosList = function (timeout) {
    
    timeout = timeout || TIMEOUT;

    return new Promise( (resolve, reject) => {

        setTimeout(function () {
            resolve(_portfoliosList);
        }, timeout);
    })
};



            
