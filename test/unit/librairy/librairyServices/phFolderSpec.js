describe('phFolder', function() {
    var phFolder, $httpBackend;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phFolder_, _$httpBackend_) {
            phFolder = _phFolder_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('should have a getDirectorys function', function() {
        expect(angular.isFunction(phFolder.getDirectorys)).toBe(true);
    });

    it('should have a getDirectory function', function() {
        expect(angular.isFunction(phFolder.getDirectory)).toBe(true);
    });

    it('should have a isChild function', function() {
        expect(angular.isFunction(phFolder.isChild)).toBe(true);
    });

    it('should have a getDirectorys function', function() {
        expect(angular.isFunction(phFolder.getDirectorys)).toBe(true);
    });


    describe('phFolder.rootDir', function() {

        it('should have a null pk and a name', function() {
            var result = phFolder.rootDir;
            expect(result.pk).toBe(null);
            expect(result.name).toBe('Root folder');
        });
    });


    describe('phFolder.getDirectorys', function() {

        it('should return a list of directorys in phFolder.directorys', function() {
            $httpBackend.expectGET('/api/librairy/directorys/').
                respond({results:[{name: 'dir1'}, {name: 'dir2'}]});
            expect(phFolder.directorys.length).toBe(0);
            results = phFolder.getDirectorys();
            $httpBackend.flush();
            expect(phFolder.directorys.length).toBe(2);
        });
    });


    describe('phFolder.getDirectory', function() {
        var dirs = [
            {pk: 1, name: "rootDir 1", children: []},
            {pk: 2, name: "rootDir 2", children: [
                {pk: 4, name: "childDir 1", children: [
                    {pk: 6, name: "rootDir 2", children: []}
                ]},
                {pk: 5, name: "childDir 2", children: []}
            ]},
            {pk: 3, name: "rootDir 3", children: []}
        ];


        it('should return false when not in list pk is requested', function() {
            result = phFolder.getDirectory(12, dirs);
            expect(result).toBe(false);
        });


        it('should return directory corresponding to requested pk for first level', function() {
            result = phFolder.getDirectory(1, dirs);
            expect(result.pk).toBe(1);
        });

        it('should return directory corresponding to requested pk for first level with children', function() {
            result = phFolder.getDirectory(2, dirs);
            expect(result.pk).toBe(2);
        });

        it('should return directory corresponding to requested pk for first level with children', function() {
            result = phFolder.getDirectory(3, dirs);
            expect(result.pk).toBe(3);
        });
        
        it('should return directory corresponding to requested pk', function() {
            result = phFolder.getDirectory(5, dirs);
            expect(result.pk).toBe(5);
        });

        it('should return directory corresponding to requested pk', function() {
            result = phFolder.getDirectory(6, dirs);
            expect(result.pk).toBe(6);
        });
    });
});
