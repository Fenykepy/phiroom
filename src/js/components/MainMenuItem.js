import React, { Component, PropTypes } from 'react';
import SubMainMenu from './SubMainMenu';



export default class MainMenuItem extends Component {
  render(){
    var submenu
    if (typeof this.props.subMenus[this.props.name] != 'undefined') { // show submenu only if necessary
      submenu = (<SubMainMenu subMenu={this.props.subMenus[this.props.name]} />)
    } else {
      submenu = ''
    }
    return (
      <li><a href={this.props.url}
             className={this.props.name == this.props.currentModule ? 'selected' : ''}
          >{this.props.title}</a>{submenu}</li>
    )
  }
}



MainMenuItem.PropTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentModule: PropTypes.string.isRequired,
}
