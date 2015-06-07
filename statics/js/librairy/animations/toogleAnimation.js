'use strict';

var phLibrairy = angular.module('phLibrairy');

// toogle submenus with slide effect
phLibrairy.animation('.submenu', function() {
    return {
        beforeAddClass: function(element, className, done) {
            if (className == 'ng-hide') {
                // slide up
                jQuery(element).slideUp('normal');
            }
            else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            if (className == 'ng-hide') {
                // hide then slidedown (else first slideDown doesn't trigger)
                jQuery(element).hide();
                jQuery(element).slideDown('normal');
            }
            else {
                done();
            }
        }
    };
});
