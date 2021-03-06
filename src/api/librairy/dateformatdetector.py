import doctest
import re

# patterns (regexp, string format)
patterns = (
        ('^[0-9]{4}$', '%Y'),
        ('^[0-9]{4}-((0[1-9])|(1[012]))$', '%Y-%m'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))$', '%Y/%m'),
        ('^[0-9]{4} ((0[1-9])|(1[012]))$', '%Y %m'),
        ('^[0-9]{4}:((0[1-9])|(1[012]))$', '%Y:%m'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01]))$', '%Y-%m-%d'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01]))$', '%Y/%m/%d'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01]))$', '%Y %m %d'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01]))$', '%Y:%m:%d'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012]))$', '%Y-%d-%m'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012]))$', '%Y/%d/%m'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012]))$', '%Y %d %m'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012]))$', '%Y:%d:%m'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y-%m-%d %H:%M:%S'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y/%m/%d %H:%M:%S'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y %m %d %H:%M:%S'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y:%m:%d %H:%M:%S'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y-%d-%m %H:%M:%S'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y/%d/%m %H:%M:%S'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y %d %m %H:%M:%S'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y:%d:%m %H:%M:%S'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y-%m-%dT%H:%M:%S'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y/%m/%dT%H:%M:%S'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y %m %dT%H:%M:%S'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y:%m:%dT%H:%M:%S'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y-%d-%mT%H:%M:%S'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y/%d/%mT%H:%M:%S'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y %d %mT%H:%M:%S'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d$', '%Y:%d:%mT%H:%M:%S'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y-%m-%dT%H:%M:%S.%f'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y/%m/%dT%H:%M:%S.%f'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y %m %dT%H:%M:%S.%f'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y:%m:%dT%H:%M:%S.%f'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y-%d-%mT%H:%M:%S.%f'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y/%d/%mT%H:%M:%S.%f'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y %d %mT%H:%M:%S.%f'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d\.\d{1,6}$', '%Y:%d:%mT%H:%M:%S.%f'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y-%m-%dT%H:%M:%S%z'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y/%m/%dT%H:%M:%S%z'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y %m %dT%H:%M:%S%z'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y:%m:%dT%H:%M:%S%z'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y-%d-%mT%H:%M:%S%z'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y/%d/%mT%H:%M:%S%z'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y %d %mT%H:%M:%S%z'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012]))T((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y:%d:%mT%H:%M:%S%z'),

        ('^[0-9]{4}-((0[1-9])|(1[012]))-((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y-%m-%d %H:%M:%S%z'),
        ('^[0-9]{4}/((0[1-9])|(1[012]))/((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y/%m/%d %H:%M:%S%z'),
        ('^[0-9]{4} ((0[1-9])|(1[012])) ((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y %m %d %H:%M:%S%z'),
        ('^[0-9]{4}:((0[1-9])|(1[012])):((0[1-9])|([12]\d)|(3[01])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y:%m:%d %H:%M:%S%z'),

        ('^[0-9]{4}-((0[1-9])|([12]\d)|(3[01]))-((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y-%d-%m %H:%M:%S%z'),
        ('^[0-9]{4}/((0[1-9])|([12]\d)|(3[01]))/((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y/%d/%m %H:%M:%S%z'),
        ('^[0-9]{4} ((0[1-9])|([12]\d)|(3[01])) ((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y %d %m %H:%M:%S%z'),
        ('^[0-9]{4}:((0[1-9])|([12]\d)|(3[01])):((0[1-9])|(1[012])) ((0[0-9])|(1[0-9])|(2[0-3])):[0-5]\d:[0-5]\d(\+|-)((0[1-9])|(1[0-2]))[0-5]\d$', '%Y:%d:%m %H:%M:%S%z'),
    )

# compilation of patterns at module importation for faster search
compiled_patterns = [(re.compile(elem[0]), elem[1]) for elem in patterns]
compiled_patterns = tuple(compiled_patterns)

# remove unused tuple
del patterns


