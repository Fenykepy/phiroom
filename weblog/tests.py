from datetime import datetime, timedelta

from collections import OrderedDict
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta


from rest_framework.test import APIClient, APITestCase

from user.models import User
from weblog.models import Post, Tag
from weblog.utils import format_content, format_abstract, format_drop_cap





def create_test_users(instance):
    """Create two users for tests."""
    instance.user = User.objects.create_user(
        username="tom",
        email='tom@phiroom.org',
        password='top_secret',
        author_name='tom phiroom'
    )
    instance.user.is_staff = True
    instance.user.save()

    instance.user2 = User.objects.create_user(
        username="John",
        email='john@phiroom.org',
        password='top_secret',
    )
    instance.user2.save()



def login(instance, user):
    """Login with given user, assert it's ok"""
    login = instance.client.login(username=user.username,
            password='top_secret')
    instance.assertEqual(login, True)



def create_test_tags(instance):
    """Create two tags for tests."""
    instance.tag = Tag(name="test")
    instance.tag.save()


    instance.tag2 = Tag(name="test2")
    instance.tag2.save()


def create_test_posts(instance):
    """Create 4 test posts for tests.
    run create_test_tags and create_test_users first.
    """
    instance.post = Post(
            title="My first title",
            description="",
            source="some text [...] end of abstract",
            author= instance.user
        )
    instance.post.save()

    instance.post2 = Post(
            title="My second title",
            description="",
            source="some text [...] end of abstract",
            author= instance.user
        )
    instance.post2.save()

    instance.post3 = Post(
            title="My third title",
            description="",
            draft=True,
            source="some text [...] end of abstract",
            author= instance.user
        )
    instance.post3.save()

    instance.post4 = Post(
            title="My fourth title",
            description="",
            source="some text [...] end of abstract",
            author= instance.user
        )
    instance.post4.save()

    instance.post5 = Post(
            title="My fifth title",
            description="",
            source="some text [...] end of abstract",
            author= instance.user
        )
    instance.post5.save()






class UtilsTest(TestCase):
    """Utils functions test."""
    test_string = (
                "A beautiful brandnew article, with a [link](http://test.com) "
                "going somewhere and an image ![Alt text](/path/to/img.jpg) "
                "end of the abstract here[...] and text of content. \n## title ##\n"
                "a second paragraph delimiter which should stay[...]\n"
                "\"Optional title\")\n Some list: \n* item\n* item \n\n"
                "Some code:\n\n    1 < 4\n    print(\"test.py\")\n"
                "Some <strong>html</strong> to ensure it's escape."
            )


    def test_format_drop_cap(self):
        string = '<p>&lt;drop-cap&gt;Un beau jour&lt;/drop-cap&gt; du mois de Mai…'
        string = format_drop_cap(string)

        # sould replace &lt;drop-cap&gt; by <span class="drop-cap"> etc.
        self.assertEqual(string,
            '<p><span class="drop-cap">Un beau jour</span> du mois de Mai…')


    def test_format_abstract(self):
        string = format_abstract(self.test_string)

        result = (
            "<p>A beautiful brandnew article, with a "
            "<a href=\"http://test.com\">link</a> going somewhere and an "
            "image <img alt=\"Alt text\" src=\"/path/to/img.jpg\" /> end "
            "of the abstract here…</p>"
        )

        self.assertEqual(string, result)


    def test_format_content(self):
        string = format_content(self.test_string)
 
        
        result = (
            '<p>A beautiful brandnew article, with a '
            '<a href="http://test.com">link</a> going '
            'somewhere and an image <img alt="Alt text" '
            'src="/path/to/img.jpg" /> end of the abstract '
            'here and text of content. </p>\n<h2>title</h2>\n<p>a second '
            'paragraph delimiter which should stay[...]\n"Optional '
            'title")\n Some list: \n<em> item\n</em> item </p>\n<p>'
            'Some code:</p>\n<pre><code>1 &lt; 4\nprint("test.py")\n'
            '</code></pre>\n<p>Some &lt;strong&gt;html&lt;/strong&gt; '
            'to ensure it\'s escape.</p>'
        )

        self.assertEqual(string, result)





