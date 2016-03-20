import React, { Component, PropTypes } from 'react'

import marked from 'marked'

import WeblogPostAbstract from './WeblogPostAbstract'
import WeblogPostDetail from './WeblogPostDetail'


export default class DescriptionEditionPreview extends Component {
  /*
   * TODO : fetch delimiter [...] from settings
   */
  formatContent(source='') {
    let content = source.replace('[...]', "")
    return marked(content, {sanitize: true})
  }

  formatAbstract(source='') {
    let abstract = source.split('[...]')[0]
    abstract = abstract.replace(/,*\s*\.*\?*!*…*$/, "") + "…"
    return marked(abstract, {sanitize: true})
  }

  formatTags(tags) {
    let tags_map = []
    if (tags) {
      this.props.tags.map(tag =>
        tags_map.push({name: tag})
      )
    }
    return tags_map
  }

  render() {
    return (
      <div id="preview">
        <h5 className="underlined">Abstract view</h5>
        <WeblogPostAbstract
          pub_date={this.props.pub_date}
          title={this.props.title}
          abstract={this.formatAbstract(this.props.source)}
        /> 
        <h5 className="underlined" style={{marginTop: "75px"}}>Detail view</h5>
        <WeblogPostDetail
          author={this.props.user}
          user={{}}
          pub_date={this.props.pub_date}
          title={this.props.title}
          description={this.props.description}
          content={this.formatContent(this.props.source)}
          tags={this.formatTags(this.props.tags)}
          path={''}
          pictures={[]}
        />
      </div>
    )
  }
}
