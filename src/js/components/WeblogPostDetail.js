import React, { Component, PropTypes } from 'react'

import WeblogTime from './WeblogTime'
import WeblogDescription from './WeblogDescription'
import WeblogAuthor from './WeblogAuthor'
import WeblogGallery from './WeblogGallery'
import WeblogTags from './WeblogTags'
import PostEditionButton from './PostEditionButton'
import HitsCounter from './HitsCounter'

export default class WeblogPostDetail extends Component {

  getEditionButton() {
    if (this.props.user.is_weblog_author) {
      return (
        <div className="admin-links">
          <PostEditionButton
            dispatch={this.props.dispatch}
            post={this.props.post}
            n_pictures={this.props.n_pictures}
            title={this.props.title}
          />
        </div>
      )
    }
    return null
  }

  getHits() {
    if (this.props.user.is_staff) {
      return (
        <HitsCounter
          hits={this.props.hits}
        />
      )
    }
  }

  render() {
    //console.log(this.props)
    return (
      <article>
        <header>
          {this.getEditionButton()}
          <div className="suptitle">
            <WeblogTime date={this.props.pub_date} />
            {this.getHits()}
          </div>
          <h1>{this.props.title}</h1>
          <WeblogDescription description={this.props.description} />
        </header>
        <div className="content" dangerouslySetInnerHTML={{__html: this.props.content}} />
        <WeblogAuthor author={this.props.author} />
        <WeblogGallery pictures={this.props.pictures} path={this.props.path} />
        <footer>
            <WeblogTags tags={this.props.tags} />
        </footer>
      </article>

    )
  }
}


