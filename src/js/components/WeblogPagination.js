import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class WeblogPagination extends Component {
  render() {
    let previous = ''
    let next = ''
    if (this.props.previous) {
      let prev_page = this.props.page - 1
      previous = (<Link to={`/weblog/page/${prev_page}/`}
                        id="prev">« Recent posts</Link>)
    }
    if (this.props.next) {
      let next_page = this.props.page + 1
      next = (<Link to={`/weblog/page/${next_page}/`} 
                    id="next">Older posts »</Link>)
    }
    return (
        <nav id="pagination">
          {previous}{next}
        </nav>
    )
  }
}
