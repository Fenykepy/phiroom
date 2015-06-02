describe('librairyGridCtrl', function() {
    var scope, ctrl, pictures, phRate;
    beforeEach(function() {
        module('phiroomApp');
        inject(function($controller) {
            scope = {};
            // mock pictures list
            pictures = {data: [
                {pk: 1},
                {pk: 2},
            ]};
            // mock phRate service
            phRate = 'phRateServiceHere';
            ctrl = $controller('librairyGridCtrl', {$scope:scope, pictures: pictures, phRate: phRate});
        });
    });


    it('should populate picts model, with list of pictures', function() {
        expect(scope.picts.length).toBe(2);
    });

    it('should populate setRate model as true', function() {
        expect(scope.setRate).toBe('phRateServiceHere');
    });
});
