'use strict';

/* services */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.factory('phPicture', ['$http', function($http) {
    var base_url = '/api/librairy/';
    
    function buildApiListUrl(params) {
        if (params.source == "folder") {
            url = base_url + 'directorys/';
        }
        if (params.source == "post") {
            url = base_url + 'posts/';
        }
        return url + params.pk + '/pictures/';
    };


    var api_post_pict_relation_base_url = base_url + 'post-pict/';
    function buildApiPostPictRelationUrl(pict_pk, post_pk) {
            return api_post_pict_relation_base_url + 'post/' +
                post_pk + '/pict/' + pict_pk + '/';
    };


    var self = {
        container_pk: null,
        container_type: null,
        picts: [],
        getList: function(params) {
            self.container_type = params.source;
            self.container_pk = params.pk;

            // return a promise with pictures list
            return $http.get(buildApiListUrl(params))
                .success(function(data) {
                // store pictures list in service
                self.picts = data;
            });
        },
        // add a picture to a container
        add: function(pict_pk, container_pk, container_type) {
            var url, data;
            if (container_type == "post") {
                url = api_post_pict_relation_url;
                data = {
                    picture: pict_pk,
                    post: container_pk
                };
            }
            return $http.post(url, data).error(function(data) {
                console.warn('phPicture.add: error adding pict "' + pict_pk +
                        '" to ' + container_type + ' "' + container_pk + '".', data); 
            });
        },
        // delete a picture from it's container
        del: function(pict_pk, index) {
            var url;
            if (self.container_type == "post") {
                url = buildApiPostPictRelationUrl(pict_pk, self.container_pk);
            }
            // optimistically remove picture from container
            var deleted_pict = self.picts.splice(index, 1)[0];
            return $http.delete(url)
                .error(function(data) {
                    // add back picture to list
                    self.picts.splice(index, 0, deleted_pict);
                    console.warn('phPostDetail.delPict: error deleting pict "' + pict_pk +
                        '" from ' + self.container_type + ' "' + self.container_pk + '".', data); 
            });
        }
    };
    return self;
}]);


