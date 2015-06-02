describe('librairyCtrl', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {
                $parent: {
                    page_info: {
                        title: '',
                        name: '',
                    }
                }
            };
            ctrl = $controller('librairyCtrl', {$scope:scope});
        });
    });


    it('should populate parent "page_info" model, with good infos', function() {
        expect(scope.$parent.page_info.title).toBe('Librairy');
        expect(scope.$parent.page_info.name).toBe('librairy');
    });

});
