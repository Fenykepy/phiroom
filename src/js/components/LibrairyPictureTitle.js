import React, { Component, PropTypes } from 'react'

import PictureTitleEdition from '../containers/PictureTitleEdition'


export default class LibrairyPictureTitle extends Component {

  constructor(props) {
    super(props)

    this.state = {
      editing: false,
    }
  }

  startEdition() {
    this.setState({editing: true})
  }
  
  stopEdition() {
    this.setState({editing: false})
  }


  render() {
    if (this.state.editing) {
      return (<PictureTitleEdition
        title={this.props.title}
        stopEdition={this.stopEdition.bind(this)}
      />)
    } else {
      return (
        <h2
          title="Click to edit"
          onClick={this.startEdition.bind(this)}
        >{this.props.title || "No title"}</h2>
      )
    }
  }
}
