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



def create_tag_hierarchy(tags):
    """Function to create a hierarchy of tags in db.

    keyword argument:
    tags -- list of tuple containing hierarchical keywords
        (givent by XmapInfo.get_hierarchical_keywords())

    return: list of leafs tags
    """
    leafs = []
    for elem in tags:
        # initialise parent with None (to start from root tag)
        parent = None
        index_end = len(elem) - 1
        for index, tag in enumerate(elem):
            parent, created = Tag.objects.get_or_create(
                    name=tag,
                    slug=slugify(tag), parent=parent)

            # if we get a leaf tag
            if index == index_end:
                leafs.append(parent)

    return leafs



def save_thumbnail(img, dst):
    """Function to save a thumbnail.

    keyword arguments:
    img -- Image instance
    outpathname -- full path to the output image
    """
    try:
        img.save(
                dst,
                "JPEG",
                quality=100,
                optimize=True,
                progressive=True
            )
    except IOError:
        ImageFile.MAXBLOCK = img.size[0] * img.size[1]
        img.save(
                dst,
                "JPEG",
                quality=100,
                optimize=True,
                progressive=True
        )



def mk_thumb(src, dst, max_size):
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
    save_thumbnail(img, dst)

    return dst, img.size[0], img.size[1]


def mk_thumb_square(src, dst, side):
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
    save_thumbnail(img, dst)

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

    # if metadatas, read metadatas from file
    if metadatas:
        img = Image.open(pathname)
        # get width and height of picture
        width, height = img.size
        # get size (in bytes) of picture
        size = os.path.getsize(pathname)
        format = img.format
        # delete picture object
        del img

        # load xmp object
        xmp = XmpInfo(pathname)

        # set picture attributes
        pict.title = xmp.get_title()[:140]
        pict.legend = xmp.get_legend()
        pict.name_origin = pict.name
        pict.type = format[:30]
        pict.size = size
        pict.width = width
        pict.height = height
        if height > width:
            pict.landscape = False
        pict.camera = xmp.get_camera()[:140]
        pict.lens = xmp.get_lens()[:140]
        pict.speed = xmp.get_speed()[:30]
        pict.aperture = xmp.get_aperture()[:30]
        pict.iso = xmp.get_iso()
        pict.note = xmp.get_rate()
        label = xmp.get_label()[:150]
        if label:
            label, created = Label.objects.get_or_create(
                    name=label,
                    slug=slugify(label))
            pict.label = label
        copyright = xmp.get_copyright()
        copyright_state = xmp.get_copyright_state()
        copyright_description = xmp.get_usage_terms()
        copyright_url = xmp.get_copyright_url()
        # get or create licence (without name and slug (not in xmp))
        licence, created = Licence.objects.get_or_create(
                state=copyright_state,
                copyright=copyright,
                description=copyright_description,
                url=copyright_url)
        pict.licence = licence
        pict.date_origin = xmp.get_date_origin()
        pict.date = xmp.get_date_created()

        # save image in db
        pict.save()
        # add ManyToMany relations
        hierarchical_tags = xmp.get_hierarchical_keywords()
        if hierarchical_tags:
            tags = create_tag_hierarchy(hierarchical_tags)
            for tag in tags:
                pict.tags.add(tag)
        else:
            tags = xmp.get_keywords()
            for elem in tags:
                tag, created = Tag.objects.get_or_create(
                        name=elem,
                        slug=slugify(elem),
                        parent=None)
                pict.tags.add(tag)

    if previews:
        ## previews generations
        previewname = str(pict.id) + ".jpg"
        
        ## Large preview generation
        # get latest conf to have large preview's size
        conf = Conf.objects.latest('date')
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
                conf.large_previews_size)

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
                update = True
            except Picture.DoesNotExist:
                pict = Picture()
                pict.md5 = md5
                pict.directory = dir
                pict.name = file
                pict.name_import = file
                update = False
            # if picture exists compare path then md5sum
            # if picture has been modified, update it,
            # if metadatas update them
            # if previews regenerate them
            if update:
                if md5 != pict.md5:
                    # update md5
                    pict.md5 = md5
                    save_picture(path, pict)
                if previews or metadatas:
                    # update picture previews or metadatas
                    save_picture(path, pict, previews, metadatas)
            else:
                # save new pict
                save_picture(path, pict)

        # if file is a directory
        elif os.path.isdir(os.path.join(path, file)):
            # launching recursive import on the directory
            recursive_import(os.path.join(path, file, previews, metadatas))

    # return directory object (for success url)
    return dir



def delete_previews(id):
    """Function to delete previews files of a given image id
    keyword argument:

    id: image id
    """
    # path where to search previews directorys
    path = os.path.join(BASE_DIR, "phiroom/data/images/previews/")
    # preview filename
    filename = str(id) + ".jpg"
    # search for previews directorys
    for files in os.listdir(path):
        # if file is a directory
        if os.path.isdir(os.path.join(path, files)):
            try:
                # remove preview file from directory
                os.remove(os.path.join(path, files, filename))
            except FileNotFoundError:
                pass



def delete_file(pict):
    """Function to delete original file of a given picture object
    keyword argument:
    pict: picture object
    """
    try:
        os.remove(os.path.join(LIBRAIRY,
            pict.get_relative_pathname().strip('/')))
    except FileNotFoundError:
        pass
