describe('phPatcher', function() {
    var phPatcher, $httpBackend, element;
    beforeEach(function() {
        module('phiroomApp');
        inject(function(_phPatcher_, _$httpBackend_) {
            phPatcher = _phPatcher_;
            $httpBackend = _$httpBackend_;
            // create an element to be patched
            element = {
                url: '/my/false/url/1/',
                pk: 1,
                name: 'tom'
            };
        });

    });



    it('should send patch request and update object after success with good parameters', function() {
        // patched data to element
        var data = {
            name: 'toto'
        };
        $httpBackend.expectPATCH('/my/false/url/1/').
            respond(200, data);

        phPatcher(element, data);
        expect(element.name).toBe('tom');
        $httpBackend.flush();
        // element name should have been updated
        expect(element.name).toBe('toto');
        // other property shouldn't have change
        expect(element.pk).toBe(1);
        expect(element.url).toBe('/my/false/url/1/');
    });


    it('should not send patch request if element has all data\'s propertys and if they match', function() {
        // patched data to element
        var data = {
            name: 'tom',
            pk: 1
        };
        phPatcher(element, data);
        // other property shouldn't have change
        expect(element.name).toBe('tom');
        expect(element.pk).toBe(1);
        expect(element.url).toBe('/my/false/url/1/');
    });


    it('should send patch request if some data\'s propertys are not in element, but property shouldn\'t be added to element', function() {
        // patched data to element
        var data = {
            name: 'tom',
            pk: 1,
            rate: 6,
        };
        $httpBackend.expectPATCH('/my/false/url/1/').
            respond(200, data);
        phPatcher(element, data);
        expect(element.name).toBe('tom');
        $httpBackend.flush();
        // propertys shouldn't have change
        expect(element.pk).toBe(1);
        expect(element.url).toBe('/my/false/url/1/');
        // new property shouldn't have been added.
        expect(element.rate).toBe(undefined);
    });
});
