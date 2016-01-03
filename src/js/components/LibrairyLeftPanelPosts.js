import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyLeftPanelPosts extends Component {

  render() {
    if (this.props.user.is_weblog_author) {
      return (
        <div>
          <h6>Posts</h6>
          <ul>
            <li><Link to="/librairy/posts/">A post</Link></li>
          </ul>
        </div>
      )
    }
    return null
  }
}
