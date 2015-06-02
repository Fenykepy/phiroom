describe('phRate', function() {
    var phRate, phSelection, phPatcher;
    beforeEach(function() {
        module('phiroomApp');
        module(function($provide) {
            $provide.factory('phPatcher', function() {
                return function (elem, data) {
                    console.log(data.rate);
                    elem.rate = data.rate;
                };
            });
        });
        inject(function(_phRate_, _phPatcher_) {
            phRate = _phRate_;
            phPatcher = _phPatcher_;
        });
    });

    it('should set rate to x + 1  when xth points is clicked', function() {
        var elem = {'rate': 0};
        // click on third point
        phRate(elem, 3, false, true);
        // should update rate to 3
        expect(elem.rate).toBe(4);
    });

    it('should set rate to x + 1  when xth points is clicked', function() {
        var elem = {'rate': 4};
        // click on third point
        phRate(elem, 4, false, true);
        // should update rate to 3
        expect(elem.rate).toBe(5);
    });

    it('should set rate to x + 1  when xth star is clicked and rate > x', function() {
        var elem = {'rate': 5};
        // click on third point
        phRate(elem, 3, true, true);
        // should update rate to 3
        expect(elem.rate).toBe(4);
    });

    it('should set rate to x + 1  when xth star is clicked and rate > x', function() {
        var elem = {'rate': 5};
        // click on third point
        phRate(elem, 3, true, true);
        // should update rate to 3
        expect(elem.rate).toBe(4);
    });

    it('should set rate to x  when xth star is clicked and rate == x+1', function() {
        var elem = {'rate': 4};
        // click on third point
        phRate(elem, 3, true, true);
        // should update rate to 3
        expect(elem.rate).toBe(3);
    });
});
