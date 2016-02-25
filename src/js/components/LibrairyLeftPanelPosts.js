import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'

import {
  addPict2Post,
  dragEnd
} from '../actions/librairy'

import PostEditionButton from './PostEditionButton'
import LibrairyLeftPanelPostItem from './LibrairyLeftPanelPostItem'


export default class LibrairyLeftPanelPosts extends Component {

  handleDrop(post) {
    if (! this.props.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    console.log(this.props)
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPict2Post(post, picture))
    })
  }

  render() {
    if (this.props.user.is_weblog_author) {
      return (
        <div>
          <h6>Posts
            <PostEditionButton
              className="plus"
              dispatch={this.props.dispatch}
            />
          </h6>
          <ul>
            {this.props.posts.map(post =>
              <LibrairyLeftPanelPostItem
                key={post.slug}
                handleDrop={this.handleDrop.bind(this)}
                {...post}
                />
            )}
          </ul>
        </div>
      )
    }
    return null
  }
}
