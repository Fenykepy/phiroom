describe('librairyCreateFolderCtrl', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {};
            ctrl = $controller('librairyCreateFolderCtrl', {$scope:scope});
        });
    });


    it('should publish phFolder service in scope', function() {
        expect(scope.phFolder.newDir.name).not.toBe(undefined);
        expect(scope.phFolder.newDir.parent).not.toBe(undefined);
    });
});
