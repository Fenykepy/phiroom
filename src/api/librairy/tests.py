import os
import zipfile

from PIL import Image

from django.test import TestCase
from django.core.files.images import ImageFile
from django.core.urlresolvers import reverse

from rest_framework.test import APIClient, APITestCase

from user.models import User
from librairy.models import Picture, Collection, CollectionsEnsemble, \
        Label, Tag, PictureFactory, set_picturename, recursive_import, \
        ZipExport, CollectionPicture 

from phiroom.settings import MEDIA_ROOT, LIBRAIRY, PREVIEWS_DIR, \
        PREVIEWS_CROP, PREVIEWS_MAX, PREVIEWS_HEIGHT, \
        PREVIEWS_WIDTH, LARGE_PREVIEWS_FOLDER, BASE_DIR

from phiroom.tests_utils import test_status_codes

from user.tests import create_test_users, login

PICT_FILE = 'librairy/test_files/FLR_15_2822.jpg'
PICT_PATH = os.path.join(BASE_DIR, PICT_FILE)



class ZipExportTest(TestCase):
    """Zip archive export test class."""

    def import_test_pictures(self):
        # import pictures to export in db
        path = os.path.join(BASE_DIR, 'librairy/test_files')
        recursive_import(path)


    def test_export_full(self):
        self.import_test_pictures()
        pictures = Picture.objects.all()
        zip_export = ZipExport(pictures=pictures)
        zip, name = zip_export.get_full()
        with zipfile.ZipFile(zip, 'r') as zip_archive:
            info = zip_archive.infolist()
        # there should be 3 files in archive
        self.assertEqual(len(info), 3)
        # assert file sizes are ok
        self.assertEqual(info[0].file_size, 13468551)
        self.assertEqual(info[1].file_size, 188787)
        self.assertEqual(info[2].file_size, 150910)
        # assert file names have been generated correctly
        name = info[0].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], 'FLR_15_2822.jpg')
        name = info[1].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], '230.jpg')
        name = info[2].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], '320.jpg')


    def test_export_large(self):
        self.import_test_pictures()
        pictures = Picture.objects.all()
        zip_export = ZipExport(pictures=pictures)
        zip, name = zip_export.get_large()
        with zipfile.ZipFile(zip, 'r') as zip_archive:
            info = zip_archive.infolist()
        # there should be 3 files in archive
        self.assertEqual(len(info), 3)
        # assert file sizes are ok
        self.assertEqual(info[0].file_size, 212760)
        self.assertEqual(info[1].file_size, 188726)
        self.assertEqual(info[2].file_size, 150347)
        # assert file names have been generated correctly
        name = info[0].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], 'FLR_15_2822.jpg')
        name = info[1].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], '230.jpg')
        name = info[2].filename.split('/')
        self.assertEqual(name[0][:14], 'phiroom-export')
        self.assertEqual(len(name[0]), 51)
        self.assertEqual(name[1], '320.jpg')
    


class RecursiveImportTest(TestCase):
    """Command line import test class."""

    def test_with_folder(self):
        """Test with one folder path as argument."""
        path = os.path.join(BASE_DIR, 'librairy/test_files')
        # it should import 3 pictures from dir, subdir and zip archive with
        # no error for othe file type in the directories.
        recursive_import(path)
        picts = Picture.objects.all().count()
        self.assertEqual(picts, 3)
    

    def test_with_zip_archive(self):
        """Test with one archive as argument."""
        path = os.path.join(BASE_DIR, 'librairy/test_files/test.zip')
        # it should import 1 picture from zip archive
        recursive_import(path)
        picts = Picture.objects.all().count()
        self.assertEqual(picts, 1)


    def test_with_picture(self):
        """Test with a picture path as argument."""
        # it should import given picture
        recursive_import(PICT_PATH)
        picts = Picture.objects.all().count()
        self.assertEqual(picts, 1)
    


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
        self.assertEqual(self.pict.ratio, 0.75)



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




def create_test_collections(instance):
    """Create collections for tests."""
    # - Ensemble1
    #   - Collection1
    #   - Collection2
    #   - Ensemble2
    #       - Collection3
    # - Collection4

    instance.ensemble1 = CollectionsEnsemble.objects.create(
            name="ensemble1")
    instance.ensemble2 = CollectionsEnsemble.objects.create(
            name="ensemble2",
            parent=instance.ensemble1)
    instance.collection1 = Collection.objects.create(
            name="collection1",
            ensemble=instance.ensemble1)
    instance.collection2 = Collection.objects.create(
            name="collection2",
            ensemble=instance.ensemble1)
    instance.collection3 = Collection.objects.create(
            name="collection2",
            ensemble=instance.ensemble2)
    instance.collection4 = Collection.objects.create(
            name="collection2")


