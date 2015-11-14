import React, { Component, PropTypes } from 'react'

export default class SubMainMenuItem extends Component {
  render () {
    return (
        <li><a href={"/portfolio/" + this.props.slug}>{this.props.title}</a></li>
    )
  }
}
