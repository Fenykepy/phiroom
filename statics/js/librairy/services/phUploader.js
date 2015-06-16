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
        phModal.templateUrl = "/assets/partials/librairy/librairy_uploader.html"
        phModal.title = "Upload pictures";
        phModal.max_window = true;
        phModal.close_callback = phUploader.close;
        phModal.show = true;
    };

    phUploader.submit = function() {
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
        phUploader.close();
    };

    phUploader.close = function() {
        // reset files array
        phUploader.files = [];
        // reset modal window
        phModal.init();
    };


    return phUploader;
}]);
