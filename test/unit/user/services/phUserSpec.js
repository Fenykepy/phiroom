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
