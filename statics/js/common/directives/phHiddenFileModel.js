'use strict';

/* directives */

var commonDirectives = angular.module('commonDirectives');

/*
 * HiddenFileModel can be attached to any element.
 *
 * It will create a display: none input[type="file"] child element
 * 
 * It must have a id attribute.
 *
 * If it has multiple attribute, input will be multiple too.
 *
 * On click on element, browser window to upload file will popup.
 * 
 * attach directive like this to the element
 * <a ph-hidden-file-model="handleFileFunction" multiple id="file-input-1"></a>
 *
 * handleFileFunction must be a function.
 * it will be called for each file added to the
 * subjacent input element
 *
 * this allows to custom look of hideous defauld file input elements
 * easily
 *
 */

commonDirectives.directive('phHiddenFileModel', function () {
    return {
        restrict: 'A',
        template: function(element, attrs) {
            var label = element.text();
            var id = attrs.id + "hidden-file-input";
            var multiple = '';
            if (attrs.multiple) {
                multiple = "multiple";
            }
            return label + '<input id="' + id +'" \
                ph-file-model="' + attrs.phHiddenFileModel + '" \
                type="file"' + multiple + ' \
                style="display:none">';
        },
        link: function (scope, element, attrs) {
            var id = attrs.id + "hidden-file-input";
            var input = document.getElementById(id);
            element.bind('click', function(event) {
            console.log(input);
                if (input) {
                    input.click();
                }
            });
        }
    };
});

