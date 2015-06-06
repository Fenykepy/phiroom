describe('phFileUpload', function() {
    var phFileUpload, $httpBackend;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phFileUpload_, _$httpBackend_) {
            phFileUpload = _phFileUpload_;
            $httpBackend = _$httpBackend_;
        });

    });


    it('should have a function uploadFileToUrl', function() {
        expect(angular.isFunction(phFileUpload.uploadFileToUrl)).toBe(true);
    });



    it('should send request to good url with given file', function() {
        var file = {
            name: 'toto',
            weight: 242434853
        };
        var url = '/my/false/url';
        $httpBackend.expectPOST(url).respond(201, '');
        phFileUpload.uploadFileToUrl(file, url);
        $httpBackend.flush();
    });
});
