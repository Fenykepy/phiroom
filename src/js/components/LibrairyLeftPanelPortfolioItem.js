import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { PICTURE } from '../constants/dragTypes'

import { listsHaveCommon } from '../helpers/utils'

export default class LibrairyLeftPanelPortfolioItem extends Component {

  constructor(props) {
    super(props)

    this.accepted_drop = [PICTURE]

    this.state = {
      dragover: false
    }
  }
  
  handleDragEnter(e) {
    if (listsHaveCommon(e.dataTransfer.types, this.accepted_drop)) {
      e.preventDefault()
      this.setState({dragover: true})
    }
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.setState({dragover: false})
  }

  handleDragOver(e) {
    if (listsHaveCommon(e.dataTransfer.types, this.accepted_drop)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }
  }

  handleDrop(e) {
    if (listsHaveCommon(e.dataTransfer.types, this.accepted_drop)) {
      e.preventDefault()
      this.setState({dragover: false})
      this.props.handleDrop(this.props.pk)
    }
  }

  render() {
    return (
      <li>
        <Link to={`/librairy/portfolio/${this.props.slug}`}
              activeClassName="selected"
              className={this.state.dragover ? "dragover" : ""}
              onDragEnter={this.handleDragEnter.bind(this)}
              onDragLeave={this.handleDragLeave.bind(this)}
              onDragOver={this.handleDragOver.bind(this)}
              onDrop={this.handleDrop.bind(this)}
        >{this.props.title}</Link>
      </li>
    )
  }
}
