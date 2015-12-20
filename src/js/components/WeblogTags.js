import React, { Component, PropTypes } from 'react'

export default class WeblogTags extends Component {
  render() {
    console.log('tags', this.props.tags)
    return (
        <ul className="tags">
          {this.props.tags.map((item) => {
            return (<li><a href=""
              title={`See all "${item.name}" related posts.`}
              >{item.name}</a></li>)
          })}
        </ul>
    )
  }
}
