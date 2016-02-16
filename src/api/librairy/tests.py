import os

from PIL import Image

from django.test import TestCase
from django.core.files.images import ImageFile
from django.core.urlresolvers import reverse

from rest_framework.test import APIClient, APITestCase

from user.models import User
from librairy.models import Picture, Collection, CollectionsEnsemble, \
        Label, Tag, PictureFactory, set_picturename

from phiroom.settings import MEDIA_ROOT, LIBRAIRY, PREVIEWS_DIR, \
        PREVIEWS_CROP, PREVIEWS_MAX, PREVIEWS_HEIGHT, \
        PREVIEWS_WIDTH, LARGE_PREVIEWS_FOLDER, BASE_DIR

PICT_FILE = 'librairy/test_files/FLR_15_2822.jpg'
PICT_PATH = os.path.join(BASE_DIR, PICT_FILE)



class PictureFactoryTest(TestCase):
    """Picture factory test class."""

    def test_picture_factory(self):
        """PictureFactory test."""

        # create a first Picture from test file with factory
        factory = PictureFactory(file=PICT_PATH)
        self.assertEqual(factory.cloned, False) 
        
        # assert picture has been created
        pict = Picture.objects.get(pk=factory.picture.pk)
        # assert sha1 is ok
        self.assertEqual(len(pict.sha1), 40)
        # assert metadatas have been loaded
        self.assertEqual(pict.weight, 13468551)
        self.assertEqual(pict.width, 3840)
        self.assertEqual(pict.height, 5120)
        self.assertEqual(pict.type, 'jpeg')
        self.assertEqual(pict.name_import, 'FLR_15_2822.jpg')
        self.assertEqual(pict.name, 'FLR_15_2822.jpg')
        self.assertEqual(pict.source_file.name,
            os.path.join(LIBRAIRY, 'ae/2b/ae2ba7dce63bd0b2f7d79996c41b6f070bfcb092.jpeg')
        )
        self.assertEqual(pict.lens, '150mm')
        # get large preview path
        preview_path = os.path.join(
                PREVIEWS_DIR,
                LARGE_PREVIEWS_FOLDER,
                'ae/2b/ae2ba7dce63bd0b2f7d79996c41b6f070bfcb092.jpg'
            )
        # assert previews have been generated
        self.assertTrue(os.path.isfile(preview_path))

        # store preview last modification time to ensure they are not
        # generated again when a clone is detected
        mod_time = os.path.getmtime(preview_path)

        
        # create a second Picture from test file with factory
        factory = PictureFactory(file=PICT_PATH)
        self.assertEqual(factory.cloned, True)

        # assert new picture has been created
        pict2 = Picture.objects.get(pk=factory.picture.pk)
        # assert it has same sha1 than first Picture
        self.assertEqual(pict.sha1, pict2.sha1)
        # assert metadatas are same
        self.assertEqual(pict2.weight, 13468551)
        self.assertEqual(pict2.width, 3840)
        self.assertEqual(pict2.height, 5120)
        self.assertEqual(pict2.type, 'jpeg')
        self.assertEqual(pict2.name_import, 'FLR_15_2822.jpg')
        self.assertEqual(pict2.name, 'FLR_15_2822.jpg')
        self.assertEqual(pict2.source_file.name,
            os.path.join(LIBRAIRY, 'ae/2b/ae2ba7dce63bd0b2f7d79996c41b6f070bfcb092.jpeg')
        )
        self.assertEqual(pict2.lens, '150mm')
        # assert previews haven't been regenerated
        new_mod_time = os.path.getmtime(preview_path)
        self.assertEqual(mod_time, new_mod_time)
        # assert preview still exists
        self.assertTrue(os.path.isfile(preview_path))

        


        

def create_test_picture(sha1='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'):
    """
    Create a test picture object without generating previews (long),
    or loading metadatas.
    """

    pict = Picture()            
    with open(PICT_PATH, 'rb') as f:
        file = ImageFile(f)
        # false sha1 for testing
        pict.sha1 = sha1
        pict.source_file = file
        pict.weight = 13468551
        pict.width = 3840
        pict.height = 5120
        pict.type = 'jpg'
        pict.save()
    
    return pict