class TagModelTest(TestCase):
    """Tag model test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)


    def test_tag_creation(self):
        tag = Tag(name='test name with spaces')
        tag.save()

        self.assertEqual(tag.slug, 'test-name-with-spaces')
        self.assertEqual(tag.n_posts, 0)

        # assert new tag doesn't appear in used tags
        n_used = Tag.used.all().count()
        self.assertEqual(n_used, 0)
        
        # add tag to a post
        self.post.tags.add(tag)
        # reload tag from db
        tag = Tag.objects.get(id=tag.id)
        # assert tag's n_post has been updated
        self.assertEqual(tag.n_posts, 1)

        # assert tag is now in "used" manager
        n_used = Tag.used.all().count()
        self.assertEqual(n_used, 1)
       
        # try to create a new tag with same name
        try:
            tag2 = Tag(name='test name with spaces')
            tag2.save()
            result=False
        except:
            result = True
        self.assertTrue(result)









class PostModelTest(TestCase):
    """Post model test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)

    def test_post_creation(self):
        post = Post(
            title="My title",
            description="A short description",
            source="some text [...] end of abstract",
            author= self.user
        )
        post.save()

        # add tags
        post.tags.add(self.tag)
        post.tags.add(self.tag2)
        
        # assert slug is correctly generated
        date = timezone.now().strftime("%Y/%m/%d")
        target_slug = '{}/{}'.format(date, 'my-title')
        self.assertEqual(post.slug, target_slug)

        # assert abstract is correctly generated
        string = '<p>some text …</p>'
        self.assertEqual(post.abstract, string)

        # assert content is correctly generated
        string = '<p>some text  end of abstract</p>'
        self.assertEqual(post.content, string)

        # assert tags have correctly been added
        n_tags = post.tags.all().count()
        self.assertEqual(n_tags, 2)

        # assert post is in published manager
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 5)

        # assert published manager delivers last post first
        posts = Post.published.all()
        self.assertEqual(post, posts[0])

        # create a new post
        post2 = Post(
            title="My title",
            description="A short description",
            source="some text [...] end of abstract",
            author= self.user
        )
        post2.save()

        # assert slugs are unique
        self.assertTrue(post2.slug != post.slug)



    def test_draft_future_posts(self):
        self.post3.draft = True
        self.post3.save()

        # assert it isn't anymore in published manager results
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 4)

        # pass post2 in future
        self.post2.pub_date = timezone.now() + timedelta(hours=24)
        self.post2.save()

        # assert post2 isn't anymore in published results
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 3)


    def test_get_next_previous(self):
        # make post 4 and 2 not published
        self.post4.draft = True
        self.post4.save()
        self.post2.pub_date = timezone.now() + timedelta(days=7)
        self.post2.save()
        # should return post4 even if draft
        self.assertEqual(self.post3.get_next(), self.post4)
        # should return post 1 as post 2 has a later publish date
        self.assertEqual(self.post3.get_previous(), self.post)
        # should return post2 as it has the last publish date
        self.assertEqual(self.post5.get_next(), self.post2)
        # should return None, as post2 has no next post
        self.assertEqual(self.post2.get_next(), None)
        # should return None, as post1 has no previous post
        self.assertEqual(self.post.get_previous(), None)

    
    def test_get_next_previous_published(self):
        # make post 4 and 2 not published
        self.post4.draft = True
        self.post4.save()
        self.post2.pub_date = timezone.now() + timedelta(days=7)
        self.post2.save()
        # should return post5 as post4 is draft
        self.assertEqual(self.post3.get_next_published(), self.post5)
        # should return post 1 as post 2 has a later publish date
        self.assertEqual(self.post3.get_previous_published(), self.post)
        # should return None as post2 has the last publish date but is not published
        self.assertEqual(self.post5.get_next_published(), None)
        # should return None, as post1 has no previous post
        self.assertEqual(self.post.get_previous_published(), None)