def detect_date_format(string):
    """Fonction to detect a date format from a string
    returns a format string to be given as second parameter
    to strptime.

    known formats:
    '2012:06:20 09:59:04'        -> Pil exif format
    '2014-02-24T18:34:25'        -> XmpInfo format '%Y-%m-%dT%H:%M:%S'
    '2014-02-24T18:34:25.00'     -> XmpInfo format '%Y-%m-%dT%H:%M:%S.%f'
    '2014-02-24T18:34:25.000009' -> XmpInfo format '%Y-%m-%dT%H:%M:%S.%f'
    '2014-02-24T18:34:25+0100'   -> XmpInfo format '%Y-%m-%dT%H:%M:%S%z'
    '2014-02-24T18:34:25-0100'   -> XmpInfo format '%Y-%m-%dT%H:%M:%S%z'

    datetime module max year is 9999 and min year is 1

    >>> detect_date_format('2012')
    '%Y'

    >>> detect_date_format('9999999')
    False

    >>> detect_date_format('2012-01')
    '%Y-%m'
    >>> detect_date_format('2012/11')
    '%Y/%m'
    >>> detect_date_format('2012 02')
    '%Y %m'
    >>> detect_date_format('2012:10')
    '%Y:%m'

    >>> detect_date_format('2012:13')
    False

    >>> detect_date_format('2012-12-01')
    '%Y-%m-%d'
    >>> detect_date_format('2012/12/01')
    '%Y/%m/%d'
    >>> detect_date_format('2012 12 01')
    '%Y %m %d'
    >>> detect_date_format('2012:12:01')
    '%Y:%m:%d'

    >>> detect_date_format('2012:31:31')
    False


    >>> detect_date_format('2012-31-02')
    '%Y-%d-%m'
    >>> detect_date_format('2012/31/02')
    '%Y/%d/%m'
    >>> detect_date_format('2012 31 02')
    '%Y %d %m'
    >>> detect_date_format('2012:31:02')
    '%Y:%d:%m'

    >>> detect_date_format('2012-12-01 23:59:59')
    '%Y-%m-%d %H:%M:%S'
    >>> detect_date_format('2012/12/01 15:59:59')
    '%Y/%m/%d %H:%M:%S'
    >>> detect_date_format('2012 12 01 10:59:59')
    '%Y %m %d %H:%M:%S'
    >>> detect_date_format('2012:12:01 01:59:59')
    '%Y:%m:%d %H:%M:%S'

    >>> detect_date_format('2012:12:01 24:59:59')
    False
    >>> detect_date_format('2012:10:02 01:60:58')
    False
    >>> detect_date_format('2012:10:02 01:59:60')
    False
    >>> detect_date_format('2012:10:00 00:59:58')
    False

    >>> detect_date_format('2012-31-02 23:59:59')
    '%Y-%d-%m %H:%M:%S'
    >>> detect_date_format('2012/31/02 23:59:59')
    '%Y/%d/%m %H:%M:%S'
    >>> detect_date_format('2012 31 02 23:59:59')
    '%Y %d %m %H:%M:%S'
    >>> detect_date_format('2012:31:02 23:59:59')
    '%Y:%d:%m %H:%M:%S'

    >>> detect_date_format('2012-12-01T23:59:59')
    '%Y-%m-%dT%H:%M:%S'
    >>> detect_date_format('2012/12/01T23:59:59')
    '%Y/%m/%dT%H:%M:%S'
    >>> detect_date_format('2012 12 01T23:59:59')
    '%Y %m %dT%H:%M:%S'
    >>> detect_date_format('2012:12:01T23:59:59')
    '%Y:%m:%dT%H:%M:%S'

    >>> detect_date_format('2012-31-02T23:59:59')
    '%Y-%d-%mT%H:%M:%S'
    >>> detect_date_format('2012/31/02T23:59:59')
    '%Y/%d/%mT%H:%M:%S'
    >>> detect_date_format('2012 31 02T23:59:59')
    '%Y %d %mT%H:%M:%S'
    >>> detect_date_format('2012:31:02T23:59:59')
    '%Y:%d:%mT%H:%M:%S'

    >>> detect_date_format('2012-12-01T23:59:59.1')
    '%Y-%m-%dT%H:%M:%S.%f'
    >>> detect_date_format('2012/12/01T23:59:59.01')
    '%Y/%m/%dT%H:%M:%S.%f'
    >>> detect_date_format('2012 12 01T23:59:59.001')
    '%Y %m %dT%H:%M:%S.%f'
    >>> detect_date_format('2012:12:01T23:59:59.0001')
    '%Y:%m:%dT%H:%M:%S.%f'

    >>> detect_date_format('2012-31-02T23:59:59.00001')
    '%Y-%d-%mT%H:%M:%S.%f'
    >>> detect_date_format('2012/31/02T23:59:59.000001')
    '%Y/%d/%mT%H:%M:%S.%f'
    >>> detect_date_format('2012 31 02T23:59:59.000000')
    '%Y %d %mT%H:%M:%S.%f'
    >>> detect_date_format('2012:31:02T23:59:59.999999')
    '%Y:%d:%mT%H:%M:%S.%f'

    >>> detect_date_format('2012:31:02T23:59:59.9999999')
    False
    >>> detect_date_format('2012:31:02T23:59:59.')
    False
    >>> detect_date_format('2012:31:02T23:59:59.1111111')
    False
    >>> detect_date_format('2012:31:02T23:59:59.0000000')
    False

    >>> detect_date_format('2012-12-01T23:59:59-0200')
    '%Y-%m-%dT%H:%M:%S%z'
    >>> detect_date_format('2012/12/01T23:59:59-0100')
    '%Y/%m/%dT%H:%M:%S%z'
    >>> detect_date_format('2012 12 01T23:59:59-1159')
    '%Y %m %dT%H:%M:%S%z'
    >>> detect_date_format('2012:12:01T23:59:59-1200')
    '%Y:%m:%dT%H:%M:%S%z'

    >>> detect_date_format('2012:31:02T23:59:59-1300')
    False
    >>> detect_date_format('2012:31:02T23:59:59+1300')
    False
    >>> detect_date_format('2012:31:02T23:59:59+01')
    False


    >>> detect_date_format('2012-31-02T23:59:59+0200')
    '%Y-%d-%mT%H:%M:%S%z'
    >>> detect_date_format('2012/31/02T23:59:59+0100')
    '%Y/%d/%mT%H:%M:%S%z'
    >>> detect_date_format('2012 31 02T23:59:59+1159')
    '%Y %d %mT%H:%M:%S%z'
    >>> detect_date_format('2012:31:02T23:59:59+1200')
    '%Y:%d:%mT%H:%M:%S%z'

    >>> detect_date_format('2012-12-01 23:59:59-0200')
    '%Y-%m-%d %H:%M:%S%z'
    >>> detect_date_format('2012/12/01 23:59:59-0100')
    '%Y/%m/%d %H:%M:%S%z'
    >>> detect_date_format('2012 12 01 23:59:59-1159')
    '%Y %m %d %H:%M:%S%z'
    >>> detect_date_format('2012:12:01 23:59:59-1200')
    '%Y:%m:%d %H:%M:%S%z'

    >>> detect_date_format('2012-31-02 23:59:59+0200')
    '%Y-%d-%m %H:%M:%S%z'
    >>> detect_date_format('2012/31/02 23:59:59+0100')
    '%Y/%d/%m %H:%M:%S%z'
    >>> detect_date_format('2012 31 02 23:59:59+1159')
    '%Y %d %m %H:%M:%S%z'
    >>> detect_date_format('2012:31:02 23:59:59+1200')
    '%Y:%d:%m %H:%M:%S%z'


    """
    # search throught patterns
    for elem in compiled_patterns:
        if elem[0].match(string):
            return elem[1]

    return False
            
if __name__ == '__main__':
    doctest.testmod()