class CollectionModelTest(TestCase):
    """Class to test collection model."""

    def test_collection_creation(self):
        # create new collection
        col = Collection()
        col.name = "collection 1"
        col.save()
        
        # assert ensemble of new collection is root one
        root = CollectionsEnsemble.objects.get(pk=1)
        self.assertEqual(col.ensemble, root)
        # assert slug has been generated
        self.assertEqual(col.slug, "collection-1")
        


    def test_collection_slug_generation(self):

        name = "collection"

        # create a root collection
        col1 = Collection()
        col1.name = name
        col1.save()

        # slug should equal name
        self.assertEqual(col1.slug, col1.name)

        # create new collection with same name and ensemble
        col2 = Collection()
        col2.name = name
        col2.save()

        # slug should have been uniquified
        self.assertTrue(col1.slug != col2.slug)


class CollectionPictureModelTest(TestCase):
    """Class to test collection picture relation model."""
   
    def setUp(self):
        # create test pictures
        self.pict = create_test_picture()
        self.pict2 = create_test_picture()
        self.pict3 = create_test_picture()
        # create test collections
        create_test_collections(self)

    def test_create_CollectionPicture(self):
        cp = CollectionPicture(
            collection = self.collection1,
            picture=self.pict
        )
        cp.order = 28
        cp.save()

        # Collection picture object should have been saved in db
        c = CollectionPicture.objects.get(pk=1)
        self.assertEqual(c.picture, self.pict)
        self.assertEqual(c.collection, self.collection1)
        self.assertEqual(c.order, 28)


    def test_collection_list_picture(self):
        cp = CollectionPicture(
                collection = self.collection1,
                picture=self.pict)
        cp.order = 3
        cp.save()
        cp2 = CollectionPicture(
                collection = self.collection1,
                picture=self.pict2)
        cp.order = 1
        cp.save()
        # picture list should be ordered by "order
        picts = self.collection1.get_pictures()
        self.assertEqual(picts[0], cp2)
        self.assertEqual(picts[1], cp)


class CollectionsEnsembleModelTest(TestCase):
    """Class to test collections ensembles model."""

    def test_ensemble_creation(self):
        # create new ensemble
        ens = CollectionsEnsemble()
        ens.name = "ensemble 1"
        ens.save()

        n_ens = CollectionsEnsemble.objects.all().count()
        # assert default root ensemble has been created
        self.assertEqual(n_ens, 2)
        # assert parent of new ensemble is root one
        ens = CollectionsEnsemble.objects.get(name="ensemble 1")
        root = CollectionsEnsemble.objects.get(pk=1)
        self.assertEqual(ens.pk, 2)
        self.assertEqual(ens.parent, root)
        # assert slug has been generated
        self.assertEqual(ens.slug, "ensemble-1")

    def test_ensemble_slug_generation(self):
        
        name = "ensemble"
        # create new ensemble
        ens1 = CollectionsEnsemble()
        ens1.name = name
        ens1.save()
        
        # slug should equal name
        self.assertEqual(ens1.slug, name)

        # create a child with same name
        ens2 = CollectionsEnsemble()
        ens2.name = name
        ens2.parent = ens1
        ens2.save()

        # slug should equal name
        self.assertEqual(ens2.slug, name)

        # create new ensemble with root parent
        ens3 = CollectionsEnsemble()
        ens3.name = name
        ens3.save()

        # slug should have been uniquified
        self.assertTrue(ens3.slug != ens1.slug)


        

    

class CollectionsAPITest(APITestCase):
    """Class to collections rest API."""

    def setUp(self):
        # creat users
        create_test_users(self)

        # setup client
        self.client = APIClient()




class PicturesAPITest(APITestCase):
    """Class to test pictures rest API."""

    def setUp(self):
        # create users
        create_test_users(self)

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
        test_status_codes(self, url, [401, 401, 401, 401, 401],
                postData=data, putData=data, patchData=data)

        # try with normal user
        login(self, self.normalUser)
        test_status_codes(self, url, [403, 403, 403, 403, 403],
                postData=data, putData=data, patchData=data)


        # try with admin user
        login(self, self.staffUser)
        test_status_codes(self, url, [200, 405, 405, 405, 405],
                postData=data, putData=data, patchData=data)

 
        response = self.client.get(url)
        for index, item in enumerate(results):
            self.assertEqual(response.data[index], item)


    
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
        login(self, self.normalUser)
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
        login(self, self.staffUser)
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



        

        









