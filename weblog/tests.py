from datetime import datetime, timedelta
from pprint import pprint

from collections import OrderedDict
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework.test import APIClient, APITestCase

from weblog.models import Post, Tag
from weblog.utils import format_content, format_abstract, format_drop_cap





def create_test_users(instance):
    """Create two users for tests."""
    instance.user = User.objects.create_user(
        username="tom",
        email='tom@phiroom.org',
        password='top_secret',
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

        # assert absolute url has been set
        url = '/weblog/{}/'.format(target_slug)
        self.assertEqual(post.absolute_url, url)

        # assert post is in published manager
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 5)

        # assert published manager delivers last post first
        posts = Post.published.all()
        self.assertEqual(post, posts[0])

        # assert get_absolute_url works
        self.assertEqual(post.get_absolute_url(), url)

        # assert previous post is set
        prev_url = '/weblog/{}/my-fifth-title/'.format(date)
        self.assertEqual(post.prev_post_url(), prev_url)
        # assert next post isn't set
        self.assertEqual(post.next_post_url(), None)

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

        # assert post now have a next one
        self.assertEqual(post.next_post_url(), post2.absolute_url)


    def test_draft_future_posts(self):
        self.post3.draft = True
        self.post3.save()

        # assert it isn't anymore in published manager results
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 4)

        # assert post2 next post is post 4 and not 3
        self.assertEqual(self.post2.next_post_url(), self.post4.absolute_url)

        # assert post4 prev post is post 2 and not 3
        self.assertEqual(self.post4.prev_post_url(), self.post2.absolute_url)

        # pass post2 in future
        self.post2.pub_date = timezone.now() + timedelta(hours=24)
        self.post2.save()

        # assert post2 isn't anymore in published results
        n_posts = Post.published.all().count()
        self.assertEqual(n_posts, 3)


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
        login(self, self.user)

        data = {'count': 2,
                'next': None,
                'previous': None,
                'results': [{'name': 'test',
                            'n_posts': 0,
                            'slug': 'test'},
                            {'name': 'test2',
                            'n_posts': 0,
                            'slug': 'test2'}]} 

        response = self.client.get('/api/tags/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, data)


    def test_tag_detail(self):
        # login with staff member
        login(self, self.user)
        
        data = {'name': 'test', 'n_posts': 0, 'slug': 'test'}

        response = self.client.get('/api/tags/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, data)



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
        # login with staff member
        login(self, self.user)
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        print(Post.published.all().count())
        print(Post.objects.all().count())
        print(response.data)
        self.assertEqual(response.data['count'], 4)


    def test_posts_by_tag(self):
        # login with staff member
        login(self, self.user)
        
        url = '/api/posts-by-tag/{}/'.format(self.tag.slug)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 4)
        data0 ={'url': 'http://testserver/api/posts/5/',
              'title': 'My fifth title',
              'description': '',
              'source': 'some text [...] end of abstract',
              'author': 1,
              'draft': False,
              'content': '<p>some text  end of abstract</p>',
              'abstract': '<p>some text …</p>',
             'pk': 5} 
        for key in data0:
            self.assertEqual(response.data['results'][0][key], data0[key])

        self.assertTrue(response.data['results'][0]['pub_date'])
        self.assertTrue(response.data['results'][0]['tags'])
        self.assertTrue(response.data['results'][0]['slug'])



class PostsViewsTest(TestCase):
    """Post listing test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)

        self.post.tags.add(self.tag)
        self.post2.tags.add(self.tag)
        self.post3.tags.add(self.tag2) # draft
        self.post3.tags.add(self.tag) # draft
        self.post4.tags.add(self.tag)
        self.post5.tags.add(self.tag)


    def test_urls(self):
        urls = [
            {
                'url': '/weblog/tag/test2/',
                'status': 200,
                'template': 'weblog/weblog_list.html',
            },
            {
                'url': '/weblog/tag/test2/page/1/',
                'status': 200,
                'template': 'weblog/weblog_list.html',
            },
            {
                'url': self.post.absolute_url,
                'status': 200,
                'template': 'weblog/weblog_view.html',
            }
        ]

    def test_list_posts(self):
        # assert url without pagination and template are good
        response = self.client.get('/weblog/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        # assert only published posts are listed, 4 published, one on page two
        self.assertEqual(len(response.context['posts']), 3)
        
        # assert url with pagination and template are good
        response = self.client.get('/weblog/page/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        self.assertFalse(response.context['page_obj'].has_previous())
        self.assertTrue(response.context['page_obj'].has_next())
        response = self.client.get('/weblog/page/2/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        self.assertTrue(response.context['page_obj'].has_previous())
        self.assertFalse(response.context['page_obj'].has_next())
        self.assertEqual(len(response.context['posts']), 1)


    def test_list_posts_by_tags(self):
        # assert url without pagination and template are good
        response = self.client.get('/weblog/tag/test/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        # assert only published posts are listed, 4 published, one on page two
        self.assertEqual(len(response.context['posts']), 3)

        # assert url with pagination and template are good
        response = self.client.get('/weblog/tag/test/page/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        self.assertFalse(response.context['page_obj'].has_previous())
        self.assertTrue(response.context['page_obj'].has_next())
        response = self.client.get('/weblog/tag/test/page/2/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_list.html')
        self.assertTrue(response.context['page_obj'].has_previous())
        self.assertFalse(response.context['page_obj'].has_next())
        self.assertEqual(len(response.context['posts']), 1)
        
        # should be no result for test2 because it's post is draft
        response = self.client.get('/weblog/tag/test2/')
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context['page_obj'].has_previous())
        self.assertFalse(response.context['page_obj'].has_next())
        self.assertEqual(len(response.context['posts']), 0)


    def test_view_post(self):
        # assert url and templates are ok
        response = self.client.get(self.post2.absolute_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_view.html')
        self.assertEqual(response.context['post'], self.post2)
        self.assertTrue(response.context['prev'])
        self.assertTrue(response.context['next'])

        response = self.client.get(self.post.absolute_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.templates[0].name, 'weblog/weblog_view.html')
        self.assertEqual(response.context['post'], self.post)
        self.assertFalse(response.context['prev'])
        self.assertTrue(response.context['next'])
        
        # assert draft post are not visible by normal users
        response = self.client.get(self.post3.absolute_url)
        self.assertEqual(response.status_code, 404)

        # assert future pub_date posts are not visible by normal users
        self.post.pub_date = timezone.now() + timedelta(hours=24)
        self.post.save()
        response = self.client.get(self.post.absolute_url)
        self.assertEqual(response.status_code, 404)

        # login with staff member
        login(self, self.user)
        # assert staff members can see draft posts
        response = self.client.get(self.post3.absolute_url)
        self.assertEqual(response.status_code, 200)

        # assert staff members can see future pub_date posts
        response = self.client.get(self.post.absolute_url)
        self.assertEqual(response.status_code, 200)






















