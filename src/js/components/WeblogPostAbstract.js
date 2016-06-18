import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import WeblogTime from './WeblogTime'
import HitsCounter from './HitsCounter'

export default class WeblogPostAbstract extends Component {

  getHits() {
    //if (this.props.user.is_staff) {
      return (
        <HitsCounter
          hits={1}
        />
      )
      //}
  }

  render() {
    return (
      <article className="abstract">
        <header>
          <div className="suptitle">
            <WeblogTime date={this.props.pub_date} />
            {this.getHits()}
          </div>
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
