describe('phUser', function() {
    var phUser, $httpBackend, phModal;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phUser_, _$httpBackend_, _phModal_) {
            phUser = _phUser_;
            $httpBackend = _$httpBackend_;
            // mock phModal service
            phModal = _phModal_;
        });
    });

    it('should have a getCurrentUser function', function() {
        expect(angular.isFunction(phUser.getCurrentUser)).toBe(true);
    });

    it('should have an authenticate function', function() {
        expect(angular.isFunction(phUser.authenticate)).toBe(true);
    });

    it('should have a isAuthenticated function', function() {
        expect(angular.isFunction(phUser.isAuthenticated)).toBe(true);
    });

    it('should have a login function', function() {
        expect(angular.isFunction(phUser.login)).toBe(true);
    });

    it('should have a loginSubmit function', function() {
        expect(angular.isFunction(phUser.loginSubmit)).toBe(true);
    });

    it('should have an logout function', function() {
        expect(angular.isFunction(phUser.logout)).toBe(true);
    });

    it('should have an errors array', function() {
        expect(phUser.errors).toEqual([]);
    });

    it('should have a credentials object', function() {
        expect(phUser.credentials).toEqual({});
    });




    describe('phFolder.getCurrentUser', function() {

        it('should return current user datas in phUser.user', function() {
            var user = {username: 'tom', is_staff: true};
            $httpBackend.expectGET('/api/users/current/').respond(user);
            expect(phUser.user).toEqual({});
            results = phUser.getCurrentUser();
            $httpBackend.flush();
            expect(phUser.user).toEqual(user);
        });
    });


});
