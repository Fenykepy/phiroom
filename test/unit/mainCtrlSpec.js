describe('mainCtrl', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {};
            ctrl = $controller('mainCtrl', {$scope:scope});
        });
    });


    it('should create "page_info" model, with empty infos', function() {
        expect(scope.page_info.title).toBe('');
        expect(scope.page_info.name).toBe('');
    });

});
