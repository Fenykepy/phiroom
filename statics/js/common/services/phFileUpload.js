'use strict';

/*
 * define a file upload service:
 *
 */

var commonServices = angular.module('commonServices');


commonServices.service('phFileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, url){
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }
}]);
