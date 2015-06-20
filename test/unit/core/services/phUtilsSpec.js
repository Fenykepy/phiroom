describe('phUtils', function() {
    var phUtils;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phUtils_) {
            phUtils = _phUtils_;
        });
    });

    it('should have a indexOf function', function() {
        expect(angular.isFunction(phUtils.indexOf)).toBe(true);
    });

    it('should have a indexOfFromList function', function() {
        expect(angular.isFunction(phUtils.indexOfFromList)).toBe(true);
    });

    it('should have a objectHasKey function', function() {
        expect(angular.isFunction(phUtils.objectHasKey)).toBe(true);
    });

    it('should have a objectKeyEqual function', function() {
        expect(angular.isFunction(phUtils.objectKeyEqual)).toBe(true);
    });

    it('should have a getObjectIndexByKey function', function() {
        expect(angular.isFunction(phUtils.getObjectIndexByKey)).toBe(true);
    });


    describe('phUtils.indexOf', function() {

        it('should return index when value is in list', function() {
            var result = phUtils.indexOf(['toto', 'bar', 'tom'], 'bar');
            expect(result).toBe(1);

            var result = phUtils.indexOf(['toto', 'bar', 'tom'], 'toto');
            expect(result).toBe(0);
        });

        it('should return -1 when value is not in list', function() {
            var result = phUtils.indexOf(['toto', 'bar', 'tom'], 'tim');
            expect(result).toBe(-1);
        });
    });


    describe('phUtils.indexOfFromList', function() {
    
        it('should return index when on value from value_list is in list', function() {
            var result = phUtils.indexOfFromList(['toto', 'bar', 'tom'], ['tim', 'tam', 'toto']);
            expect(result).toBe(2);

            var result = phUtils.indexOfFromList(['toto', 'bar', 'tom', 'tim'], ['tim', 'tam']);
            expect(result).toBe(0);
        });

        it('should return -1 when no value from value_list are in list', function() {
            var result = phUtils.indexOfFromList(['toto', 'bar', 'tom'], ['tim', 'tam']);
            expect(result).toBe(-1);
        });
    });
    

    describe('phUtils.objectHasKey', function() {

        it('should return true when object has given key', function() {
            var result = phUtils.objectHasKey({toto: null, pk: 1}, 'toto');
            expect(result).toBe(true);
            var result = phUtils.objectHasKey({toto: null, pk: 1}, 'pk');
            expect(result).toBe(true);
        });

        it('should return false when object hasn\'t given key', function() {
            var result = phUtils.objectHasKey({toto: null, pk: 1}, 'tom');
            expect(result).toBe(false);
        });
    });


    describe('phUtils.objectKeyEqual', function() {

        it('should return true when object has given key and it equals to given value', function() {
            var result = phUtils.objectKeyEqual({toto: 1, pk: 3}, 'toto', 1);
            expect(result).toBe(true);
        });

        it('should return false when object has given key and it equals to given value but with wrong type', function() {
            var result = phUtils.objectKeyEqual({toto: 1, pk: 3}, 'toto', "1");
            expect(result).toBe(false);
        });

        it('should return false when object has given key but with wrong value', function() {
            var result = phUtils.objectKeyEqual({toto: 1, pk: 3}, 'toto', 3);
            expect(result).toBe(false);
        });

        it('should return false when object hasn\'t given key', function() {
            var result = phUtils.objectKeyEqual({toto: 1, pk: 3}, 'tom', 3);
            expect(result).toBe(false);
        });
    });


    describe('phUtils.getObjectIndexByKey', function() {

        var objectList = [
            {pk: 1, type: null},
            {pk: 2, type: 'string'},
            {pk: 3, type: 'string'}
        ];

        it('should return index when object with key = value is in list', function() {
            var result = phUtils.getObjectIndexByKey(objectList, "pk", 1);
            expect(result).toBe(0);
        });

        it('should return first good index when many objects are with key = value is in list', function() {
            var result = phUtils.getObjectIndexByKey(objectList, "type", 'string');
            expect(result).toBe(1);
        });

        it('should return false when object with key = value is in list but with wrong type', function() {
            var result = phUtils.getObjectIndexByKey(objectList, "pk", "1");
            expect(result).toBe(false);
        });
    });
});
