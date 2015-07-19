#-*- coding: utf-8 -*-

import logging

from datetime import datetime

from libxmp.utils import file_to_dict
from librairy.dateformatdetector import detect_date_format

#logging.basicConfig(level=logging.WARNING)
#logging.basicConfig(level=logging.DEBUG)


class XmpInfo(object):
    """Class to read XMP metadata from a given file path"""
    XMP_NS_EXIF     = 'http://ns.adobe.com/exif/1.0/'
    XMP_NS_AUX      = 'http://ns.adobe.com/exif/1.0/aux/'
    XMP_NS_IPTC     = 'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/'
    XMP_NS_LR       = 'http://ns.adobe.com/lightroom/1.0/'
    XMP_NS_PS       = 'http://ns.adobe.com/photoshop/1.0/'
    XMP_NS_XAP      = 'http://ns.adobe.com/xap/1.0/'
    XMP_NS_RIGHTS   = 'http://ns.adobe.com/xap/1.0/rights/'
    XMP_NS_TIFF     = 'http://ns.adobe.com/tiff/1.0/'
    XMP_NS_DC       = 'http://purl.org/dc/elements/1.1/'
    XMP_NS_USPLUS   = 'http://ns.useplus.org/ldf/xmp/1.0/'
    XMP_NS_IPTC_EXT = 'http://iptc.org/std/Iptc4xmpExt/2008-02-29/'
    
    def __init__(self, pathname):
        # get a xmp data dictionnary from file
        xmp = file_to_dict(pathname)
        ## uncomment for debug
        #self.xmp = xmp
        # initialise dictionnarys:
        self.iptc = {}
        self.exif = {}
        self.aux = {}
        self.lightroom = {}
        self. photoshop = {}
        self.dublinCore = {}
        self.tiff = {}
        self.xap = {}
        self.rights = {}
        self.usplus = {}
        self.iptcExt = {}

        # IPTC
        if self.XMP_NS_IPTC in xmp:
            self.iptc = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_IPTC]}
        # EXIFs
        if self.XMP_NS_EXIF in xmp:
            self.exif = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_EXIF]}
        # Exif aux
        if self.XMP_NS_AUX in xmp:
            self.aux = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_AUX]}
        # Lightroom
        if self.XMP_NS_LR in xmp:
            self.lightroom = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_LR]}
        # Photoshop
        if self.XMP_NS_PS in xmp:
            self.photoshop = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_PS]}
        # Dublin Core
        if self.XMP_NS_DC in xmp:
            self.dublinCore = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_DC]}
        # Tiff
        if self.XMP_NS_TIFF in xmp:
            self.tiff = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_TIFF]}
        # Xap
        if self.XMP_NS_XAP in xmp:
            self.xap = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_XAP]}
        # Xap Rights
        if self.XMP_NS_RIGHTS in xmp:
            self.rights = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_RIGHTS]}
        # Iptc Extension
        if self.XMP_NS_IPTC_EXT in xmp:
            self.iptcExt = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_IPTC_EXT]}
        # Usplus
        if self.XMP_NS_USPLUS in xmp:
            self.usplus = {elem[0]:elem[1] for elem in xmp[self.XMP_NS_USPLUS]}
    
    def get_title(self):
        """Returns image title (string)"""
        if 'dc:title[1]' in self.dublinCore:
            logging.debug('get_title: {}'.format(self.dublinCore['dc:title[1]']))
            return self.dublinCore['dc:title[1]']
        else:
            return ''


    def get_legend(self):
        """Returns image description from dublin core (string)"""
        if 'dc:description[1]' in self.dublinCore:
            logging.debug('get_legend: {}'.format(self.dublinCore['dc:description[1]']))
            return self.dublinCore['dc:description[1]']
        else:
            return ''


    def get_camera(self):
        """Returns camera model from Tiff (string)"""
        if 'tiff:Model' in self.tiff:
            logging.debug('get_camera: {}'.format(self.tiff['tiff:Model']))
            return self.tiff['tiff:Model']
        else:
            return ''


    def get_camera_make(self):
        """Returns camera make from Tiff (string)"""
        if 'tiff:Make' in self.tiff:
            logging.debug('get_camera_make {}'.format(self.tiff['tiff:Make']))
            return self.tiff['tiff:Make']
        else:
            return ''


    def get_camera_firmware(self):
        """Returns camera firmware version from exif aux (string)"""
        if 'aux:Firmware' in self.aux:
            logging.debug('get_camera_firmware {}'.format(self.aux['aux:Firmware']))
            return self.aux['aux:Firmware']
        else:
            return ''


    def get_camera_serial(self):
        """Returns camera serial number from exif aux (string)"""
        if 'aux:SerialNumber' in self.aux:
            logging.debug('get_camera_serial {}'.format(self.aux['aux:SerialNumber']))
            return self.aux['aux:SerialNumber']
        else:
            return ''


    def get_lens(self):
        """Returns lens model from exif aux (string)"""
        if 'aux:Lens' in self.aux:
            logging.debug('get_lens {}'.format(self.aux['aux:Lens']))
            return self.aux['aux:Lens']
        else:
            return ''


    def get_lens_id(self):
        """Returns lens model ID from exif aux (string)"""
        if 'aux:LensID' in self.aux:
            logging.debug('get_lens_id {}'.format(self.aux['aux:LensID']))
            return self.aux['aux:LensID']
        else:
            return ''


    def get_lens_serial(self):
        """Returns lens serial number from exif aux (string)"""
        if 'aux:LensSerialNumber' in self.aux:
            logging.debug('get_lens_serial {}'.format(self.aux['aux:LensSerialNumber']))
            return self.aux['aux:LensSerialNumber']
        else:
            return ''


    def get_focus_distance(self):
        """Returns approximative focus distance (string)"""
        if 'aux:ApproximateFocusDistance' in self.aux:
            logging.debug('get_focus_distance {}'.format(self.aux['aux:ApproximateFocusDistance']))
            # FIXME: should return distance in meter
            return self.aux['aux:ApproximateFocusDistance']
        else:
            return ''


    def get_speed(self):
        """Returns exposure time (string)
        
        long exposures will take this form: '599s'
        short exposurse this one: '1/80s'"""
        if 'exif:ExposureTime' in self.exif:
            # exposure time is a string like '599/1' foh long exposures
            # or '1/80' for short ones
            (n, d) = self.exif['exif:ExposureTime'].split('/')
            logging.debug('get_speed: n: {}, d: {}'.format(n, d))
            if d == 1: # long exposure
                logging.debug('get_speed {}'.format(n + 's'))
                return n + "s"
            else: # short exposure
                logging.debug('get_speed {}'.format(self.exif['exif:ExposureTime'] + "s"))
                return self.exif['exif:ExposureTime'] + "s"
        else:
            return ''


    def get_aperture(self):
        """Returns F number from exif (string)"""
        if 'exif:FNumber' in self.exif:
            # f number is a string like '28/10'
            (n, d) = self.exif['exif:FNumber'].split('/')
            logging.debug('get_aperture {}'.format(str((int(n) / int(d)))))
            return str((int(n) / int(d)))
        else:
            return ''


    def get_real_aperture(self):
        """Returns real F number from exif (float)"""
        if 'exif:ApertureValue' in self.exif:
            # real f number is a string like '2970854/1000000'
            (n, d) = self.exif['exif:ApertureValue'].split('/')
            logging.debug('get_real_aperture: n: {}, d: {}'.format(n, d))
            return int(n) / int(d)
            

    def get_iso(self):
        """Returns iso sensibility from exif (int)"""
        if 'exif:ISOSpeedRatings[1]' in self.exif:
            logging.debug('get_iso {}'.format(self.exif['exif:ISOSpeedRatings[1]']))
            return int(self.exif['exif:ISOSpeedRatings[1]'])
        else:
            return None


    def get_keywords(self):
        """Returns a list of keywords (list of strings)"""
        keywords = [elem for key, elem in self.dublinCore.items()
                if key[:10] == 'dc:subject' and elem]
        return keywords
          

    def get_hierarchical_keywords(self):
        """Returns a list of tuple containing hierachical keywords"""
        branches = [elem for key, elem in self.lightroom.items()
                if key[:22] == 'lr:hierarchicalSubject' and elem]
        hierarchical_keywords = [tuple(elem.split('|')) for elem in branches]

        return hierarchical_keywords



    def get_rate(self):
        """Returns rating [0-5] (int)"""
        if 'xmp:Rating' in self.xap:
            logging.debug('get_rate {}'.format(self.xap['xmp:Rating']))
            return int(self.xap['xmp:Rating'])
        else:
            return 0


    def get_label(self):
        """Returns label (color) (string)"""
        if 'xmp:Label' in self.xap:
            logging.debug('get_label {}'.format(self.xap['xmp:Label']))
            return self.xap['xmp:Label']
        else:
            return ''

    def get_usage_terms(self):
        """Returns licence usage terms (string)"""
        if 'xmpRights:UsageTerms[1]' in self.rights:
            return self.rights['xmpRights:UsageTerms[1]']
        else:
            return ''

    def get_copyright_state(self):
        """Returns copyright state (string)"""
        if 'xmpRights:Marked' in self.rights and self.rights['xmpRights:Marked']:
            return self.rights['xmpRights:Marked']
        else:
            return 'indetermined'

    def get_copyright_url(self):
        """Returns copyright's url (string)"""
        if 'xmpRights:WebStatement' in self.rights:
            return self.rights['xmpRights:WebStatement']
        else:
            return ''

    def get_copyright(self):
        """Returns copyright (string)"""
        if 'dc:rights[1]' in self.dublinCore:
            return self.dublinCore['dc:rights[1]']
        else:
            return ''

    def get_date_created(self):
        """Returns created date from xap or photoshop (date object)"""
        if 'xmp:CreateDate' in self.xap:
            # date is under form: '2014-02-24T18:34:25.00', but not always,
            # so try to detect it:
            format = detect_date_format(self.xap['xmp:CreateDate'])
            if not format:
                logging.warning('get_date_created: format not detected: {}'
                        .format(self.xap['xmp:CreateDate']))
                return self.get_date_created_ps()

            logging.debug('get_date_created {}'.format(self.xap['xmp:CreateDate']))

            return datetime.strptime(self.xap['xmp:CreateDate'],
                    format)
        else:
            return self.get_date_created_ps()


    def get_date_created_ps(self):
        if 'photoshop:DateCreated' in self.photoshop:
            # date is under form: '2014-02-24T18:34:25.00', but not always,
            # so try to detect it:
            format = detect_date_format(self.photoshop['photoshop:DateCreated'])
            if not format:
                logging.warning('get_date_created: format not detected: {}'
                        .format(self.photoshop['photoshop:DateCreated']))
                return None
            logging.debug('get_date_created {}'.format(self.photoshop['photoshop:DateCreated']))
            return datetime.strptime(self.photoshop['photoshop:DateCreated'],
                    format)
        else:
            return None


    def get_date_origin(self):
        """Returns original date from exifs (date object)"""
        if 'exif:DateTimeOriginal' in self.exif:
            # date is under form: '2014-02-24T18:34:25', but not always, 
            # so try to detect it:
            format = detect_date_format(self.exif['exif:DateTimeOriginal'])
            if not format:
                logging.warning('get_date_origin: format not detected: {}'
                        .format(self.exif['exif:DateTimeOriginal']))
                return None

            logging.debug('get_date_origin {}'
                    .format(self.exif['exif:DateTimeOriginal']))
            return datetime.strptime(self.exif['exif:DateTimeOriginal'], 
                    format)
        else:
            return None
            

    
        
        


