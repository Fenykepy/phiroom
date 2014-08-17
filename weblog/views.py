import json
import time

from django.utils import timezone
from django.views.generic import ListView, DetailView, CreateView, \
        UpdateView, DeleteView
from django.views.generic.base import ContextMixin
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.shortcuts import redirect
from django.core.urlresolvers import reverse_lazy, reverse
from django.template.defaultfilters import slugify


from phiroom.settings import PHIROOM
from weblog.models import Entry, Tag, Entry_pictures
from weblog.forms import EntryForm
from weblog.utils import format_abstract, format_content
from conf.models import Conf, Page
from user.forms import LoginForm
from tasks.models import Task
from librairy.models import Picture



class ConfMixin(ContextMixin):
    """Mixin to get common context for the whole site."""
    page_name = 'weblog'

    def __init__(self, *args, **kwargs):
        super(ConfMixin, self).__init__(*args, **kwargs)
        self.conf = Conf.objects.latest('date')

    def get_context_data(self, **kwargs):
        context = super(ConfMixin, self).get_context_data(**kwargs)
        context['conf'] = self.conf
        context['page_info'] = Page.objects.get(name = self.page_name)
        context['menu'] = Page.objects.filter(is_in_main_menu=True).order_by(
                'position_in_main_menu', 'pk')
        context['phiroom'] = PHIROOM

        return context



class WeblogMixin(ConfMixin):
    """Mixin to get common context for weblog pages."""
    page_name = 'weblog'

    def get_context_data(self, **kwargs):
        context = super(WeblogMixin, self).get_context_data(**kwargs)
        context['entrys_menu'] = Entry.published.all(
                )[:self.conf.n_last_entrys_menu]
        context['portfolios_menu'] = Entry.published.filter(
                portfolio=True)
        context['tags'] = Tag.objects.all()
        context['login_form'] = LoginForm()
        # for pagination links max and min
        if 'page' in self.kwargs:
            page = int(self.kwargs['page'])
            context['slice'] = "{0}:{1}".format(page - 4, page + 3)

        return context



class AjaxableResponseMixin(object):
    """Mixin to add ajax support to a form
    must be used with a object-based FormViem (e.g. CreateView)."""
    def render_to_json_response(self, context, **response_kwargs):
        data = json.dumps(context)
        response_kwargs['content_type'] = 'application/json'
        return HttpResponse(data, **response_kwargs)

    def form_invalid(self, form):
        response = super(AjaxableResponseMixin, self).form_invalid(form)
        if self.request.is_ajax():
            html = render_to_string(self.get_template_names(),
                    self.get_context_data(form=form, request=self.request))
            return self.render_to_json_response({'form': html})
        else:
            return response

    def form_valid(self, form):
        response = super(AjaxableResponseMixin, self).form_valid(form)
        if self.request.is_ajax():
            data = { 'pk': self.object.pk }
            return self.render_to_json_response(data)
        else:
            return response



class ListEntrys(ListView, WeblogMixin):
    """List all weblog entrys by pub_update."""
    model = Entry
    context_object_name = 'entrys'
    template_name = 'weblog/weblog_list.html'

    def get_paginate_by(self, queryset):
        """Get the number of items to paginate by,
        or None for no pagination."""
        return self.conf.n_entrys_per_page

    def get_queryset(self):
        return Entry.published.all()



class ListPortfolios(ListEntrys):
    """List all weblog portfolios by pub_update."""
    def get_queryset(self):
        return Entry.published.filter(portfolio=True)



