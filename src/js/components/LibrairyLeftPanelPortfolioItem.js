import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { PICTURE } from '../constants/dragTypes'


export default class LibrairyLeftPanelPortfolioItem extends Component {

  handleDragEnter() {
    console.log('dragenter')
  }

  handleDragLeave() {
    console.log('dragleave')
  }

  render() {
    return (
      <li>
        <Link to={`/librairy/portfolio/${this.props.slug}`}
              activeClassName="selected"
              onDragEnter={this.handleDragEnter.bind(this)}
              onDragLeave={this.handleDragLeave.bind(this)}
        >{this.props.title}</Link>
      </li>
    )
  }
}
