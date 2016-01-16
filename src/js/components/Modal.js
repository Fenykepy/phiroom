import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {

  getChild() {
    if (this.props.modal_child) {
      return React.cloneElement(this.props.modal_child, this.props)
    }
    console.warn('Modal component should always receive'
        + ' a component as "modal_child" property.')
    return null
  }

  getCloseButton() {
    if (this.props.modal_closable) {
      return (
        <button
          className="modal-close"
          onClick={this.props.modal_close}
        >×</button>
      )
    }
    return null
  }

  handleClick(e) {
    if (this.props.modal_closable) {
      this.props.modal_close(e)
    }
  }


  render() {

    let modal_classes = []
    this.props.modal_big ? modal_classes.push("big") : ""
    this.props.modal_max ? modal_classes.push("max") : ""
    this.props.modal_small ? modal_classes.push("small") : ""
    this.props.modal_large ? modal_classes.push("large") : ""
    
    let overlay_classes = []
    this.props.modal_opaque ? overlay_classes.push("opaque") : ""
    this.props.modal_transparent ? overlay_classes.push("transparent") : ""
    
    return (
      <div id="modal-overlay"
        className={overlay_classes.join(' ')}
        onClick={this.handleClick.bind(this)}
      >
        <section
          id="modal"
          className={modal_classes.join(' ')}
        >
          <header>
              <h1>{this.props.modal_title || ""}</h1>
              {this.getCloseButton()}
          </header>
          <div id="modal-content">
            {this.getChild()}	
          </div>
        </section>
      </div>
    )
  }
}
