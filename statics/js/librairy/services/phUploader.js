'use strict';

/* 
 * define an Uploader service :
 *
 * upload pictures via modal window
 *
 * */

var librairyServices = angular.module('librairyServices');


librairyServices.factory('phUploader', ['$http', 'phModal', 'phFileUpload', function($http, phModal, phFileUpload) {
    // hierarchical folder list url:
    var url = '/api/librairy/pictures/';
    var phUploader = {};

    // store files
    phUploader.files = [];

    // function to open new uploader modal window
    phUploader.open = function() {
        // modal validation function
        function validate() {
            console.log(phUploader.files);
            // upload file
            var filePromise = phFileUpload.uploadFileToUrl(
                    phUploader.files, url
            ).success(function(data) {
                phModal.close();
            });
        };
        function close() {
            /* reset parameters like selected files array
             * before closing modal window
             */
            phUploader.files = [];
        };

        phModal.templateUrl = "/assets/partials/librairy/librairy_uploader.html"
        phModal.title = "Upload pictures";
        phModal.validate_label = "Upload";
        phModal.max_window = true;
        phModal.validate_callback = validate;
        phModal.close_callback = close;
        phModal.show = true;
    };


    return phUploader;
}]);
