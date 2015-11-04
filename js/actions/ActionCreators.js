'use strict';


var Promise = require('es6-promise').Promise;
var WebAPIUtils = require('../utils/WebAPIUtils');


class ActionCreators {
    constructor() {
        // public action
        this.generateActions(
            'nextPicture',
            'previousPicture',
            'openLightbox',
            'closeLightbox',
            'loadDefaultPortfolio',
            'loadOnePortfolio'
        );
    };


    readDefaultPortfolio(resolve) {
        var that = this;

        // server data fetching
        return WebAPIUtils
        
            .getDefaultPortfolio()
            
            .then(function success(arr) {
                // console.log( '\n ActionCreators default portfolio: ', arr);
                // action store view
                that.alt.getActions('ActionCreators').loadDefaultPortfolio(arr);
            })
    }
}

    

