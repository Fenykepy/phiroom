import React, { Component, PropTypes } from 'react'

export default class ContextualMenu extends Component {

  getChild() {
    if (this.props.child) {
      return React.cloneElement(this.props.child, this.props)
    }
    console.warn('ContextualMenu component should always receive'
        + ' a component as "child" property.')
    return null
  }

  handleClick() {
    this.props.close()
    if (! this.props.close) {
      console.warn('ContextualMenu component should always receive'
          + ' a closing function a "close" property.') 
    }
  }

  render() {
    return (
      <div>
        <div id="overlay" className="transparent"
          onClick={this.handleClick.bind(this)}
        />
        <div id="contextual-menu"
          style={{top: this.props.Y, left: this.props.X}}
        >
          {this.getChild()}
        </div>
      </div>
    )
  }
}
