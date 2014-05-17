#-*- coding: utf-8 -*-

import os
import hashlib
import time
import logging

from functools import partial
from PIL import Image, ImageFile

from django.template.defaultfilters import slugify

from librairy.models import Picture, Directory, Tag, Label, Licence, ancestors2list
from librairy.xmpinfo import XmpInfo
from phiroom.settings import LIBRAIRY, BASE_DIR

logging.basicConfig(level=logging.INFO)
#logging.basicConfig(level=logging.DEBUG)


def md5sum(filename):
    """Fonction to get hex md5sum of a file.
    
    keyword argument:
    filename -- absolute path to the file (string)

    returns: string containing file md5sum
    
    """
    # open the file
    with open(filename, mode='rb') as f:
        # crete md5 object
        d = hashlib.md5()
        # read 128 bytes in file
        for buf in iter(partial(f.read, 128), b''):
            # update md5 object (to avoid using to much memory openning whole file at once
            d.update(buf)
    # return md5sum hexa string
    return d.hexdigest()


def mk_thumb(id, pathname, max_size):
    """Fonction to create thumbnail from a file.
    
    Thumbnail will be save as jpeg in "phiroom/data/images/previews/max-(max-size).
    Last folder will be created if needed.
    Thumbnail name will be (id).jpg.


    keyword arguments:
    id -- id of the picture in database (positiv integer or string)
    pathname -- absolute path to the file (string)
    max-size -- maximum side size of the thumbnail (positiv integer)

    
    returns: filepath to created thumb, thumb width, thumb height

    
    """
    # set max size of picture
    size = max_size, max_size
    # set save folder
    outfolder = os.path.join(BASE_DIR, "phiroom/data/images/previews/max-" + str(max_size))
    # creating save folder if needed
    if not os.path.exists(outfolder):
        os.makedirs(outfolder)
    # set save path
    outfile = os.path.join(outfolder, str(id) + ".jpg")
    # creating new Image instance
    img = Image.open(pathname)
    # creating thumbnail
    img.thumbnail(size, Image.ANTIALIAS)
    # save thumbnail
    try:
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    except IOError:
        ImageFile.MAXBLOCK = img.size[0] * img.size[1]
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    return outfile, img.size[0], img.size[1]

def mk_thumb_square(id, pathname, side):
    """Fonction to create a square (resized then croped in center) thumbnail from a file.
    
    Thumbnail will be save as jpeg in "phiroom/data/images/previews/square-(side).
    Last folder will be created if needed.
    Thumbnail name will be (id).jpg.


    keyword arguments:
    id -- id of the picture in database (positiv integer or string)
    pathname -- absolute path to the file (string)
    side -- side size of the thumbnail (positiv integer)

    
    returns: file path to created thumb or None

    
    """
    # set save folder
    outfolder = os.path.join(BASE_DIR, "phiroom/data/images/previews/square-" + str(side))
    # creating save folder if needed
    if not os.path.exists(outfolder):
        os.makedirs(outfolder)
    # set save path
    outfile = os.path.join(outfolder, str(id) + ".jpg")
    # creating new Image instance
    img = Image.open(pathname)
    # set size of the original file
    width, height = img.size

    # create an intermediate thumbnail before crop (much faster)
    # set image ratio
    ratio = width / height
    
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
    try:
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    except IOError:
        ImageFile.MAXBLOCK = img.size[0] * img.size[1]
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    return outfile



def mk_thumb_height(id, pathname, height):
    """Fonction to create a given height thumbnail from a file
    
    Thumbnail will be save as jpeg in "phiroom/data/images/previews/height-(height).
    Last folder will be created if needed.
    Thumbnail name will be (id).jpg.


    keyword arguments:
    id -- id of the picture in database (positiv integer or string)
    pathname -- absolute path to the file (string)
    height -- height size of the thumbnail (positiv integer)

    
    returns: filepath to created thumb, thumb width, thumb height

    """
    # set save folder
    outfolder = os.path.join(BASE_DIR, "phiroom/data/images/previews/height-" + str(height))
    # creating save folder if needed
    if not os.path.exists(outfolder):
        os.makedirs(outfolder)
    # set save path
    outfile = os.path.join(outfolder, str(id) + ".jpg")
    # creating new Image instance
    img = Image.open(pathname)
    # compute new image width (+ 1px)
    (i_width, i_height) = img.size
    ratio = i_width / i_height
    thumb_width = int(ratio * height + 1)
    # set thumb max width and height
    size = thumb_width, height

    # creating thumbnail
    img.thumbnail(size, Image.ANTIALIAS)
    # save thumbnail
    try:
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    except IOError:
        ImageFile.MAXBLOCK = img.size[0] * img.size[1]
        img.save(outfile, "JPEG", quality=80, optimize=True, progressive=True)

    return outfile, img.size[0], img.size[1]


