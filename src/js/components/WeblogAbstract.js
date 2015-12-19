import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import WeblogTime from './WeblogTime'

export default class WeblogAbstract extends Component {
  render() {
    return (
      <article className="abstract">
        <header>
          <WeblogTime date={this.props.pub_date} />
          <h1><Link to={`/weblog/${this.props.slug}/`}>{this.props.title}</Link></h1>
        </header>
        {/* insert first picture here if any */}
        <div className="content" dangerouslySetInnerHTML={{__html: this.props.abstract}} />
        <footer>
          <p><Link to={`/weblog/${this.props.slug}/`}>Read post</Link></p>
        </footer>
      </article>
    )
  }
}
