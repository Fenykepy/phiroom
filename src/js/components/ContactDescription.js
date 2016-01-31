import React, { Component, Proptypes } from 'react'

export default class ContactDescription extends Component {
  render() {
    return (
      <article>
        <h1>{this.props.description.title}</h1>
        <span dangerouslySetInnerHTML={{__html: this.props.description.content}} />
      </article>
    )
  }
}
