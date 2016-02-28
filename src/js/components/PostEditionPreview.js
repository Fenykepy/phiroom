import React, { Component, PropTypes } from 'react'

import marked from 'marked'

import WeblogAbstract from './WeblogAbstract'


export default class DescriptionEditionPreview extends Component {
  /*
   * TODO : fetch delimiter [...] from settings
   */
  formatContent() {
    let content = this.props.source.replate('[...]', "")
    return marked(content, {sanitize: true})
  }

  formatAbstract() {
    let abstract = this.props.source.split('[...]')[0]
    abstract = abstract.replace(/,*\s*\.*\?*!*…*$/, "") + "…"
    return marked(abstract, {sanitize: true})
  }

  render() {
    return (
      <div id="preview">
        <h5>Abstract view</h5>
        <WeblogAbstract
          pub_date={this.props.pub_date}
          title={this.props.title}
          abstract={this.formatAbstract()}
        /> 
        <h5>Detail view</h5>
      </div>
    )
  }
}
