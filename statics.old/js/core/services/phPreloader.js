'use strict';

/* services */

var phCore = angular.module('phCore');

phCore.factory('phPreloader', ['$q', function($q) {
    var phPreloader = {};

    function Loader(image_url) {
        this.url = image_url;
        this.deferred = $q.defer();
        this.promise = this.deferred.promise;
        this.states = {
            PENDING: 1,
            LOADING: 2,
            RESOLVED: 3,
            REJECTED: 4
        };
        // to keep track of current state
        this.state = this.states.PENDING;
    };

    Loader.prototype = {
        constructor: Loader,

        /*
         * Public methods
         *
         */

        // to determine state of loader
        isInitiated: function isInitiated() {
            return this.state !== this.states.PENDING;
        },

        isResolved: function isResolved() {
            return this.state === this.statest.RESOLVED;
        },

        isRejected: function isRejected() {
            return this.state === this.states.REJECTED;
        },

        load: function load() {
            var self = this;
            // return promise if initiated
            if (this.isInitiated()) {
                return this.promise;
            }

            this.state = this.states.LOADING;
            
            // set "src" last else some browser may not trigger load event
            var image = $(new Image()).load(function(event) {
                self.state = self.states.RESOLVED;
                self.deferred.resolve(self.url);
            }).error(function(event) {
                self.state = self.states.REJECTED;
                console.error('fail to load: ' + self.url);
                self.deferred.reject(self.url);
            }).prop(
                "src", self.url
            );


            return this.promise;
        }
    };

    phPreloader.load = function(image_url) {
            var loader = new Loader(image_url);
            

            return loader.load();
    };

    
    return phPreloader;
}]);
