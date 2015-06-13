'use strict';

/* 
 * define an Uploader service :
 *
 * upload pictures via modal window
 *
 * */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.factory('phUploader', ['phModal', 'phFileUpload', function(phModal, phFileUpload) {
    // hierarchical folder list url:
    var url = '/api/librairy/pictures/';
    var phUploader = {};

    // store files
    phUploader.files = [];


    // function to hundle new files
    phUploader.handleFiles = function(files) {
        // add file to list of files
        for (var i=0; i < files.length; i++) {
            phUploader.files.push(files[i]);
        }
    };

    // function to delete a file from list
    phUploader.delFile = function(index) {
        phUploader.files.splice(index, 1);
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
            phUploader.files = [];
            phModal.close();
        };
        function cancel() {
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
        phModal.cancel_callback = cancel;
        phModal.show = true;
    };


    return phUploader;
}]);
