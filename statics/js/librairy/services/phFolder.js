'use strict';

/* define a Folder service :
 *
 * 
 * */

var librairyServices = angular.module('librairyServices');


librairyServices.factory('phFolder', ['$http', function($http) {
    // hierarchical folder list url:
    var url = '/api/librairy/directorys/';
    var data = {};
    function getDirectorys() {
        $http.get(url).
            success(function(data) {
                data = data.results;
            });
        console.log(data);
        return data;
    };

    return {
        data: data,
        getDirectorys: getDirectorys,
        rootDir: { // false directory for dragging to root
            name: 'Root directory',
            pk: null
        }
    }
}]);
