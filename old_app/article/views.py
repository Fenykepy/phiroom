import pprint
import json
import time

from django.utils import timezone

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.generic import DetailView, CreateView, UpdateView, DeleteView
from django.core.urlresolvers import reverse_lazy, reverse
from django.template.defaultfilters import slugify
from django.shortcuts import redirect

from weblog.utils import format_abstract, format_content
from weblog.views import WeblogMixin
from article.forms import ArticleForm
from article.models import Article
from weblog.models import Tag
from tasks.models import Task

class ArticleMixin(WeblogMixin):
    """Mixin to get generic context for pictofdays pages."""
    page_name = 'article'

# ajax cbv form class
class AjaxableResponseMixin(object):
    """Mixin to add ajax support to a form
    must be used with a object-based FormViem (e.g. CreateView)
    """
    def render_to_json_response(self, context, **response_kwargs):
        data = json.dumps(context)
        response_kwargs['content_type'] = 'application/json'
        return HttpResponse(data, **response_kwargs)

    def form_invalid(self, form):
        response = super(AjaxableResponseMixin, self).form_invalid(form)
        if self.request.is_ajax():
            html = render_to_string(self.get_template_names(), self.get_context_data(form=form, request=self.request))
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


class ViewArticle(DetailView, ArticleMixin):
    """Class to view a particular article."""
    model = Article
    context_object_name = 'entry'
    template_name = 'articles/article_view.html'

    def get_queryset(self):
        date = self.kwargs['date'].replace("/", "-", 2)
        if self.request.user.is_staff:
            return Article.not_draft.filter(slug=self.kwargs['slug'], pub_date__startswith=date)
        return Article.published.filter(slug=self.kwargs['slug'], pub_date__startswith=date)




class CreateArticle(AjaxableResponseMixin, CreateView, ArticleMixin):
    """Class to create a new article."""
    form_class = ArticleForm
    model = Article


    def get_context_data(self, **kwargs):
        context = super(CreateArticle, self).get_context_data(**kwargs)
        context['title'] = 'Enregistrer un nouvel article'
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
        """returns url"""
        # if it's a draft
        if (self.object.auto_draft or self.object.draft):
            return reverse('librairy_home')
        print(self.object.pub_date)
        return self.object.get_absolute_url()

    def form_save_pictures(self, form):
        """Save pictures associated with form."""
        pass

    def get_pictofday_date(self):
        """Get pictofday date if needed."""
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
        
        # get pictofday date in needed
        self.get_pictofday_date()

        # save changes
        if 'article_save' in form.data:
            date = timezone.now()
            create = False
            update = False
            # if no pubdate specified, pub_update and pub_date are now
            if not self.object.pub_date:
                self.object.pub_update = self.object.pub_date = date
            else:
                # if create
                if not self.object.id:
                    self.object.pub_update = self.object.pub_date
                    create = True

                # if update and no minor changes in form
                elif not 'minor_change' in form.data: 
                    self.object.pub_update = date
                    update = True

            # save form
            self.object.save()
            # save multiple choices
            form.save_m2m()
            # if associated pictures, save them
            self.form_save_pictures(form)
            # saving new tags
            new_tags = form.cleaned_data.get('new_tags')
            if new_tags:
                tags_list = new_tags.split(",")
                # strip leading and trailing spaces
                # cut tag at 30 chars lenght if necessary
                # creat tag if necessary
                # add tag to object
                for item in tags_list:
                    name = item.strip()[0:30]
                    tag_object, created = Tag.objects.get_or_create(name=name, slug=slugify(name))
                    self.object.tags.add(tag_object)
            
            if not self.object.draft and not self.object.auto_draft:
                # if create and pub_date is in future, add a task to db
                if create and self.object.pub_date > date:
                    Task(date_run_task = self.object.pub_date, entry = self.object).save()
                else:
                    # reset entry corresponding cache
                    self.object.clear_cache()
                    # if not minor change send mail to followers
                    if not self.object.is_published:
                        self.object.mail_followers()
            
            # form give a local pub_date time, sql save it in utc
            # but redirection of success_url is still made with local pub_date
            # which is wrong. To avoid that convert to utc:
            # get a timestamp from given pub_date
            t = time.mktime(self.object.pub_date.timetuple())
            # convert timestamp to utc datetime
            self.object.pub_date = self.object.pub_date.utcfromtimestamp(t).replace(tzinfo=timezone.utc)

            # return response
            if self.request.is_ajax():
                return HttpResponse(content=json.dumps({'redirect': self.get_success_url()}), content_type='application/json')
            return redirect(self.get_success_url())

        elif 'article_preview' in form.data:
            # return form and object for preview
            if self.request.is_ajax():
                html = render_to_string(self.get_template_names(), self.get_context_data(form=form, article_preview=self.object, request=self.request))
                return self.render_to_json_response({'form': html, 'moveto': '#preview'})
            return self.render_to_response(self.get_context_data(form=form, article_preview=self.object, request=self.request))




class UpdateArticle(CreateArticle, UpdateView):
    """Class to update an article."""
    def get_context_data(self, **kwargs):
        context = super(UpdateArticle, self).get_context_data(**kwargs)
        context['title'] = 'Mettre un article à jour'
        context['update'] = True

        return context


class DeleteArticle(DeleteView, ArticleMixin):
    """Class to delete an article"""
    model = Article
    success_url = reverse_lazy('weblog_home')
    context_object_name = 'entry'

    def get_context_data(self, **kwargs):
        context = super(DeleteArticle, self).get_context_data(**kwargs)
        context['title'] = 'Supprimer un article'
        context['message'] = 'Êtes vous bien sûr de vouloir supprimer l\'article'
        context['action'] = reverse('article_delete', kwargs = self.kwargs)
        if not self.request.is_ajax():
            context['tempinclude'] = 'weblog/weblog_delete.html'

        return context

    def get_template_names(self, **kwargs):
        if not self.request.is_ajax():
            return 'weblog/weblog_forms.html'
        else:
            return 'weblog/weblog_delete.html'
