'use strict';


describe('phBytes filter', function() {
    var phBytes;
    beforeEach(function() {
        // load the filter's module
        module('commonFilters');
        // initialize a new instance of the filter before each test
        inject(function($filter) {
            phBytes = $filter('phBytes');
        });
    });

    it('should return nothing when there is no filesize', function () {
        expect(phBytes('text')).toBe('-');
    });

    it('should round the filesize based on the configured precision', function () {
        var size = 1024 + 512;
        expect(phBytes(size)).toBe('1.5 kB');
        expect(phBytes(size, 2)).toBe('1.50 kB');
    });

    it('should recognize bytes', function () {
        expect(phBytes(1, 0)).toBe('1 bytes');
    });

    it('should recognize KiloBytes', function () {
        expect(phBytes(Math.pow(1024, 1), 0)).toBe('1 kB');
    });

    it('should recognize MegaBytes', function () {
        expect(phBytes(Math.pow(1024, 2), 0)).toBe('1 MB');
    });

    it('should recognize GigaBytes', function () {
        expect(phBytes(Math.pow(1024, 3), 0)).toBe('1 GB');
    });

    it('should recognize TeraBytes', function () {
        expect(phBytes(Math.pow(1024, 4), 0)).toBe('1 TB');
    });

    it('should recognize PetaBytes', function () {
        expect(phBytes(Math.pow(1024, 5), 0)).toBe('1 PB');
    });
});