class PictureTest(TestCase):
    """Picture test class."""

    def setUp(self): 
        # create Picture object for all tests
        self.pict = create_test_picture()
    
    def test_set_subdirs(self):
        """Check that subdirs are correctly set."""
        self.assertEqual(
            self.pict._set_subdirs(),
            "{}/{}/".format(
                self.pict.sha1[0:2],
                self.pict.sha1[2:4]
            )
        )


    def test_get_pathname(self):
        """Checks that pathname is correctly returned."""
        self.assertEqual(
                self.pict._get_pathname(),
                os.path.join(
                    MEDIA_ROOT,
                    self.pict.source_file.name
                )
        )
   

    def test_set_picturename(self):
        """Checks that picture file name are set properly."""
        name = set_picturename(self.pict, 'toto.jpg')
        self.assertEqual(name, os.path.join(
            LIBRAIRY,
            self.pict._set_subdirs(),
            self.pict.sha1 + "." + self.pict.type
        ))


    def test_generate_previews(self):
        """Checks that previews are correctly generated."""
        # generate previews
        self.pict.generate_previews()
        # set image orientation :
        if self.pict.width < self.pict.height:
            portrait_orientation = True
        else:
            portrait_orientation = False

        def set_preview_path(dir):
            return os.path.join(
                    PREVIEWS_DIR,
                    dir,
                    self.pict.previews_path
            )

        # test large preview
        large_preview_file = set_preview_path(LARGE_PREVIEWS_FOLDER)
        self.assertEqual(os.path.isfile(large_preview_file), True)

        for preview in PREVIEWS_WIDTH:
            preview_file = set_preview_path(preview[1])
            # assert previews have been generated
            self.assertEqual(os.path.isfile(preview_file), True)
            # and have good height or width
            img = Image.open(preview_file)
            width, height = img.size
            # if preview is larger than original
            if preview[2] > self.pict.width:
                self.assertEqual(width, self.pict.width)
            else:
                # else preview size should be good
                self.assertEqual(width, preview[2])
    

        for preview in PREVIEWS_HEIGHT:
            preview_file = set_preview_path(preview[1])
            # assert previews have been generated
            self.assertEqual(os.path.isfile(preview_file), True)
            # and have good height or width
            img = Image.open(preview_file)
            width, height = img.size
            # if preview is higher than original
            if preview[2] > self.pict.height:
                self.assertEqual(height, self.pict.height)
            else:
                # else preview size should be good
                self.assertEqual(height, preview[2])


        for preview in PREVIEWS_MAX:
            preview_file = set_preview_path(preview[1])
            # assert previews have been generated
            self.assertEqual(os.path.isfile(preview_file), True)
            # and have good height or width
            img = Image.open(preview_file)
            width, height = img.size
            # if image is higher than larger
            if portrait_orientation:
                # if preview is higher than original
                if preview[2] > self.pict.height:
                    self.assertEqual(height, self.pict.height)
                else:
                    # else preview size should be good
                    self.assertEqual(height, preview[2])
            else:
                # if preview is larger than original
                if preview[2] > self.pict.width:
                    self.assertEqual(width, self.pict.width)
                else:
                    # else preview size should be good
                    self.assertEqual(width, preview[2])


        for preview in PREVIEWS_CROP:
            preview_file = set_preview_path(preview[1])
            # assert previews have been generated
            self.assertEqual(os.path.isfile(preview_file), True)
            # and have good height or width
            img = Image.open(preview_file)
            width, height = img.size
            # preview size should be good
            self.assertEqual(width, preview[2])
            self.assertEqual(height, preview[3])



    def test_load_metadatas(self):
        """Checks that metadatas are correctly loaded."""
        # load metadatas
        self.pict.load_metadatas()
        # check results
        self.assertEqual(self.pict.portrait_orientation, True)
        self.assertEqual(self.pict.landscape_orientation, False)
        self.assertEqual(self.pict.title, '')
        self.assertEqual(self.pict.legend, '')
        self.assertEqual(self.pict.camera, 'Canon EOS 5D Mark III')
        self.assertEqual(self.pict.lens, '150mm')
        self.assertEqual(self.pict.speed, '1/160s')
        self.assertEqual(self.pict.aperture, '4.0')
        self.assertEqual(self.pict.iso, 100)
        self.assertEqual(self.pict.rate, 5)
        self.assertEqual(self.pict.label.slug, 'vert')
        self.assertEqual(self.pict.tags.count(), 4)



    def test_delete_previews(self):
        """Checks that previews files are correctly deleted."""
        preview_name = "{}.jpg".format(self.pict.sha1)
        
        def count_previews(preview_name):
            # count existing previews
            count = 0
            for root, dirs, files in os.walk(PREVIEWS_DIR):
                for file in files:
                    if file == preview_name:
                        count += 1
            return count
        # generate previews
        self.pict.generate_previews()
        # ensure at least one preview exists
        self.assertTrue(count_previews(preview_name) > 0)

        # delete previews
        self.pict.delete_previews()
        
        # assert no preview remain
        self.assertEqual(count_previews(preview_name), 0)



    def test_delete_picture(self):
        """Checks that picture file is correctly deleted."""
        # assert file exists
        self.assertTrue(os.path.isfile(self.pict._get_pathname()))

        # delete picture
        self.pict.delete_picture()

        # assert file has been removed
        self.assertEqual(os.path.isfile(self.pict._get_pathname()), False)



    def test_keep_or_delete_picturefiles(self):
        """Checks that picture file deleted when last Picture object
        with one sha1 is deleted."""
        # generate two Picture objects with same source file
        factory = PictureFactory(file=PICT_PATH)
        self.pict2 = factory.picture
        # generate two Picture objects with same source file
        factory = PictureFactory(file=PICT_PATH)
        self.pict3 = factory.picture
        # store files path
        source_file = self.pict2._get_pathname()
        preview_file = self.pict2.previews_path
        
        def picture_files_exist(bool):
            """asserts pictures object files exit or not."""
            self.assertEqual(os.path.isfile(source_file), bool)
            self.assertEqual(os.path.isfile(os.path.join(
                PREVIEWS_DIR,
                LARGE_PREVIEWS_FOLDER,
                preview_file
            )), bool)
        # assert picture source and large preview files exist
        picture_files_exist(True)
        picture_files_exist(True)
        # delete pict2
        self.pict2.delete()
        # assert picture source and large preview files still exist
        picture_files_exist(True)
        picture_files_exist(True)
        # delete pict3
        self.pict3.delete()
        # assert picture source and large preview files have been deleted
        picture_files_exist(False)
        picture_files_exist(False)





    def tearDown(self):
        """Remove remaining files from tests."""
        for root, dirs, files in os.walk(MEDIA_ROOT):
            for file in files:
                if file[0:40] == self.pict.sha1:
                    #print('remove' + os.path.join(root, file))
                    os.remove(os.path.join(root, file))




