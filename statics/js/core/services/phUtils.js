'use strict';

/* service */

var phCore = angular.module('phCore');


phCore.factory('phUtils', function() {
    var phUtils = {};

    phUtils.listContains = function(list, value) {
        /* returns index if value is in list
         * otherwise returns false
         */
        for (var i=0; i < list.length; i++) {
            if (list[i] === value) return i;
        }
        return false;
    };

    phUtils.listContainsFromList = function(list, value_list) {
        /* returns index of value_list if one of value_list item is in list
         * returns false otherwise
         */
        for (var i=0; i <list.length; i++) {
            if (phUtils.listContains(list, value_list[i]) !== false) return i;
        }
        return false;
    };

    phUtils.objectHasKey = function(object, key) {
        /* returns true if object has key */
        if (phUtils.listContains(Object.keys(object), key) !== false) {
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
