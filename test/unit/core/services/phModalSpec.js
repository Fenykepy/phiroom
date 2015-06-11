describe('phModel', function() {
    var phModal;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phModal_) {
            phModal = _phModal_;
        });
    });

    it('should have a close function', function() {
        expect(angular.isFunction(phModal.close)).toBe(true);
    });

    it('should have a validate function', function() {
        expect(angular.isFunction(phModal.validate)).toBe(true);
    });


    function is_default() {
        expect(phModal.show).toBe(false);
        expect(phModal.templateUrl).toBe('');
        expect(phModal.title).toBe('Modal');
        expect(phModal.closable).toBe(true);
        expect(phModal.buttons).toBe(true);
        expect(phModal.validate_label).toBe('Save');
        expect(phModal.cancel_label).toBe('Cancel');
        expect(phModal.max_window).toBe(false);
        expect(phModal.large_window).toBe(false);
        expect(phModal.small_window).toBe(false);
        expect(phModal.validate_callback).toBe(false);
        expect(phModal.close_callback).toBe(false);
        expect(phModal.dark).toBe(false);
        expect(phModal.opaque).toBe(false);
    };


    describe('phModal.close', function() {

        it('should not have default attributes after initialisation', function() {
            is_default();
        });

        it('should reset to default attribute after .close() call', function() {
            phModal.show = true;
            phModal.title = 'Tests';
            phModal.max_window = true;
            phModal.close();
            is_default();
        });

        it('should not reset to default attribute after .close() call if phModal.closable is false', function() {
            phModal.show = true;
            phModal.closable = false;
            phModal.title = 'Tests';
            phModal.max_window = true;
            phModal.close();
            expect(phModal.show).toBe(true);
            expect(phModal.title).toBe('Tests');
            expect(phModal.max_window).toBe(true);
        });

        it('should execute validate_callback on .validate() call', function() {
            var toto = '';

            var callback = function() {
                toto = 'toto';
            }

            phModal.validate_callback = callback;
            phModal.validate();
            expect(toto).toBe('toto');
        });

        it('should execute close_callback on .close() call', function() {
            var toto = '';

            var callback = function() {
                toto = 'toto';
            }

            phModal.close_callback = callback;
            phModal.close();
            expect(toto).toBe('toto');
        });
    });
});
