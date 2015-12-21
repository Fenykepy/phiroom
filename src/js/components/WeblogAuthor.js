import React, { Component, PropTypes } from 'react'

export default class WeblogAuthor extends Component {
  render() {
    let hr
    if (this.props.author && this.props.author.author_name) {
      hr = (
            <h6 className="author"><a href={this.props.author.website}
              rel="author">{this.props.author.author_name}</a></h6>
        )
    } else {
      hr = (<hr />)
    }
    return hr
  }
}
