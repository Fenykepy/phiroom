from datetime import datetime, timedelta

from collections import OrderedDict
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta


from rest_framework.test import APIClient, APITestCase

from user.models import User
from librairy.models import Picture
from weblog.models import Post, PostPicture, Tag
from stats.models import Hit
from weblog.utils import format_content, format_abstract, format_drop_cap

from librairy.tests import create_test_picture
from user.tests import create_test_users, login
from phiroom.tests_utils import test_status_codes

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
            author= instance.staffUser
        )
    instance.post.save()

    instance.post2 = Post(
            title="My second title",
            description="",
            source="some text [...] end of abstract",
            author= instance.staffUser
        )
    instance.post2.save()

    instance.post3 = Post(
            title="My third title",
            description="",
            draft=True,
            source="some text [...] end of abstract",
            author= instance.staffUser
        )
    instance.post3.save()

    instance.post4 = Post(
            title="My fourth title",
            description="",
            source="some text [...] end of abstract",
            author= instance.staffUser
        )
    instance.post4.save()

    instance.post5 = Post(
            title="My fifth title",
            description="",
            source="some text [...] end of abstract",
            author= instance.staffUser
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
            author=self.staffUser
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
            author= self.staffUser
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






class PostPictureModelTest(TestCase):
    """PostPicture model test class."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)
        # create pictures
        self.pict = create_test_picture(sha1='a' * 40)
        self.pict2 = create_test_picture(sha1='b' * 40)


    def test_create_PostPicture(self):
        pp = PostPicture(post=self.post, picture=self.pict)
        pp.order = 28
        pp.save()
        
        # PostPicture object should have been saved in db
        p = PostPicture.objects.get(pk=1)
        self.assertEqual(p.picture, self.pict)
        self.assertEqual(p.post, self.post)
        self.assertEqual(p.order, 28)


    def test_post_list_picture(self):
        pp = PostPicture(post=self.post, picture=self.pict)
        pp.order = 3
        pp.save()
        pp2 = PostPicture(post=self.post, picture=self.pict2)
        pp2.order = 1
        pp2.save()
        # picture list should be ordered by "order"
        picts = self.post.get_pictures()
        self.assertEqual(picts[0], pp2)
        self.assertEqual(picts[1], pp)






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
        #login(self, self.staffUser)

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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
        
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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
        
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






class PostPictureAPITest(APITestCase):
    """PostPicture API Test."""

    def setUp(self):
        # create users
        create_test_users(self)
        # create tags
        create_test_tags(self)
        # create posts
        create_test_posts(self)
        # create pictures
        self.pict = create_test_picture(sha1='a' * 40)
        self.pict2 = create_test_picture(sha1='b' * 40)

        self.client = APIClient()


    def test_post_picture_create(self):
        url = '/api/weblog/post-picture/'
        data = {'post': self.post.slug, 'picture': self.pict2.sha1}
        data2 = {'order': 76}
        
        # try without login
        # client shouldn't be able to get
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
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
        login(self, self.normalUser)
        # client shouldn't get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
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


        # test with staff member and post owner
        login(self, self.staffUser)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
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
        
        # assert PostPicture has been saved in db
        p = PostPicture.objects.filter(post=self.post, picture=self.pict2).count()
        self.assertEqual(p, 1)

        # try to post again with same data
        # creating 2 postPicture relation with same picture
        # and post shouldn't be possible
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)

        # assert PostPicture has not been saved second time in db
        p = PostPicture.objects.filter(post=self.post, picture=self.pict2).count()
        self.assertEqual(p, 1)



    def test_post_picture_detail(self):
        PostPicture.objects.create(post=self.post, picture=self.pict)
        slug = self.post.slug
        sha1 = self.pict.sha1
        url = '/api/weblog/post-picture/post/{}/picture/{}/'.format(
                slug, sha1)
        data = {'post': slug, 'picture': sha1}
        data2 = {'order': 76}
  
        # try without login
        # client shouldn't be able to get
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
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
        login(self, self.normalUser)
        # client shouldn't get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
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


        # test with staff member and post owner
        login(self, self.staffUser)
        # client shouldn't get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['post'], self.post.slug)
        self.assertEqual(response.data['picture'], self.pict.sha1)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        data2 = {'order': 78}
        response = self.client.patch(url, data2)
        self.assertEqual(response.status_code, 200)
        pp = PostPicture.objects.get(pk=1)
        self.assertEqual(pp.order, 78)
        # client should be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        # object should have been deleted
        pps = PostPicture.objects.all().count()
        self.assertEqual(pps, 0)
        




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


    def test_post_hits(self):
        # create some hits, 2 with same IP
        hit = Hit.objects.create(
                ip = '127.0.0.8',
                type = 'POST',
                related_key = self.post.slug,
        )
        hit = Hit.objects.create(
                ip = '127.0.0.8',
                type = 'POST',
                related_key = self.post.slug,
        )
        hit = Hit.objects.create(
                ip = '127.0.0.9',
                type = 'POST',
                related_key = self.post.slug,
        )

        base_url = '/api/weblog/posts/{}/hits/'
        url = base_url.format(self.post.slug)
        data = { 'name': 'tom' }

        # test without login
        test_status_codes(self, url, [401, 401, 401, 401, 401],
            postData=data, putData=data, patchData=data)
        
        # test with normal user
        login(self, self.normalUser)
        test_status_codes(self, url, [403, 403, 403, 403, 403],
            postData=data, putData=data, patchData=data)
        
        # test with staff user
        login(self, self.staffUser)
        test_status_codes(self, url, [200, 405, 405, 405, 405],
            postData=data, putData=data, patchData=data)

        response=self.client.get(url)
        
        # only 2 hits should be counted
        self.assertEqual(response.data, 2)
        
        # test with not visited post
        url2 = base_url.format(self.post2.slug)
        response=self.client.get(url2)
        # 0 should appear with a not visited post
        self.assertEqual(response.data, 0)

        # test with false slug
        url3 = base_url.format('2016/06/23/my-false-slug')
        response = self.client.get(url3)
        # we shouldn't get 404 because we keep tracks of
        # deleted objects too
        self.assertEqual(response.status_code, 200)
        # 0 should appear as post never existed
        self.assertEqual(response.data, 0)




    def test_posts_headers_list(self):
        url = '/api/weblog/posts/headers/'

        # test without login
        # client shouln'd receive anything
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client shouldn't receive anything
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)


        # test with admin user
        login(self, self.staffUser)
        # client shouldn't get any posts in list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)
        self.assertTrue(response.data[0]['slug'])
        self.assertTrue(response.data[0]['title'])
        
        # weblog author user should only see post he is author of
        self.normalUser.is_weblog_author = True
        self.normalUser.save()
        self.post3.author = self.normalUser
        self.post3.save()
        login(self, self.normalUser)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.post3.slug)


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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
        # client should get posts list
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 5)
        # client should be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        # assert post has been saved in db
        post = Post.objects.get(title="Post title")
        # assert user has been saved as author
        self.assertEqual(post.author, self.staffUser)
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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
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
        } 
        for key in data:
            self.assertEqual(response.data[key], data[key])
        self.assertEqual(response.data['author'],
                self.staffUser.pk)

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


    def test_post_pictures(self):
        url = '/api/weblog/posts/{}/pictures/'.format(
                self.post.slug)
        url2 = '/api/weblog/posts/{}/pictures/'.format(
                self.post2.slug)
        data = {'pictures': [2, 1]}

        # pass post2 as draft
        self.post2.draft = True
        self.post2.save()
 
        # create pictures
        self.pict = create_test_picture(sha1='a' * 40)
        self.pict2 = create_test_picture(sha1='b' * 40)       

        # add pictures to posts
        pp = PostPicture(
                post=self.post,
                picture=self.pict)
        pp.order = 3
        pp.save()
        pp2 = PostPicture(
                post=self.post,
                picture=self.pict2)
        pp2.order = 1
        pp2.save()

        self.pict.title = 'title 1'
        self.pict.legend = 'legend 1'
        self.pict.previews_path = 'xx/xx/xxxxxx'
        self.pict.ratio = 0.75
        self.pict.save()
 
        self.pict2.title = 'title 2'
        self.pict2.legend = 'legend 2'
        self.pict2.previews_path = 'xx/xx/xxxxxx'
        self.pict2.ratio = 0.70
        self.pict2.save()   


        # test without login
        # client should get post pictures




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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
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
        } 
        for key in data:
            self.assertEqual(response.data['results'][0][key], data[key])
        self.assertEqual(response.data['results'][0]['author'],
                self.staffUser.pk)

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
        login(self, self.staffUser)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        # all created tags should be in response
        self.assertEqual(len(response.data['tags']), 3)
        # assert tag "test3" has been created
        tag = Tag.objects.filter(name="test3")
        self.assertEqual(len(tag), 1)
        slug = response.data['slug']
        new_post = Post.objects.get(slug=slug)
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
        login(self, self.staffUser)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        # all created tags should be in response
        self.assertEqual(len(response.data['tags']), 3)
        slug = response.data['slug']
        new_post = Post.objects.get(slug=slug)
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
        slug = response.data['slug']
        new_post = Post.objects.get(slug=slug)
        new_post_tags = new_post.tags.all().values_list('name', flat=True)
        self.assertEqual(len(new_post_tags), 1)
        self.assertTrue('test2' in new_post_tags)


    def test_post_pictures(self):
        base_url = '/api/weblog/posts/{}/pictures/'
        url = base_url.format(
                self.post.slug)
        url2 = base_url.format(
                self.post2.slug)

        data = {'pictures': [2, 1]}

        self.pict = create_test_picture(sha1='a' * 40)
        self.pict2 = create_test_picture(sha1='b' * 40)

        # pass post 2 draft
        self.post2.draft = True
        self.post2.save()
        # add pictures to post
        pp = PostPicture.objects.create(
                post=self.post,
                picture=self.pict,
                order=3)
        pp2 = PostPicture.objects.create(
                post=self.post,
                picture=self.pict2,
                order=1)

        self.pict.title = 'title1'
        self.pict.legend = 'legend1'
        self.pict.previews_path = 'xx/xx/xxxxxxx'
        self.pict.ratio = 0.75
        self.pict.save()

        self.pict2.title = 'title2'
        self.pict2.legend = 'legend2'
        self.pict2.previews_path = 'xx/xx/xxxxxxx'
        self.pict2.ratio = 0.70
        self.pict2.save()

        # test without login
        # client should get post pictures
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data1 = response.data
        self.assertTrue(data1[0]['sha1'])
        self.assertEqual(data1[0]['title'], 'title1')
        self.assertEqual(data1[0]['legend'], 'legend1')
        self.assertEqual(data1[0]['previews_path'], 'xx/xx/xxxxxxx')
        self.assertEqual(data1[0]['ratio'], 0.75)
        self.assertTrue(data1[1]['sha1'])
        self.assertEqual(data1[1]['title'], 'title2')
        self.assertEqual(data1[1]['legend'], 'legend2')
        self.assertEqual(data1[1]['previews_path'], 'xx/xx/xxxxxxx')
        self.assertEqual(data1[1]['ratio'], 0.70)
        # client shouldn't be able to get draft post pictures
        response = self.client.get(url2)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # test with normal user
        login(self, self.normalUser)
        # client should get pictures
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client shouldn't get draft post
        response = self.client.get(url2)
        self.assertEqual(response.status_code, 404)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # test with staff member
        login(self, self.staffUser)
        # client should get pictures
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # client should get draft post
        response = self.client.get(url2)
        self.assertEqual(response.status_code, 200)
        # client shouldn't be able to post
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to put
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to patch
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        # client shouldn't be able to delete
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)





