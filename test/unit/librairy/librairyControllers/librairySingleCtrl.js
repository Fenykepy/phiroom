describe('librairySingleCtrl', function() {
    var scope, $filter, stateParams, ctrl;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller, _$filter_) {
            scope = {
                picts: [
                    {pk: 1},
                    {pk: 2},
                ]
            };
            stateParams = {pk: 1, type: 'folder'};
            ctrl = $controller('librairySingleCtrl', {
                $scope: scope,
                $filter: _$filter_,
                $stateParams: stateParams,
            });
        });
    });


    it('should populate pict model, with pk params.pk', function() {
        expect(scope.pict.pk).toBe(1);
    });

});
