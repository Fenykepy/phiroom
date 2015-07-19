describe('librairyCtrl', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {
                page_info: {
                        title: '',
                        name: '',
                }
            };
            ctrl = $controller('librairyCtrl', {$scope:scope});
        });
    });


    it('should populate parent "page_info" model, with good infos', function() {
        expect(scope.page_info.title).toBe('Librairy');
        expect(scope.page_info.name).toBe('librairy');
    });

    it('should publish phUploader service in scope', function() {
        expect(angular.isFunction(scope.phUploader.open)).toBe(true)
    });

    it('should publish phFolder service in scope', function() {
        expect(scope.phFolder.directorys).toEqual([]);
        expect(scope.phFolder.rootDir).not.toEqual(undefined);
        expect(angular.isFunction(scope.phFolder.mkDir)).toBe(true)
    });

});
