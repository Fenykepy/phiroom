describe('phFolder', function() {
    var phFolder, $httpBackend, phModal;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phFolder_, _$httpBackend_, _phModal_) {
            phFolder = _phFolder_;
            $httpBackend = _$httpBackend_;
            // mock phModal service
            phModal = _phModal_;
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


    it('should have a mkDir function', function() {
        expect(angular.isFunction(phFolder.mkDir)).toBe(true);
    });

    it('should have a mkDirSubmit function', function() {
        expect(angular.isFunction(phFolder.mkDirSubmit)).toBe(true);
    });

    it('should have a mkDirCancel function', function() {
        expect(angular.isFunction(phFolder.mkDirCancel)).toBe(true);
    });

    describe('phFolder.newDir', function() {

        it('should have a null parent and empty name', function() {
            var result = phFolder.newDir;
            expect(result.parent).toBe(null);
            expect(result.name).toBe('');
        });
    });


    describe('phFolder.rootDir', function() {

        it('should have a null pk and a name', function() {
            var result = phFolder.rootDir;
            expect(result.pk).toBe(null);
            expect(result.name).toBe('Folder less pictures');
        });
    });

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

    describe('phFolder.mkDir', function() {
        var dirsSelect = [
            {key: null, value: "--------"},
            {key: 1, value: "rootDir 1"},
            {key: 2, value: "rootDir 2"},
            {key: 4, value: "---> childDir 1"},
            {key: 6, value: "--------> rootDir 2"},
            {key: 5, value: "---> childDir 2"},
            {key: 3, value: "rootDir 3"},
        ]

        it('should set phFolder.dirsOptions with directorys hierarchy', function() {
            phFolder.directorys = dirs;
            expect(phFolder.dirsOptions).toBe(undefined);
            phFolder.mkDir();
            expect(phFolder.dirsOptions).toEqual(dirsSelect);
        });

        it('should populate phModal service vars', function() {
            phFolder.mkDir();
            expect(phModal.templateUrl).toBe("/assets/partials/librairy/librairy_create_folder.html");
            expect(phModal.title).toBe("Create new folder");
            expect(angular.isFunction(phModal.close_callback)).toBe(true);
            expect(phModal.show).toBe(true);
        });

        it('should delete errors array on phModal.close()', function() {
            phFolder.mkDir();
            phFolder.errors = ['my error'];
            phModal.close();
            expect(phFolder.errors).toBe(null);
        });

        it('should delete errors array and close modal on phFolder.mkDirCancel()', function() {
            phFolder.mkDir();
            phFolder.errors = ['my error'];
            phFolder.mkDirCancel();
            expect(phFolder.errors).toBe(null);
            expect(phModal.show).toBe(false);
            expect(phModal.title).toBe('Modal');
        });

        it('should complete error array on $http.post.error and leave modal open on mkDirSubmit() failure',
                function() {
            var url = '/api/librairy/directorys/';
            var data = {name: '', parent: null};
            var respond = [{name: 'this field is required'}];
            $httpBackend.expectPOST(url, data).respond(400, respond );
            // set modal
            phFolder.mkDir();
            // set model
            expect(phFolder.errors).toBe(undefined);
            phFolder.newDir.name = '';
            phFolder.newDir.parent = null;
            // send error model
            phFolder.mkDirSubmit(); 
            $httpBackend.flush();
            // phModal should be displayed still
            expect(phModal.show).toBe(true);
            // phFolder error array should be set
            expect(phFolder.errors).toEqual(respond);
        });

        it('should close modal and reload directory list on mkDirSubmit() success', function() {
            var url = '/api/librairy/directorys/';
            var data = {name: 'My folder', parent: null};
            var directorys = [{pk: 1, name: 'My folder'}]
            $httpBackend.expectPOST(url, data).respond(201, '');
            $httpBackend.expectGET(url).respond({results: directorys});
            expect(phFolder.directorys).toEqual([]);
            // set modal
            phFolder.mkDir();
            // set model
            phFolder.newDir.name = 'My folder';
            phFolder.newDir.parent = null;
            // send model
            phFolder.mkDirSubmit();
            $httpBackend.flush(1);
            // modal should be closed
            expect(phModal.show).toBe(false);
            expect(phFolder.directorys).toEqual([]);
            $httpBackend.flush();
            expect(phFolder.directorys).toEqual(directorys);
        })
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


    describe('phFolder.isChild', function() {
        beforeEach(function() {
            phFolder.directorys = dirs;
        });

        it('should return true when dir1 is child of dir2', function() {
            result = phFolder.isChild(5, 2);
            expect(result).toBe(true);
        });

        it('should return true when dir1 is grandchild of dir2', function() {
            result = phFolder.isChild(6, 2);
            expect(result).toBe(true);
        });

        it('should return false when dir1 is brother of dir2', function() {
            result = phFolder.isChild(4, 5);
            expect(result).toBe(false);
        });

        it('should return false when dir1 is brother of dir2', function() {
            result = phFolder.isChild(1, 3);
            expect(result).toBe(false);
        });

        it('should return false when dir1 is parent of dir2', function() {
            result = phFolder.isChild(2, 6);
            expect(result).toBe(false);
        });

        it('should return false when dir1 is parent of dir2', function() {
            result = phFolder.isChild(2, 4);
            expect(result).toBe(false);
        });
    });
});