def create_directory_hierarchy(path):
    """Fonction to create a hierarchy in db from a given path.
    
    keyword argument:
    path -- relative path (only directorys, no files) to store in database (string)
    
    return: last Directory object of path

    
    """
    # split path elements into list
    path_list = path.strip('/').split('/')

    # initialise parent with None (to start path from root)
    parent = None
    for elem in path_list:
        parent, created = Directory.objects.get_or_create(name=elem, parent=parent, slug=slugify(elem))
    return parent

def create_tag_hierarchy(tags):
    """Fonction to create a hierarchy of tags in db.

    keyword argument:
    tags -- list of tuple containing hierachical keywords
        (given by XmpInfo.get_hierarchical_keywords())

    return: list of leafs tags

    """
    leafs = []
    for elem in tags:
        # initialise parent with None (to start from root tag)
        parent = None
        index_end = len(elem) - 1
        for index, tag in enumerate(elem):
            parent, created = Tag.objects.get_or_create(name=tag, slug=slugify(tag), parent=parent)
            
            # if we get a leaf tag
            if index == index_end:
                leafs.append(parent)

    return leafs



def save_picture(path, dir, file, md5, update=False, previews=True, metadatas=True):
    """Fonction to save picture in database.

    keyword arguments:
    path -- absolute path to the picture to save (without file name) (string)
    dir -- Directory objects corresponding to picture's physical directory
    file -- file name itself (string)
    md5 -- file md5 sum (string)
    update -- if False (default) will create new picture object before saving
            else will update picture object with given id
    
    Open picture file, read exifs, create or open picture object, update data (exif, size, md5, height and width)
    create database directory's hierarchy, create thumbnails (300px, 500px, square 220px, height 700px)
    save picture

    return: picture id (integer)

    
    """
    #i = time.time()
    # create new picture instance
    pathname = os.path.join(path, file)

    # update or create picture
    if not update:
        pict = Picture()
    else:
        pict = Picture.objects.get(id=update)

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

        # get xmp object
        xmp = XmpInfo(pathname)

        # set picture attributes
        pict.title = xmp.get_title()[:140]
        pict.legend = xmp.get_legend()
        pict.name_import = file[:140]
        pict.name_origin = file[:140] # change to real origin name if in iptc
        pict.name = file[:140]
        pict.directory = dir
        pict.type = format[:30]
        pict.size = size
        pict.width = width
        pict.height = height
        #pict.color (default true)
        pict.camera = xmp.get_camera()[:140]
        pict.lens = xmp.get_lens()[:140]
        pict.speed = xmp.get_speed()[:30]
        pict.aperture = xmp.get_aperture()[:30]
        pict.iso = xmp.get_iso()
        pict.note = xmp.get_rate()

        label = xmp.get_label()[:150]
        if label:
            label, created = Label.objects.get_or_create(name=label, slug=slugify(label))
            pict.label = label
        
        copyright = xmp.get_copyright()
        copyright_state = xmp.get_copyright_state()
        copyright_description = xmp.get_usage_terms()
        copyright_url = xmp.get_copyright_url()
        # get or create licence (without name and slug (not in xmp))
        licence, created = Licence.objects.get_or_create(state=copyright_state,
                copyright=copyright, description=copyright_description,
                url=copyright_url)
        pict.licence = licence

        pict.md5 = md5[:300]
        #pict.n_read (auto 0)
        #pict.date_import (auto)
        #pict.date_update (auto)
        pict.date_origin = xmp.get_date_origin()
        pict.date = xmp.get_date_created()


        # save image in database
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
                tag, created = Tag.objects.get_or_create(name=elem, slug=slugify(elem),
                        parent=None)
                pict.tags.add(tag)

    #j = time.time()
    #logging.info('save_picture: Picture object created in {}s'.format(j - i))

    # previews generation, time are indicated for intel i5 quadcore 2.8Ghz with ssd computer, 
    # files from Canon EOS5d mkIII
    if previews:
        #i = time.time()
        # create 700px height preview, need arround 0.2171478271484375s
        (h_700, h_700_width, h_700_height) = mk_thumb_height(pict.id, pathname, 700)
        #j = time.time()
        #logging.info('save_picture: picture preview height 700 generated in {}s'.format(j - i))

        # create 500px max preview, need arround 0.22339320182800293s
        #a = time.time()
        (m_500, m_500_width, m_500_height) = mk_thumb(pict.id, h_700, 500)
        #b = time.time()
        #logging.info('save_picture: picture preview max 500 generated in {}s'.format(j - i))
        
        # if 700px height preview is enought width create square 500px previews from it,
        # need arround 0.07821798324584961s
        if h_700_width >= 500:
            #a = time.time()
            square_500 = mk_thumb_square(pict.id, h_700, 500)
            #b = time.time()
            #logging.info('save_picture: picture 500px square preview generated from 700px one in {}s.'.format(b -a))
        # else create it from original, need arround 1.3060426712036133s, 
        # 0.3109171390533447s with intermediate thumbnail before crop
        else:
            #a = time.time()
            square_500 = mk_thumb_square(pict.id, pathname, 500)
            #b = time.time()
            #logging.info('save_picture: picture 500px square preview generated from original one in {}s.'.format(b -a))

        # create max 300px preview from max 500px one, need arround 0.023959636688232422s
        #a = time.time()
        (m300, m_300_width, m_300_height) = mk_thumb(pict.id, m_500, 300)
        #j = time.time()
        #logging.info('save_picture: picture 300px max preview generated in {}s.'.format(j -a))

        #logging.info('save_picture: Picture previews generated in {}s'.format(j - i))

    return pict.id


