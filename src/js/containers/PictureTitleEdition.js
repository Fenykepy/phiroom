import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { updatePictureTitle } from '../actions/pictures'

class PictureTitleEdition extends Component {

  componentDidMount() {
    // we give focus on input and we select its text
    this.refs.titleInput.focus()
    this.refs.titleInput.select()
  }

  handleValidate(e) {
    this.props.dispatch(updatePictureTitle(
      this.props.picture,
      e.target.value))
    console.log(e.target.value)
    this.props.stopEdition()
  }

  handleTabEnter(e) {
    // react on tab and enter key to validate
    let TAB_KEY = 9
    let ENTER_KEY = 13
    if (e.which === TAB_KEY || e.which === ENTER_KEY) {
      this.handleValidate(e)
    }
  }

  render() {
    // injected by connect call:
    const {
      dispatch,
    } = this.props

    // console.log('picture title edition', this.props)
    return (
      <input
        ref="titleInput"
        name="title"
        type="text"
        defaultValue={this.props.title}
        maxLength="140"
        onKeyDown={this.handleTabEnter.bind(this)}
        onKeyPress={this.handleTabEnter.bind(this)}
        onBlur={this.handleValidate.bind(this)}
      />
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect((state) => state )(PictureTitleEdition)
