'use strict';

/* jasmine specs for controllers go here */


describe('weblogApp controllers', function() {
    beforeEach(module('weblogApp'));

    describe('weblogListCtrl', function() {
        var scope, $httpBackend;
        var posts_list = {
                "count": 8, 
                "next": "http://127.0.0.1:8000/api/posts/?page=2", 
                "previous": null, 
                "results": [{
                                "url": "http://127.0.0.1:8000/api/posts/8/", 
                                "title": "Encore un post.", 
                                "description": "Toujours du contenu pour meubler", 
                                "source": "Un post de plus, pour ne rien dire évidement, c'est bien à ça que sert un blog non ?[...] En tous cas celui-ci je m'applique, ce n'est pas du lorem ipsum automatiquement généré. J'espère que ça vous plaira.", 
                                "tags": [
                                    {
                                        "name": "Digital", 
                                        "n_posts": 2, 
                                        "slug": "digital"
                                    } 
                                ], 
                                "author": 1, 
                                "draft": false, 
                                "pub_date": "2014-12-06T21:22:11.276279Z", 
                                "content": "<p>Un post de plus, pour ne rien dire évidement, c'est bien à ça que sert un blog non ? En tous cas celui-ci je m'applique, ce n'est pas du lorem ipsum automatiquement généré. J'espère que ça vous plaira.</p>", 
                                "abstract": "<p>Un post de plus, pour ne rien dire évidement, c'est bien à ça que sert un blog non …</p>", 
                                "slug": "2014/12/06/encore-un-post", 
                                "pk": 8
                            }, 
                            {
                                "url": "http://127.0.0.1:8000/api/posts/7/", 
                                "title": "Et encore un autre post", 
                                "description": "Toujours du contenu pour meubler", 
                                "source": "Lorem ipsum dolor.", 
                                "tags": [
                                    {
                                        "name": "noir et blanc", 
                                        "n_posts": 5, 
                                        "slug": "noir-et-blanc"
                                    }
                                ], 
                                "author": 1, 
                                "draft": false, 
                                "pub_date": "2014-12-06T14:12:32Z", 
                                "content": "<p>Lorem ipsum dolor sit amet,</p>", 
                                "abstract": "<p>Lorem ipsum </p>", 
                                "slug": "2014/12/06/et-encore-un-autre-post", 
                                "pk": 7
            }]
        };
        beforeEach(module('weblogControllers'));

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/api/posts/?page_size=3').
                respond(posts_list);
            scope = $rootScope.$new();
            ctrl = $controller('weblogListCtrl', {$scope: scope});
        }));


        it('should create "posts" model with 2 posts fetched from xhr', function() {
            expect(scope.posts).toEqualData([]);
            $httpBackend.flush();

            expect(scope.posts).toEqualData(posts_list.results);
        });
    });
});

