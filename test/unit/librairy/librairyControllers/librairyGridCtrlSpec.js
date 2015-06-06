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

    it('should publish setRate model service', function() {
        expect(scope.setRate).toBe('phRateServiceHere');
    });

    it('should populate show_filter_bar model as true', function() {
        expect(scope.show_filter_bar).toBe(true);
    });
});
