import React, { Component, PropTypes } from 'react'

import marked from 'marked'

import ContactDescription from './ContactDescription'


export default class DescriptionEditionPreview extends Component {

  formatSource() {
    return marked(this.props.source, {sanitize: true})
  }

  render() {
    return (
      <ContactDescription 
        user={{}}
        description={{
          title: this.props.title,
          content: this.formatSource()
        }}
      /> 
    )
  }
}