class TagAPITest(APITestCase):
    """Tag API test."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)

        self.client = APIClient()


    def test_list_tags(self):
        # login with staff member
        #login(self, self.user)

        data = {'count': 2,
                'next': None,
                'previous': None,
                'results': [{'name': 'test',
                            'n_posts': 0,
                            'slug': 'test',
                            'url': 'http://testserver/api/weblog/tags/1/'},
                            {'name': 'test2',
                            'n_posts': 0,
                            'slug': 'test2',
                            'url': 'http://testserver/api/weblog/tags/1/'}]} 

        response = self.client.get('/api/weblog/tags/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['results'][0]['name'], 'test' )
        self.assertEqual(response.data['results'][1]['name'], 'test2' )




    def test_tag_detail(self):
        url = '/api/weblog/tags/1/'
        # test without login
        # detail shouldn't be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # login with normal user
        login(self, self.user2)
        # detail shouldn't be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)


        # login with staff member
        login(self, self.user)
        
        data = {'name': 'test', 'n_posts': 0, 'slug': 'test',
                'url': 'http://testserver/api/weblog/tags/1/'}

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, data)

        data2 = {'name': 'new test'}
        response = self.client.post(url, data2)
        self.assertEqual(response.status_code, 405)
        data2 = {'name': 'new test 2'}
        response = self.client.put(url, data2)
        self.assertEqual(response.status_code, 200)
        data2 = {'name': 'new test 3'}
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)


    def test_flat_tag_list(self):
        url = '/api/weblog/flat-tags/'
        # test without login
        # detail shouldn't be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # login with normal user
        login(self, self.user2)
        # detail shouldn't be accessible
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 403)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)


        # login with staff member
        login(self, self.user)
        
        data = ['test2', 'test']

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0], data[0])
        self.assertEqual(response.data[1], data[1])

        data2 = {'name': 'new test'}
        response = self.client.post(url, data2)
        self.assertEqual(response.status_code, 405)
        response = self.client.put(url, data2)
        self.assertEqual(response.status_code, 405)
        response = self.client.patch(url, {})
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)













class PostAPITest(APITestCase):
    """Post API Test."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)

        self.client = APIClient()

        self.post.tags.add(self.tag)
        self.post2.tags.add(self.tag)
        self.post3.tags.add(self.tag2) # draft
        self.post3.tags.add(self.tag) # draft
        self.post4.tags.add(self.tag)
        self.post5.tags.add(self.tag)


    def test_posts_list(self):
        url = '/api/weblog/posts/'
        data = {'title': 'Post title',
                'description': 'my post description',
                'source': 'my post source',
        }
        data2 = {'title': 'New post Title'}

        # test without login
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)


        # test with normal user
        login(self, self.user2)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.user)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)






    def test_post_detail(self):
        url = '/api/weblog/posts/{}/'.format(self.post.slug)
        data = {'title': 'Post title',
                'description': 'my post description',
                'source': 'my post source',
        }
        data2 = {'description': 'New post description'}

        # test without login
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)


        # test with normal user
        login(self, self.user2)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.user)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data ={'url': 'http://testserver/api/weblog/posts/{}/'.format(self.post.slug),
              'title': 'My first title',
              'description': '',
              'source': 'some text [...] end of abstract',
              'draft': False,
              'next': '{}'.format(self.post2.slug),
              'previous': None,
              'content': '<p>some text  end of abstract</p>',
              'abstract': '<p>some text …</p>',
              'pk': 1} 
        for key in data:
            self.assertEqual(response.data[key], data[key])
        self.assertEqual(response.data['author']['username'],
                self.user.username)
        self.assertEqual(response.data['author']['author_name'],
                self.user.author_name)
        self.assertEqual(response.data['author']['website'],
                self.user.website)

        self.assertTrue(response.data['pub_date'])
        self.assertTrue(response.data['tags'])
        self.assertTrue(response.data['slug'])
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client should be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        # client should be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)


    def test_posts_by_tag(self):
        url = '/api/weblog/posts/tag/{}/'.format(self.tag.slug)
        data = {'title': 'Post title',
                'description': 'my post description',
                'source': 'my post source',
        }
        data2 = {'title': 'New post Title'}

        # test without login
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)


        # test with normal user
        login(self, self.user2)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.user)
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)
        
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 4)
        data ={'url': 'http://testserver/api/weblog/posts/{}/'.format(self.post5.slug),
              'title': 'My fifth title',
              'description': '',
              'draft': False,
              'abstract': '<p>some text …</p>',
             'pk': 5} 
        for key in data:
            self.assertEqual(response.data['results'][0][key], data[key])
        self.assertEqual(response.data['results'][0]['author']['username'],
                self.user.username)
        self.assertEqual(response.data['results'][0]['author']['author_name'],
                self.user.author_name)
        self.assertEqual(response.data['results'][0]['author']['website'],
                self.user.website)

        self.assertTrue(response.data['results'][0]['pub_date'])
        self.assertTrue(response.data['results'][0]['slug'])

    
    def test_create_post_with_tags(self):
        url = '/api/weblog/posts/'
        data ={
              'title': 'My test title',
              'description': '',
              'source': 'some text [...] end of abstract',
              'draft': False,
              'tags_flat_list': ['test', 'test2', 'test3'],
        }

        # test with staff member
        login(self, self.user)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        # all created tags should be in response
        self.assertEqual(len(response.data['tags']), 3)
        # assert tag "test3" has been created
        tag = Tag.objects.filter(name="test3")
        self.assertEqual(len(tag), 1)
        pk = response.data['pk']
        new_post = Post.objects.get(pk=pk)
        # assert tags have been saved
        new_post_tags = new_post.tags.all().values_list('name', flat=True)
        self.assertEqual(len(new_post_tags), 3)
        self.assertTrue('test' in new_post_tags)
        self.assertTrue('test2' in new_post_tags)
        self.assertTrue('test3' in new_post_tags)


    def test_update_post_with_tags(self):
        url = '/api/weblog/posts/{}/'.format(self.post2.slug)
        # post2 already has self.tag (test) tag
        data ={
              'title': 'My test title',
              'description': '',
              'source': 'some text [...] end of abstract',
              'draft': False,
              'tags_flat_list': ['test', 'test2', 'test3'],
        }

        # test with staff member
        login(self, self.user)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        # all created tags should be in response
        self.assertEqual(len(response.data['tags']), 3)
        pk = response.data['pk']
        new_post = Post.objects.get(pk=pk)
        # assert tags have been saved and present tags are still there
        new_post_tags = new_post.tags.all().values_list('name', flat=True)
        self.assertEqual(len(new_post_tags), 3)
        self.assertTrue('test' in new_post_tags)
        self.assertTrue('test2' in new_post_tags)
        self.assertTrue('test3' in new_post_tags)
        
        # reload self.post2 as slug changed
        self.post2 = Post.objects.get(pk=self.post2.pk)
        url = '/api/weblog/posts/{}/'.format(self.post2.slug)
        # test that tags not in list are deleted
        data['tags_flat_list'] = ['test2']
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        # all created tags should be in response
        self.assertEqual(len(response.data['tags']), 1)
        pk = response.data['pk']
        new_post = Post.objects.get(pk=pk)
        new_post_tags = new_post.tags.all().values_list('name', flat=True)
        self.assertEqual(len(new_post_tags), 1)
        self.assertTrue('test2' in new_post_tags)



        


