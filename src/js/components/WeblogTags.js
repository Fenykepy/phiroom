import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class WeblogTags extends Component {
  render() {
    return (
        <ul className="tags">
          {this.props.tags.map((item) => {
            return (<li key={item.name}><Link
                to={`/weblog/tag/${item.slug}/`}
              title={`See all "${item.name}" related posts.`}
              >{item.name}</Link></li>)
          })}
        </ul>
    )
  }
}
