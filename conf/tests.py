from django.test import TestCase, Client
from conf.models import Conf, Page


class ConfModelTest(TestCase):
    """Conf model test class."""
    def test_fixtures(self):
        ## assert fixtures are correctly loaded
        # get default conf object
        conf = Conf.objects.latest()

        self.assertEqual(conf.pk, 1)
        self.assertEqual(conf.comment, "Paramètres par défaut")

    def test_save_method(self):
        ## assert save method create a new conf entry
        conf = Conf.objects.latest()
        conf.comment = "New configuration"
        conf.save()
        # assert date has been set
        self.assertTrue(conf.date)

        self.assertEqual(Conf.objects.count(), 2)

        # assert latest conf is last saved one
        conf = Conf.objects.latest()
        self.assertEqual(conf.pk, 2)
        self.assertEqual(conf.comment, "New configuration")
    
    def test_get_home_page_url_name(self):
        # assert get_home_page_url_name returns good one
        conf = Conf.objects.latest()
        self.assertEqual(conf.get_home_page_url_name(), "portfolios_home")



class PageModelTest(TestCase):
    """Page model test class."""
    def test_fixtures(self):
        ## assert fixtures are correctly loaded
        initial = [
            {
                'pk': 4,
                'name': 'librairy',
                'title': 'Librairy',
                'menu': False,
                'pos': 0,
                'url_name': 'librairy_home',
            },
            {
                'pk': 1,
                'name': 'portfolios',
                'title': 'Portfolios',
                'menu': True,
                'pos': 1,
                'url_name': 'portfolios_home',
            },
            {
                'pk': 2,
                'name': 'weblog',
                'title': 'Weblog',
                'menu': True,
                'pos': 2,
                'url_name': 'weblog_home',
            },
            {
                'pk': 3,
                'name': 'contact',
                'title': 'Contact',
                'menu': True,
                'pos': 3,
                'url_name': 'contact_home',
            },
        ]
        pages = Page.objects.all()
        index = 0
        for page in pages:
            self.assertEqual(page.pk, initial[index]['pk'])
            self.assertEqual(page.name, initial[index]['name'])
            self.assertEqual(page.title, initial[index]['title'])
            self.assertEqual(page.is_in_main_menu,
                    initial[index]['menu'])
            self.assertEqual(page.position_in_main_menu,
                    initial[index]['pos'])
            self.assertEqual(page.url_name,
                    initial[index]['url_name'])
            index += 1
        
    def test_main_menu_manager(self):
        # assert main_menu_manager returns good results
        pages = Page.main_menu.all()
        self.assertEqual(pages[0]['name'], 'portfolios')
        self.assertEqual(pages[0]['title'], 'Portfolios')
        self.assertEqual(pages[0]['url_name'], 'portfolios_home')
        self.assertEqual(pages[1]['name'], 'weblog')
        self.assertEqual(pages[2]['name'], 'contact')
        self.assertEqual(len(pages), 3)
        self.assertEqual(len(pages[0]), 3)

    def test_page_info_manager(self):
        # assert page info manager returns good results
        pages = Page.page_info.filter(name='portfolios')
        self.assertEqual(len(pages), 1)
        self.assertEqual(pages[0]['name'], 'portfolios')
        self.assertEqual(pages[0]['title'], 'Portfolios')
        self.assertEqual(len(pages[0]), 2)




