'use strict';

var phCore = angular.module('phCore');

// fade element in on ng-show and out on ng-hide
phCore.animation('.fade-in-out', function() {
    return {
        beforeAddClass: function(element, className, done) {
            if (className == 'ng-hide') {
                // slide up
                jQuery(element).fadeOut(1000);
            }
            else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            if (className == 'ng-hide') {
                // hide then slidedown (else first slideDown doesn't trigger)
                jQuery(element).hide();
                jQuery(element).fadeIn(1000);
            }
            else {
                done();
            }
        }
    };
});
