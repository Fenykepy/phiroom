import os
import hashlib
import time
import logging

from functools import partial
from PIL import Image, ImageFile

from django.template.defaultfilters import slugify

from librairy.models import Picture, Directory, Tag, Label, Licence, \
        ancestors2list
from librairy.xmpinfo import XmpInfo
from phiroom.settings import LIBRAIRY, BASE_DIR
from conf.models import Conf

#logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.DEBUG)


def md5sum(filename):
    """Function to get hex md5sum of a file.

    keywold argument:
    filename -- absolute path to the file (string)

    returns: string containing file's md5sum
    """
    with open(filename, mode='rb') as f:
        # crete md5 object
        d = hashlib.md5()
        # read 128 bytes in file
        for buf in iter(partial(f.read, 128), b''):
            # update md5 object (to avoid using to much
            #memory openning whole file at once
            d.update(buf)
    # return md5sum hexa string
    return d.hexdigest()



def create_directory_hierarchy(path):
    """Function to create a hierarchy in db from a given path.

    keyword argument:
    path -- relative path (only directorys, no files)
        to store in database (string)

    return: last Directory object of path
    """
    # split path elements into list
    path_list = path.strip('/').split('/')
    # initialise parent with None (to start path from root)
    parent = None
    for elem in path_list:
        parent, created = Directory.objects.get_or_create(
                name=elem,
                parent=parent,
                slug=slugify(elem)
            )

    return parent




def recursive_import(path, previews, metadatas):
    """Function to import recursively images from a given directory.
    keyword arguments:
    path: absolute directory path where to search images (string)
    previews: boolean to regenerate or not previews of existing images
    metadatas: boolean to reload or not metadatas of existing files
    """
    # get a path relative to librairy for directory
    relativepath = path.replace(LIBRAIRY, "", 1)
    # allowed extensions
    extensions = ('.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG',
            '.tiff', '.TIFF', '.gif', '.GIF')
    # initialise dir, else it raise an error with empty folders
    dir = None
    # for each file in directory
    for file in os.listdir(path):
        # if extension is allowed
        if file.endswith(extensions):
            # check file md5sum
            i = time.time()
            md5 = md5sum(os.path.join(path, file))
            # create directory hierarchy
            dir = create_directory_hierarchy(relativepath)
            # check if picture with same name and same directory exists in db
            try:
                pict = Picture.objects.get(name=file, directory=dir)
                # if hash has changed
                if md5 != pict.md5:
                    # update md5
                    pict.md5 = md5
                    # reload metadatas
                    pict.load_metadatas()
                    metadatas = False
                    # regenerate previews
                    pict.generate_previews()
                    previews = False
                if metadatas:
                    pict.load_metadatas()
                if previews:
                    pict.generate_previews()

            except Picture.DoesNotExist:
                # create new picture
                pict = Picture()
                pict.md5 = md5
                pict.directory = dir
                pict.name = file
                pict.name_origin = file
                pict.name_import = file
                j = time.time()
                pict.load_metadatas()
                k = time.time()
                pict.generate_previews()
                l = time.time()
                logging.info('Previews and metadatas generated in {}s.'.format(l - i))
                logging.info('Over operation (md5 etc.) runned in {}s.'.format(j - i))
                logging.info('metadatas loaded in {}s.'.format(k - j))
                logging.info('Previews generated in {}s.'.format(l - k))

        # if file is a directory
        elif os.path.isdir(os.path.join(path, file)):
            # launching recursive import on the directory
            recursive_import(os.path.join(path, file, previews, metadatas))

    # return directory object (for success url)
    return dir




