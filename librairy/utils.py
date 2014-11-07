import os
import hashlib

from functools import partial
from PIL import Image, ImageFile

from django.template.defaultfilters import slugify

from librairy.models import Picture, Directory, Tag, Label, Licence, \
        ancestors2list
from librairy.xmpinfo import XmpInfo
from phiroom.settings import LIBRAIRY, BASE_DIR
from conf.models import Conf



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





def save_thumbnail(img, dst, quality=70):
    """Function to save a thumbnail.

    keyword arguments:
    img -- Image instance
    outpathname -- full path to the output image
    """
    if quality == None:
        quality = 70
    try:
        img.save(
                dst,
                "JPEG",
                quality=quality,
                optimize=True,
                progressive=True
            )
    except IOError:
        ImageFile.MAXBLOCK = img.size[0] * img.size[1]
        img.save(
                dst,
                "JPEG",
                quality=quality,
                optimize=True,
                progressive=True
        )



def mk_thumb(src, dst, max_size, quality=None):
    """Function to create thumbnail from a file.

    keyword arguments:
    src -- path to the source picture (string)
    dst -- path to the destination (resized) picture (string)
    max_size -- maximum side size of thumbnail (positiv integer)

    returns: dst, thumb width, thumb height
    """
    # set max size of picture
    size = max_size, max_size
    # creating new Image instance
    img = Image.open(src)
    # creating thumbnail
    img.thumbnail(size, Image.ANTIALIAS)
    # save thumbnail
    save_thumbnail(img, dst, quality)

    return dst, img.size[0], img.size[1]


def mk_thumb_square(src, dst, side, quality=None):
    """Function to create a square thumbnail from a file.

    keyword arguments:
    src -- path to the source picture (string)
    dst -- path to tho destination (resized) picture (string)
    side -- size of sides of resized and croped thumbnail (positiv integer)

    return: dst, thumb width, thumb height
    """
    # creating new Image instance
    img = Image.open(src)
    # set size of the original file
    width, height = img.size
    # set image ratio
    ratio = width / height

    ## create an intermediate thumbnail before crop (much faster)
    # set size (max width, max height) of intermediat thumbnail
    if width > height:
        size = (int(side * ratio + 1 ), side)
    else:
        size = (side, int(side / ratio + 1))
    # create intermediate thumbnail
    img.thumbnail(size, Image.ANTIALIAS)
    # set size of intermediate thumbnail
    width, height = img.size
    # set size of the crop
    size = side, side
    # depending of orientation
    if width > height:
        delta = width - height
        left = int(delta/2)
        upper = 0
        right = height + left
        lower = height
    else:
        delta = height - width
        left = 0
        upper = int(delta/2)
        right = width
        lower = width + upper
    # crop image
    img = img.crop((left, upper, right, lower)) 
    # save thumbnail
    save_thumbnail(img, dst, quality)

    return dst, img.size[0], img.size[1]



def get_or_create_directory(dirpath):
    """test if given directory exists, create it if necessary."""
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)



def save_picture(path, pict, previews=True, metadatas=True):
    """Function to save a picture in db.

    keyword arguments:
    path -- absolute path to the picture to save (without file name)(string)
    pict -- Picture object to be save or update
    previews -- if update, regenerate previews or not
    metadatas -- if update, reload metadatas or not

    Open picture file, read metadatas, save in db, create thumbnails previews

    return: picture id (integer)
    """

    pathname = os.path.join(path, pict.name)

    if previews:
        ## previews generations
        previewname = str(pict.id) + ".jpg"
        
        ## Large preview generation
        # get latest conf to have large preview's size
        conf = Conf.objects.latest()
        # set output folder
        outdirname = os.path.join(
                BASE_DIR,
                "phiroom/data/images/previews/large/")
        outpathname = os.path.join(outdirname, previewname)
        # create folder if necessary
        get_or_create_directory(outdirname)
        # link original file to folder
        # if preview is real size or original file is too small
        if (conf.large_previews_size == 0 or (
                pict.width < conf.large_previews_size and
                pict.height < conf.large_previews_size)):
            os.symlink(pathname, outpathname)
            file_large = pathname
            w_large = pict.width
            h_large = pict.height
        else:
            # create preview
            (file_large, w_large, h_large) = mk_thumb(
                pathname,
                outpathname,
                conf.large_previews_size,
                90)

        ## 500px max preview generation
        outdirname = os.path.join(
                BASE_DIR,
                "phiroom/data/images/previews/max-500/")
        outpathname = os.path.join(outdirname, previewname)
        # create folder if necessary
        get_or_create_directory(outdirname)
        (file_max500, w_max500, h_max500) = mk_thumb(
            file_large,
            outpathname,
            500)

        ## 500px square
        outdirname = os.path.join(
                BASE_DIR,
                "phiroom/data/images/previews/square-500/")
        outpathname = os.path.join(outdirname, previewname)
        # create folder if necessary
        get_or_create_directory(outdirname)
        # if it suits in 700px output, use it as source,
        if w_large >= 500 and h_large >= 500:
            (file_sqrt500, w_sqrt500, h_sqrt500) = mk_thumb_square(
                    file_large,
                    outpathname,
                    500)
        # else use original
        else:
            (file_sqrt500, w_sqrt500, h_sqrt500) = mk_thumb_square(
                pathname,
                outpathname,
                500)

    return pict.id





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
                pict.load_metadatas()
                pict.generate_previews()

        # if file is a directory
        elif os.path.isdir(os.path.join(path, file)):
            # launching recursive import on the directory
            recursive_import(os.path.join(path, file, previews, metadatas))

    # return directory object (for success url)
    return dir




