describe('phListPictures', function() {
    var phListPictures, $httpBackend;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phListPictures_, _$httpBackend_) {
            phListPictures = _phListPictures_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('should have a get function', function() {
        expect(angular.isFunction(phListPictures.get)).toBe(true);
    });


    describe('phListPictures.get', function() {

        it('should return a list of pictures and store them in phListPictures.picts', function() {
            var params = {source: 'folder', pk: 1};
            $httpBackend.expectGET('/api/librairy/directorys/1/pictures/').
                respond([{pk: 1}, {pk: 2}]);
            // before request picts array should be empty
            expect(phListPictures.picts.length).toBe(0);
            var promise = phListPictures.get(params);
            var result;
            promise.success(function(data) {
                result = data;
            });
            $httpBackend.flush();
            expect(result.length).toBe(2);
            expect(phListPictures.picts.length).toBe(2);
            expect(phListPictures.listType).toBe(params.source);
            expect(phListPictures.pk).toBe(params.pk);
        });
    });
});
