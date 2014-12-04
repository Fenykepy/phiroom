from django.test import TestCase, Client
from django.contrib.auth.models import User

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
            user= instance.user
        )
    instance.post.save()

    instance.post2 = Post(
            title="My second title",
            description="",
            source="some text [...] end of abstract",
            user= instance.user
        )
    instance.post2.save()

    instance.post3 = Post(
            title="My third title",
            description="",
            source="some text [...] end of abstract",
            user= instance.user
        )
    instance.post3.save()

    instance.post4 = Post(
            title="My fourth title",
            description="",
            source="some text [...] end of abstract",
            user= instance.user
        )
    instance.post4.save()


class UtilsTest(TestCase):
    """Utils functions test."""
    test_string = (
                "A beautiful brandnew article, with a [link](http://test.com) "
                "going somewhere and an image ![Alt text](/path/to/img.jpg) "
                "end of the abstract here[...] and text of content. ## title ## "
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
            'here and text of content. ## title ## a second '
            'paragraph delimiter which should stay[...]\n"Optional '
            'title")\n Some list: \n<em> item\n</em> item </p>\n<p>'
            'Some code:</p>\n<pre><code>1 &lt; 4\nprint("test.py")\n'
            '</code></pre>\n<p>Some &lt;strong&gt;html&lt;/strong&gt; '
            'to ensure it\'s escape.</p>'
        )

        self.assertEqual(string, result)
