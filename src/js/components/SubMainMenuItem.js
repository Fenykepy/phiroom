import React, { Component, PropTypes } from 'react'

export default class SubMainMenuItem extends Component {
  handleClick(e) {
    e.preventDefault()
    this.props.onClick(this.props.slug)
  }
  render () {
    return (
        <li><a href={"/portfolio/" + this.props.slug} onClick={(e) => this.handleClick(e)}>{this.props.title}</a></li>
    )
  }
}
