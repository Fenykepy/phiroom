#-*- coding: utf-8 -*-

import markdown
import re

def format_drop_cap(string):
    """format drop_cap delimited by "<drop-cap></drop-cap>"
    from escaped html string"""
    string = re.sub("&lt;drop-cap&gt;(.+)&lt;/drop-cap&gt;",
            r'<span class="drop-cap">\1</span>' , string)
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

