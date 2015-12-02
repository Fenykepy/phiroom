import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class SubMainMenuItem extends Component {
  
  render () {
    return (
        <li><Link to={`/portfolio/${this.props.slug}/`}
          activeClassName="selected">{this.props.title}</Link></li>
    )
  }
}
