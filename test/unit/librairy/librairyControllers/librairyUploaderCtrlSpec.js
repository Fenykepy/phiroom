describe('librairyUploaderCtrl', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {};
            ctrl = $controller('librairyUploaderCtrl', {$scope:scope});
        });
    });


    it('should publish phUploader service in scope', function() {
        expect(scope.files).toEqual([]);
        expect(angular.isFunction(scope.handleFiles)).toBe(true);
        expect(angular.isFunction(scope.delFile)).toBe(true);
    });


});
