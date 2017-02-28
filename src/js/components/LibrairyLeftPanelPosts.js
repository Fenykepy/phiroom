import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'

import {
  addPict2Post,
  dragEnd
} from '../actions/librairy'

import PostEditionButton from './PostEditionButton'
import LibrairyLeftPanelPostItem from './LibrairyLeftPanelPostItem'


export default class LibrairyLeftPanelPosts extends Component {

  constructor(props) {
    super(props)

    this.state = {
      show: false,
    }
  }
  
  handleDrop(post) {
    if (! this.props.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    //    console.log(this.props)
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPict2Post(post, picture))
    })
  }

  handleClick() {
    this.setState({show: ! this.state.show})
  }

  render() {
    if (this.props.user.is_weblog_author) {
      return (
        <div>
          <h6><span
            onClick={this.handleClick.bind(this)}
          >Posts</span>
            <PostEditionButton
              className="plus"
              dispatch={this.props.dispatch}
            />
          </h6>
          <ul
            style={{display: this.state.show ? "block" : "none"}}
          >
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
