import React, { Component, PropTypes } from 'react'

export default class SubMainMenuItem extends Component {
  handleClick(e) {
    this.props.onClick(this.props.slug)
    e.preventDefault()
  }
  render () {
    return (
        <li><a href={"/portfolio/" + this.props.slug} onClick={(e) => this.handleClick(e)}>{this.props.title}</a></li>
    )
  }
}
