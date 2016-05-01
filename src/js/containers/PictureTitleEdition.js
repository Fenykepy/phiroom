import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { pictureEditionSelector } from '../selectors/pictureEditionSelector'

import { editTitle } from '../actions/pictures'

class PictureTitleEdition extends Component {

  componentWillMount() {
    this.props.dispatch(editTitle(this.props.title))
  }

  componentDidMount() {
    this.refs.titleInput.focus()
  }

  handleValidate(e) {
    this.props.dispatch(editTitle(e.target.value))
    console.log(e.target.value)
    this.props.stopEdition()
  }

  handleKeyPress(e) {
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
      edited,
    } = this.props

    // console.log('picture title edition', this.props)
    return (
      <input
        ref="titleInput"
        name="title"
        type="text"
        defaultValue={this.props.edited.title}
        maxLength="140"
        onKeyDown={this.handleKeyPress.bind(this)}
        onKeyPress={this.handleKeyPress.bind(this)}
        onBlur={this.handleValidate.bind(this)}
      />
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(pictureEditionSelector)(PictureTitleEdition)
