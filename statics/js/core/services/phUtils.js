'use strict';

/* service */

var phCore = angular.module('phCore');


phCore.factory('phUtils', function() {
    var phUtils = {};

    phUtils.indexOf = function(list, value) {
        /* returns index if value is in list
         * otherwise returns -1
         */
        for (var i=0; i < list.length; i++) {
            if (list[i] === value) return i;
        }
        return -1;
    };

    phUtils.indexOfFromList = function(list, value_list) {
        /* returns index of value_list if one of value_list item is in list
         * returns -1 otherwise
         */
        for (var i=0; i <list.length; i++) {
            if (phUtils.indexOf(list, value_list[i]) !== -1) return i;
        }
        return -1;
    };

    phUtils.objectHasKey = function(object, key) {
        /* returns true if object has key */
        if (phUtils.indexOf(Object.keys(object), key) !== -1) {
            return true;
        }
        return false;
    };

    phUtils.objectKeyEqual = function(object, key, value) {
        /* returns true if has key and it equals value */
        if (phUtils.objectHasKey(object, key) && object[key] === value) {
            return true;
        }
        return false;
    };

    phUtils.getObjectIndexByKey = function(list, key, value) {
        /* returns index of object where key == value in list */
        for (var i=0; i < list.length; i++) {
            if (phUtils.objectKeyEqual(list[i], key, value)) {
                return i;
            }
        }
        return false;
    };

    return phUtils;
});
