'use strict'

var librairyDirectives = angular.module('librairyDirectives');

librairyDirectives.directive('phFilePreview', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var file = scope[attrs.phFilePreview];
            var imageType = /image.*/;
            
            // return when file is not an image
            if (! file.type.match(imageType)) {
                console.log('File not supported:');
                console.log(file);
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                attrs.$set('src', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
});
