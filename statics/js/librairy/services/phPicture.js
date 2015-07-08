'use strict';

/* services */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.factory('phPicture', ['$http', 'phPictureDelete', 'phPatcher',
        function($http, phPictureDelete, phPatcher) {
    var base_url = '/api/librairy/';
    
    function buildApiListUrl(params) {
        var url;
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

    function builApiCurrentRelationUrl(pict_pk, container_pk) {
        if (self.container_type == 'post') {
            return buildApiPostPictRelationUrl(pict_pk, container_pk);
        }
    };


    var self = {
        container_pk: null,
        container_type: null,
        picts: [],
        getList: function(params) {
            self.container_type = params.source;
            self.container_pk = params.pk;
            var url = buildApiListUrl(params);
            // return a promise with pictures list
            return $http.get(url).success(function(data) {
                // store pictures list in service
                self.picts = data;
            }).error(function(data) {
                console.warn('phPicture.getList: error getting list from url: "'
                    + url, data);
            });
        },
        // add a picture to a container
        add: function(pict_pk, container_pk, container_type) {
            var url, data;
            if (container_type == "post") {
                url = api_post_pict_relation_base_url;
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
        del: function(pict, index) {
            var url;
            if (self.container_type == "folder") {
                // remove picture from server
                var promise = phPictureDelete.open(pict);
                promise.then(function() {
                    // remove picture from container on deletion success
                    self.picts.splice(index, 1);
                });
                return;
            }
            if (self.container_type == "post") {
                // remove picture from container
                url = buildApiPostPictRelationUrl(pict.pk, self.container_pk);
            }
            // optimistically remove picture from container
            var deleted_pict = self.picts.splice(index, 1)[0];
            $http.delete(url).error(function(data) {
                // add back picture to list
                self.picts.splice(index, 0, deleted_pict);
                console.warn('phPicture.del: error deleting pict "' + pict_pk +
                    '" from ' + self.container_type + ' "' + self.container_pk + '".', data); 
            });
        },
        /* move a picture in the list
         * 
         * pict: moved picture object
         * target: picture object picture has been dropped in
         * before: boolean, true if picture must be insert before target.
         */
        move: function(pict, target, before) {
            function print_order() {
                var order = [];
                for (var i=0, l=self.picts.length; i < l; i++) {
                    order.push(self.picts[i].pk);
                };
                return order;
            };
            // optimistically reorder pictures
            var pict_index = self.picts.indexOf(pict);
            var target_index = self.picts.indexOf(target);
            // keep track of old order to change picture's relations which
            // have changed
            // stoped because pictures with default null order where not updated
            //var old_state = print_order();
            // if picture is dropped on itself, return
            if (pict_index == target_index) {
                return;
            }
            // if picture is dropped on next one with before
            if (before && target_index == pict_index + 1) {
                return;
            }
            // if picture is dropped on previoud one without before
            if (! before && target_index == pict_index - 1) {
                return;
            }
            pict = self.picts.splice(pict_index, 1)[0];
            var new_index = self.picts.indexOf(target);

            // insert picture
            if (! before) {
                new_index = new_index + 1;
            }

            self.picts.splice(new_index, 0, pict);

            var new_state = print_order();

            
            // send modifications to server
            for (var i=0, l=self.picts.length; i < l; i++) {
                // stoped because pictures with default null order where not updated
                /*if (old_state[i] == new_state[i]) {
                    // no change, continue
                    continue;
                }*/
                var url = builApiCurrentRelationUrl(
                        new_state[i], 
                        self.container_pk
                );
                var data = {order: i + 1};
                console.log('url', url);
                console.log('data', data);
                $http.patch(url, data).error(function(msg) {
                    console.log('phPicture.move: error sending change to server with url:' +
                            url + ' and data ' + data, msg);
                });
            };
        }
    };
    return self;
}]);


phLibrairy.factory('phPictureDelete', ['$http', '$q', 'phModal',
        function($http, $q, phModal) {
    // delete a picture from server via modal window
    var self = {
        // get url that submit can be used without call to open()
        pict: {},
        reset: function() {
            /* close modal and reinit default properties */
            phModal.init();
            self.pict = {};
            self.deferred.reject();
        },
        open: function(pict) {
            self.pict = pict;
            phModal.init();
            phModal.templateUrl = "/assets/partials/librairy/librairy_delete.html";
            phModal.title = "Delete a picture"
            phModal.close_callback = self.reset;
            phModal.show = true;

            // return a promise, to delete picture from list on success
            self.deferred = $q.defer();
            
            return self.deferred.promise;
        },
        submit: function() {
            if (! self.pict.url) {
                console.warn('phPictureDelete: no url provided.');
                self.deferred.reject();
                return;
            }
            return $http.delete(self.pict.url).success(function(data) {
                self.deferred.resolve();
                self.reset();
            }).error(function(data) {
                self.deferred.reject();
                console.warn('phPictureDelete.submit: error deleting url "' + self.pict.url,
                        data);
            });

        }
    };
    return self;
}]);
