'use strict';

/* App module */

var weblogApp = angular.module('weblogApp', [
        'weblogControllers',
]);

// instantiate modules 
var weblogControllers = angular.module('weblogControllers', ['ngSanitize']);
