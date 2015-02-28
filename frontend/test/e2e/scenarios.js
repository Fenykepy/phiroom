'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('weblog App', function () {

    describe('weblog list', function () {
        beforeEach(function() {
            browser().navigateTo('weblog/');
        });

        it('should render good url for article detail view', function () {
            element('article:nth-child(1) header h1 a').click();
            expect(browser().location().url()).toBe('/weblog/8/');
        });
    });
});
