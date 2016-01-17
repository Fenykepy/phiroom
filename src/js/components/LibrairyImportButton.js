import React, { Component, Proptypes } from 'react'

export default class LibrairyImportButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modal: null
    }
  }

  closeModal() {
    /*
     * Close modal window
     */
    this.setState({modal: null})
  }

  render() {
    if (this.props.user.is_staff) {
      return (
          <button
            id="import-button"
          >Import</button>
      )
    }
    return null
  }
}
