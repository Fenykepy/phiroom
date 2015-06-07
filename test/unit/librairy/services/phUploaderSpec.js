describe('phUploader', function() {
    var phUploader, phFileUpload, phModal, upload_count=0;
    beforeEach(function() {
        module('phiroomApp');
        module(function($provide) {
            $provide.factory('phFileUpload', function($httpBackend, $http) {
                // mock phFileUpload service
                phFileUpload = {};
                phFileUpload.uploadFileToUrl = function(file, url) {
                    upload_count ++;
                    if (file == 'file1') {
                        $httpBackend.expectGET(url).respond(200, file);
                        promise = $http.get(url);
                        $httpBackend.flush();
                        return promise;
                    } else {
                        $httpBackend.expectGET(url).respond(400, file);
                        promise = $http.get(url);
                        $httpBackend.flush();
                        return promise;
                    }
                }
                return phFileUpload;
            });
        });
        inject(function(_phUploader_,  _phModal_, _phFileUpload_) {
            phUploader = _phUploader_;
            phModal = _phModal_;
            phFileUpload = _phFileUpload_;
        });
    });

    it('should have a handleFile function', function() {
        expect(angular.isFunction(phUploader.handleFiles)).toBe(true);
    });

    it('should have a delFile function', function() {
        expect(angular.isFunction(phUploader.delFile)).toBe(true);
    });

    it('should have a open function', function() {
        expect(angular.isFunction(phUploader.open)).toBe(true);
    });

    it('should have a files attribute', function() {
        expect(phUploader.files).toEqual([]);
    });



    describe('phUploader.handleFiles', function() {
        
        var array = ['file1', 'file2', 'file3'];

        it('should push given file to files array', function() {
            phUploader.handleFiles(array);
            expect(phUploader.files).toEqual(array);
        });

        it('shouldn\'t delete existing files in files array', function() {
            var expected_result = ['existing File'];
            phUploader.files = expected_result;
            for (var i=0; i < array.length; i++) {
                expected_result.push(array[i]);
            }
            phUploader.handleFiles(array);
            expect(phUploader.files).toEqual(expected_result);
        });
    });


    describe('phUploader.delFiles', function() {
        
        var array = ['file1', 'file2', 'file3'];

        it('should push given file to files arry', function() {
            phUploader.files = array;
            console.log(phUploader.files);
            phUploader.delFile(1);
            expect(phUploader.files).toEqual(['file1', 'file3']);
        });
    });


    describe('phUploader.open', function() {
        
        it('should set up phModal attributes', function() {
            phUploader.open();
            expect(phModal.templateUrl).toBe('/assets/partials/librairy/librairy_uploader.html');
            expect(phModal.title).toBe('Upload pictures');
            expect(phModal.validate_label).toBe('Upload');
            expect(phModal.show).toBe(true);
            expect(angular.isFunction(phModal.validate_callback)).toBe(true);
            expect(angular.isFunction(phModal.close_callback)).toBe(true);
        });

        it('should reset phUploader.files on phModal.close() call', function() {
            var array = ['file1', 'file2', 'file3'];
            phUploader.files = array;
            phUploader.open();
            phModal.close();
            expect(phUploader.files).toEqual([]);
        });

        it('should upload files one by one on phModal.validate() call, and then close phModal', function() {
            var array = ['file1', 'file2', 'file3'];
            phUploader.files = array;
            phUploader.open();
            phModal.validate();
            // all files should have been uploaded
            expect(upload_count).toEqual(3);
            // modal window should be closed
            expect(phModal.show).toBe(false);
        });
    });
});
