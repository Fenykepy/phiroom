import React, { Component, PropTypes } from 'react'

import marked from 'marked'

import WeblogPostAbstract from './WeblogPostAbstract'
import WeblogPostDetail from './WeblogPostDetail'


export default class DescriptionEditionPreview extends Component {
  /*
   * TODO : fetch delimiter [...] from settings
   */
  formatContent() {
    let content = this.props.source.replace('[...]', "")
    return marked(content, {sanitize: true})
  }

  formatAbstract() {
    let abstract = this.props.source.split('[...]')[0]
    abstract = abstract.replace(/,*\s*\.*\?*!*…*$/, "") + "…"
    return marked(abstract, {sanitize: true})
  }

  formatTags() {
    let tags = []
    if (this.props.tags) {
      this.props.tags.map(tag =>
        tags.push({name: tag})
      )
    }
    return tags
  }

  render() {
    return (
      <div id="preview">
        <h5>Abstract view</h5>
        <WeblogPostAbstract
          pub_date={this.props.pub_date}
          title={this.props.title}
          abstract={this.formatAbstract()}
        /> 
        <h5>Detail view</h5>
        <WeblogPostDetail
          user={{}}
          pub_date={this.props.pub_date}
          title={this.props.title}
          description={this.props.description}
          content={this.formatContent()}
          tags={this.formatTags()}
          path={''}
          pictures={[]}
        />
      </div>
    )
  }
}
