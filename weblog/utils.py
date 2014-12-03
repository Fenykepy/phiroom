#-*- coding: utf-8 -*-

import markdown
import re

def format_lettrine(string):
    """format lettrine delimited by "<lettrine></lettrine>"
    from escaped html string"""
    string = re.sub("<p>&lt;lettrine&gt;(.+)&lt;/lettrine&gt;",
            r'<p class="article"><span class="sc">\1</span>' , string)
    return string



def format_abstract(source, delimiter="[...]"):
    """select abstract from source delimited by delimiter (default "[...]"),
    format it with markdown and returns html"""
    # separate abstract
    abstract_tuple = source.partition(delimiter)
    abstract = abstract_tuple[0].rstrip('.!?…') + "…"
    # parse markdown
    abstract = markdown.markdown(abstract, safe_mode="escape")
    # parse lettrine
    abstract = format_lettrine(abstract)

    return abstract



def format_content(source, delimiter="[...]"):
    """format source with markdown and returns html"""
    # delete abstract delimiter
    content = source.replace(delimiter, "", 1)
    # parse markdown
    content = markdown.markdown(content, safe_mode="escape")
    # parse lettrine
    content = format_lettrine(content)

    return content

