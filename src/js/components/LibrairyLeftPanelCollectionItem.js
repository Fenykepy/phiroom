import  React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { PICTURE } from '../constants/dragTypes'

import { listsHaveCommon } from '../helpers/utils'

export default class LibrairyLeftPanelCollectionItem extends Component {

  constructor(props) {
    super(props)

    this.accepted_drop = [PICTURE]

    this.state = {
      dragover: false
    }
  }

  dropValid(types) {
    /*
     * Returns true if drag object is valid for basket
     */
    return listsHaveCommon(types, this.accepted_drop)
  }

  handleDragEnter(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.setState({dragover: true})
    }
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.setState({dragover: false})
  }

  handleDragOver(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }
  }

  handleDrop(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.setState({dragover: false})
      this.props.handleDrop(this.props.pk)
    }
  }

  render() {
    return (
      <li className="collection">
        <Link to={`/librairy/collections/${this.props.pk}/`}
          activeClassName="Selected"
          className={this.state.dragover ? "dragover" : ""}
          onDragEnter={this.handleDragEnter.bind(this)}
          onDragLeave={this.handleDragLeave.bind(this)}
          onDragOver={this.handleDragOver.bind(this)}
          onDrop={this.handleDrop.bind(this)}
        >{this.props.name}</Link>
      </li>
    )
  }
}