'use strict';

/*
 * define a Modal service :
 *
 * store state of modal window (open or not)
 * store template to include in window
 * store if window has buttons
 * store validation or cancellation buttons label
 *
 * define a "close" function
 *
 */

var commonServices = angular.module('commonServices');


commonServices.factory('phModal', function () {
    
    var default_values = {
        show: false,    // wherever or not window is visible
        templateUrl: '',    // templateUrl to include
        title: 'Modal', // window title
        closable: true,  // if window is closable without validation
        buttons: true,  // if buttons are displayed
        save_label: 'Save', // save button label
        cancel_label: 'Cancel', // cancel button label
        max_window: false, // max size window
        large_window: false, // large size window
        small_window: false, // small size window
        callback: false, // validating function (must return true)
    };
    
    var phModal = {};
    

    phModal.close = function() {
        // if window is not closable (forced validation) return
        if (this.closable === false) {
            console.log('Modal is not closable');
            return;
        }
        // first hide window
        this.show = false;
        // then restaure values to default
        for (var prop in default_values) {
            if (default_values.hasOwnProperty(prop)) {
                this[prop] = default_values[prop];
            }
        }
    };

    phModal.validate = function() {
        // execute callback (on save button click),
        // if it returns true, close.
        this.callback()
        return
    }
    // set values to default at init
    phModal.close();

    return phModal;
});
