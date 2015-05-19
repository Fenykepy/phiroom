import os

from PIL import Image

from django.test import TestCase, Client
from django.core.files.images import ImageFile

from librairy.models import Picture, Collection, CollectionsEnsemble, \
        Label, Tag, Directory, PictureFactory, set_picturename

from phiroom.settings import MEDIA_ROOT, LIBRAIRY, PREVIEWS_DIR, \
        PREVIEWS_CROP, PREVIEWS_MAX, PREVIEWS_HEIGHT, \
        PREVIEWS_WIDTH, LARGE_PREVIEWS_FOLDER, BASE_DIR

PICT_FILE = 'librairy/test_files/FLR_15_2822.jpg'
PICT_PATH = os.path.join(BASE_DIR, PICT_FILE)



class PictureTest(TestCase):
    """Picture test class."""

    def setUp(self): 
        # create Picture object for all tests
        self.pict = Picture()
            
        with open(PICT_PATH, 'rb') as f:
            file = ImageFile(f)
            self.pict.sha1 = 'ae2ba7dce63bd0b2f7d79996c41b6f070bfcb092'
            self.pict.source_file = file
            self.pict.weight = 13468551
            self.pict.width = 3840
            self.pict.height = 5120
            self.pict.type = 'jpg'
            self.pict.save()

    
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
            if preview[1] > self.pict.width:
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
            if preview[1] > self.pict.height:
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
        
