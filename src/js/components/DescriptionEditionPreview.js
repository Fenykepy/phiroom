import React, { Component, PropTypes } from 'react'

import marked from 'marked'

import ContactDescription from './ContactDescription'


export default class DescriptionEditionPreview extends Component {

  formatSource(source='') {
    return marked(source, {sanitize: true})
  }

  render() {
    return (
      <ContactDescription 
        user={{}}
        description={{
          title: this.props.title,
          content: this.formatSource(this.props.source)
        }}
      /> 
    )
  }
}