def recursive_import(path, previews, metadatas):
    """Fonction to import recursively images from a given directory.

    keyword argument:
    path: absolute directory path from where to search images (string)
    previews: boolean to regenerate or not previews of existing files
    metadatas: boolean to reload or not metadatas of existing files

    Open folder, list files and directorys inside,
    if there are pictures (by extensions):
    check picture md5sum, search in database
    a picture with same name, same folder.
    if result, compare md5sum, update picture if
    md5 sums are different, else pass
    if no result, save picture in database
    if there are directorys, recurse on them.

    return: directory object

    """

    relativepath = path.replace(LIBRAIRY, "", 1)
    # creating a tuple with allowed extensions
    extensions = ('.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG',
                    '.tiff', '.TIFF', '.gif', '.GIF')

    # initialise dir, else get an error with empty folders
    dir = None
    # for each file in directory
    for files in os.listdir(path):
        # if extension is allowed
        if files.endswith(extensions):
            i = time.time()
            # check file md5sum
            md5 = md5sum(os.path.join(path, files))
            # create directory hierarchy
            dir = create_directory_hierarchy(relativepath)
            # check if picture with same name and same directory exists in database
            try:
                pict = Picture.objects.get(name=files, directory=dir)
            except Picture.DoesNotExist:
                pict = None
            # if picture exists compare path then md5sum
            if pict:
                # if picture has been modified, update it
                if md5 != pict.md5:
                    # update picture
                    save_picture(path, dir, files, md5, update=pict.id)
                # if picture hasn't change, reload metadata and create new previews
                else:
                    save_picture(path, dir, files, md5, update=pict.id, previews=previews, metadatas=metadatas)
            else:
                # save picture
                timestart = time.time()
                save_picture(path, dir, files, md5)
                timeend = time.time()
                logging.debug(timeend - timestart)
            j = time.time()
            logging.info('recursive_import: file imported in {}s'.format(j - i))

        # if file is a directory
        elif os.path.isdir(os.path.join(path, files)):
                # launching recursive import on the directory
                recursive_import(os.path.join(path, files))


    # create path hierarchy in database and return directory object
    return dir


def delete_previews(id):
    """Fonction to delete previews files of a given image id
    keyword argument:
    id: image id
    
    """
    # path where to search previews directorys
    path = os.path.join(BASE_DIR, "phiroom/data/images/previews/")
    # preview filename
    filename =  str(id) + ".jpg"
    # search for previews directorys
    for files in os.listdir(path):
        # if file is directory
        logging.debug(os.path.join(path, files))
        if os.path.isdir(os.path.join(path, files)):
            try:
                # remove preview file from directory
                os.remove(os.path.join(path, files, filename))
            except FileNotFoundError:
                pass
    

def delete_file(pict):
    """Fonction to delete original file of a given picture object
    keyword argument:
    pict: picture object

    """
    # remove file
    try:
        os.remove(os.path.join(LIBRAIRY, pict.get_relative_pathname().strip('/')))
    except FileNotFoundError:
        pass