class APITest(APITestCase):
    """Class to test rest API."""

    def setUp(self):
        # create test users
        self.user = User.objects.create_user(
                username="tom",
                email="tom@lavilotte-rolle.fr",
                password="foo",
        )
        self.user.save()
        # create staff user
        self.staffuser = User.objects.create_user(
                username="flr",
                email="pro@lavilotte-rolle.fr",
                password="foo",
        )
        self.staffuser.is_staff = True
        self.staffuser.save()


        # setup client
        self.client = APIClient()



    def test_picturesPkList(self):
        url = reverse('all-pictures-list')
        data = { 'pks': [1, 2, 3] }
        
        pict = create_test_picture()
        pict2 = create_test_picture()
        pict3 = create_test_picture()
        pict4 = create_test_picture()

        results = [pict4.pk, pict3.pk, pict2.pk, pict.pk]
        
        # try to get without login
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 401)
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 401)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 401)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        # try with normal user
        self.client.login(username='tom', password='foo')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 403)
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 403)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 403)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

        # try with admin user
        self.client.login(username='flr', password='foo')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        for index, item in enumerate(results):
            self.assertEqual(response.data[index], item)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 405)
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 405)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, 405)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)




    
    def test_picturesAPI(self):
        url_list = reverse('pictures-list')
        # create picture for tests
        pict = create_test_picture()
        url_detail = reverse('picture-detail', kwargs={'pk': pict.pk})

        # try to get pictures list without login
        response = self.client.get(url_list)
        self.assertEqual(response.status_code, 401)
        # try to post a new picture without login
        data = {"name":"root directory"}
        response = self.client.post(url_list, data, format='json')
        self.assertEqual(response.status_code, 401)
        # try to put without login
        response = self.client.put(url_list, data, format='json')
        self.assertEqual(response.status_code, 401)
        # try to delete without login
        response = self.client.delete(url_list)
        self.assertEqual(response.status_code, 401)
        # try to get pictures list without login
        response = self.client.get(url_detail)
        self.assertEqual(response.status_code, 401)       
        # try to post a new picture without login
        response = self.client.post(url_detail, data, format='json')
        self.assertEqual(response.status_code, 401)
        # try to put without login
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, 401)
        # try to delete without login
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 401)

        # login with normal user
        self.client.login(username='tom', password='foo')
        response = self.client.get(url_list)
        self.assertEqual(response.status_code, 403)
        # try to post with normal user
        response = self.client.post(url_list, data, format='json')
        self.assertEqual(response.status_code, 403)
        # try to put with normal user
        response = self.client.put(url_list, data, format='json')
        self.assertEqual(response.status_code, 403)
        # try to delete with normal user
        response = self.client.delete(url_list)
        self.assertEqual(response.status_code, 403)
        # try to get pictures list with normal user
        response = self.client.get(url_detail)
        self.assertEqual(response.status_code, 403)       
        # try to post a new picture with normal user
        response = self.client.post(url_detail, data, format='json')
        self.assertEqual(response.status_code, 403)
        # try to put with normal user
        response = self.client.put(url_detail, data, format='json')
        self.assertEqual(response.status_code, 403)
        # try to delete with normal user
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 403)

        # only admin should access to pictures (except in allowed collections
        # not implemenented yet)
        # login with staff user
        self.client.login(username='flr', password='foo')
        response = self.client.get(url_list)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        # post a picture
        with open(PICT_PATH, 'rb') as file:
            response = self.client.post(url_list, {
                'file':file,
            })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['pk'], 2)
        self.assertEqual(response.data['name_import'], 'FLR_15_2822.jpg')
        # assert picture has been saved in db
        n_pict = Picture.objects.all().count()
        self.assertEqual(n_pict, 2)
        # post a picture
        with open(PICT_PATH, 'rb') as file:
            response = self.client.post(url_list, {
                'file':file,
            })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['pk'], 3)
        self.assertEqual(response.data['name_import'], 'FLR_15_2822.jpg')
        # assert picture has been saved in db
        n_pict = Picture.objects.all().count()
        self.assertEqual(n_pict, 3)
        # test patch pict.rate=0
        response = self.client.patch(url_detail, {'rate': 5})
        self.assertEqual(response.status_code, 200)
        # assert it has been saved in db
        pict = Picture.objects.get(pk=pict.pk)
        self.assertEqual(pict.rate, 5)
        # test put picture
        response = self.client.put(url_detail, {
            'title': 'My beautiful title',
            'legend': 'My beautiful legend',
            'name': 'my_name.jpg',
            'rate': 4,
            'color': True,
            'copyright': 'LAVILOTTE-ROLLE Frédéric',
            'copyright_state': "True",
            'copyright_url': 'http://lavilotte-rolle.fr',
        })
        self.assertEqual(response.status_code, 200)
        # assert it has been saved in db
        pict = Picture.objects.get(pk=pict.pk)
        self.assertEqual(pict.title, 'My beautiful title')
        self.assertEqual(pict.legend, 'My beautiful legend')
        self.assertEqual(pict.name, 'my_name.jpg')
        self.assertEqual(pict.rate, 4)
        self.assertEqual(pict.color, True)
        # test get picture
        response = self.client.get(url_detail)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['rate'], 4)
        # test delete picture
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 204)
        # assert it has been deleted
        n_pict = Picture.objects.filter(pk=pict.pk).count()
        self.assertEqual(n_pict, 0)



        

        