class ListEntrysByTag(ListEntrys):
    """List all weblog entrys corresponding to given tag."""
    def get_context_data(self, **kwargs):
        context = super(ListEntrysByTag, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['slug']

        return context


    def get_queryset(self):
         return Entry.published.filter(tags__slug = self.kwargs['slug'])



class ListEntrysByPostsPicture(ListEntrys):
    """List all posts corresponding to given picture."""
    def get_context_data(self, **kwargs):
        context = super(
                ListEntrysByPostsPicture, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']

        return context


    def get_queryset(self):
        return Entry.published.filter(
                entry_pictures__picture__id = self.kwargs['pk'],
                portfolio=False)



class ListEntrysByPortfoliosPicture(ListEntrys):
    """List all portfolios corresponding to given picture."""
    def get_context_data(self, **kwargs):
        context = super(
                ListEntrysByPortfoliosPicture, self).get_context_data(**kwargs)
        context['arg0'] = self.kwargs['pk']

        return context


    def get_queryset(self):
        return Entry.published.filter(
                entry_pictures__picture__id = self.kwargs['pk'],
                portfolio=True)



class ViewEntry(DetailView, WeblogMixin):
    """View for a particular entry."""
    model = Entry
    context_object_name = 'entry'
    template_name = 'weblog/weblog_view.html'

    def get_queryset(self):
        date = self.kwargs['date'].replace("/", "-", 2)
        if self.request.user.is_staff:
            return Entry.not_draft.filter(slug=self.kwargs['slug'],
                    pub_date__startswith=date)
        return Entry.published.filter(slug=self.kwargs['slug'],
                    pub_date__startswith=date)


class CreateEntry(AjaxableResponseMixin, CreateView, WeblogMixin):
    """View to create a new entry."""
    form_class = EntryForm
    model = Entry
    through_model = Entry_pictures

    def get_context_data(self, **kwargs):
        context = super(CreateEntry, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouveau post'
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_edit.html'
            context['cancel_link'] = reverse_lazy('weblog_home')

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            return 'weblog/weblog_edit.html'

    def get_success_url(self):
        # if it's a draft
        if (self.object.auto_draft or self.object.draft):
            return reverse('weblog_home')
        return self.object.absolute_url

    def form_save_pictures(self, form):
        """Save pictures associated with form."""
        # check if collection or folder has been given
        collection = form.cleaned_data.get('collection')
        folder = form.cleaned_data.get('folder')
        if collection:
            # save related pictures from collection
            for item in collection.pictures.all():
                try:
                    pict = self.through_model.objects.get(entry=self.object,
                            picture=item)
                except:
                    pict = self.through_model(entry=self.object,
                            picture=item)
                    pict.save()

        if folder:
            # save related pictures from folder
            for item in folder.get_directory_pictures():
                try:
                    pict = self.through_model.objects.get(entry=self.object,
                            picture=item)
                except:
                    pict = self.through_model(entry=self.object, picture=item)
                    pict.save()

        # save entry's number of pictures
        self.object.n_pict = self.object.pictures.all().count()

    def form_pre_save(self, form):
        """Executed before saving object."""
        pass


    def form_valid(self, form):
        """If form is valid, save associated model."""
        self.object = form.save(commit=False)
        # definition of author
        self.object.author = self.request.user
        # definition of abstract
        self.object.abstract = format_abstract(self.object.source)
        # definition of content
        self.object.content = format_content(self.object.source)

        # save changes
        if 'entry_save' in form.data:
            date = timezone.now()
            create = False
            update = False
            # if no pubdate specified (creation),
            # pub_update and pub_date are at current time
            if not self.object.pub_date:
                self.object.pub_update = self.object.pub_date = date
            else:
                # if creation
                if not self.object.id:
                    self.object.pub_update = self.object.pub_date
                    create = True

                # if update and no minor changes in form
                elif not 'minor_change' in form.data:
                    self.object.pub_update = date
                    update = True

            # if no pict and no text, auto_draf
            if self.object.n_pict < 1 and len(self.object.content) < 1:
                self.object.auto_draft = True

            ## convert pub_date to utc before saving
            # form give a local pub_date time, sql save it in utc
            # but redirection of success_url is still made with local pub_date
            # which is wrong. To avoid that convert to utc:
            # get a timestamp from given pub_date
            t = time.mktime(self.object.pub_date.timetuple())
            # convert timestamp to utc datetime
            self.object.pub_date = self.object.pub_date.utcfromtimestamp(
                    t).replace(tzinfo=timezone.utc)

            # save form
            self.form_pre_save(form)
            self.object.save()

            # save multiple choices (tags)
            form.save_m2m()
            # if associated pictures, save them
            self.form_save_pictures(form)

            # 
            # add and save new tags
            new_tags = form.cleaned_data.get('new_tags')
            if new_tags:
                tags_list = new_tags.split(",")
                # strip leading and trailing spaces
                # cut tag at 50 chars lenght if necessary
                # create tag if necessary
                # add tag to object
                for item in tags_list:
                    name = item.strip()[0:30]
                    tag_object, created = Tag.objects.get_or_create(name=name,
                            slug=slugify(name))
                    self.object.tags.add(tag_object)

            if not self.object.draft and not self.object.auto_draft:
                # if create and pub_date is in future, add a task to db
                if create and self.object.pub_date > date:
                    Task(date_run_task = self.object.pub_date,
                            entry = self.object).save()
                else:
                    # reset entry corresponding cache
                    self.object.clear_cache()
                    # if not minor change send mail to followers
                    if not self.object.is_published:
                        self.object.mail_followers()


            # return response
            if self.request.is_ajax():
                return HttpResponse(content=json.dumps({
                    'redirect': self.get_success_url()}),
                        content_type='application/json')
            return redirect(self.get_success_url())

        elif 'entry_preview' in form.data:
            # return form and object for preview
            if self.request.is_ajax():
                html = render_to_string(self.get_template_names(),
                        self.get_context_data(form=form,
                            entry_preview=self.object, request=self.request))
                return self.render_to_json_response({
                    'form': html,
                    'moveto': '#preview'
                })
            return self.render_to_response(self.get_context_data(form=form,
                entry_preview=self.object, request=self.request))



class UpdateEntry(CreateEntry, UpdateView):
    """View to update a post entry."""
    def get_context_data(self, **kwargs):
        context = super(UpdateEntry, self).get_context_data(**kwargs)
        context['title'] = 'Mettre un post à jour'
        context['update'] = True

        return context




class DeleteEntry(DeleteView, WeblogMixin):
    """View to delete a post entry."""
    model = Entry
    success_url = reverse_lazy('weblog_home')
    context_object_name = 'entry'

    def get_context_data(self, **kwargs):
        context = super(DeleteEntry, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer un post'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer le post '
        context['action'] = reverse_lazy('entry_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            return 'weblog/weblog_delete.html'

    def delete(self, request, *args, **kwargs):
        """
        Calls the delete() method on the fetched object and then
        redirects to the success URL.
        """
        self.object = self.get_object()
        success_url = self.get_success_url()
        self.object.delete()

        if self.request.is_ajax():
            return HttpResponse(content=json.dumps({
                'redirect': success_url}),
                content_type='application/json')
        return redirect(success_url)


