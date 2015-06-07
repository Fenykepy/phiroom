describe('phRange filter', function() {
    var phRange;
    beforeEach(function() {
        module('phiroomApp');
        /* phRangeFilter because angular automatically adds 'Filter' at
         * the en of filters providers.
         */
        inject(function(_phRangeFilter_) {
            phRange = _phRangeFilter_;
        });

    });


    it('should return array fullfilled with n integers from 0', function() {
        var result = phRange([], 5);
        expect(result).toEqual([0,1,2,3,4]);
    });

    it('should return array fullfilled with n integers from 0 after array content', function() {
        var result = phRange(['tom', 'tim'], 3);
        expect(result).toEqual(['tom', 'tim', 0,1,2,]);
    });
});
