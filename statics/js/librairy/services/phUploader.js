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


    // function to hundle new files
    phUploader.handleFile = function(file) {
        console.log('handle file:');
        console.log(file);
        // add file to list of files
        phUploader.files.push(file);
        console.log(phUploader.files);
    };

    // function to open new uploader modal window
    phUploader.open = function() {
        // modal validation function
        function validate() {
            var files = phUploader.files
            // upload files
            for( var i=0; i < files.length; i++) {
                phFileUpload.uploadFileToUrl(
                    phUploader.files[i], url
                ).success(function(data) {
                    console.log('successfully uploaded file:');
                    console.log(data);
                }).error(function(data) {
                    console.log('error uploading file:');
                    console.log(data);
                });
            }
            phModal.close();
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
