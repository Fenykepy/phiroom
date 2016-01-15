import React, { Component, PropTypes } from 'react'

export default class Modal extends Component {

  getChild() {
    if (this.props.child) {
      return React.cloneElement(this.props.child, this.props)
    }
    console.warn('Modal component should always receive'
        + ' a component as "child" property.')
    return null
  }

  getCloseButton() {
    if (this.props.closable) {
      return (
        <button
          className="modal-close"
          onClick={this.props.close}
        >×</button>
      )
    }
    return null
  }

  handleClick(e) {
    if (this.props.closable) {
      this.props.close(e)
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
              <h1>{this.props.title || ""}</h1>
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
