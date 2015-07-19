describe('mainCtrl', function() {
    var ctrl, scope, phSettings, phUser;
    beforeEach(function() {
        MockPhSettings = {};
        module('phiroomApp', function($provide) {
            $provide.value('phSettings', MockPhSettings);
        });
        inject(function($controller, $q) {
            phUser = {};
            MockPhSettings.menu_data = [{state: 'weblog'}, {state: 'contact'}];
            MockPhSettings.settings_data = {title: 'phiroom'};
            MockPhSettings.getMenu = function() {
                var defer = $q.defer();
                defer.resolve(this.menu_data);
                return defer.promise.then(this.menu = this.menu_data);
            };
            MockPhSettings.getSettings = function() {
                var defer = $q.defer();
                defer.resolve(this.settings_data);
                return defer.promise.then(this.settings = this.settings_data);
            };
        });
    });

    beforeEach(inject(function($controller, $rootScope, _phSettings_) {
            scope =  $rootScope.$new();
            phSettings = _phSettings_;
            phUser = {}
            ctrl = $controller('mainCtrl', {$scope:scope, phSettings: phSettings});
            scope.$digest();
    }));


    it('should create "page_info" model, with empty infos', function() {
        expect(scope.page_info.title).toBe('');
        expect(scope.page_info.name).toBe('');
    });

    it('should publish settings in scope', function() {
        expect(scope.settings).toEqual({title: 'phiroom'});
    });

    it('should publish main menu in scope', function() {
        expect(scope.main_menu).toEqual([{state: 'weblog'}, {state: 'contact'}]);
    });

    it('should publish phUser service in scope', function() {
        expect(scope.phUser.user).toEqual({});
    });

});
