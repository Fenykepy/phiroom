import React, { Component, PropTypes } from 'react';
import SubMainMenu from './SubMainMenu';



export default class MainMenuItem extends Component {
  render(){
    var submenu
    if (this.props.subMenu.length > 0) { // show submenu only if necessary
      submenu = (<SubMainMenu subMenu={this.props.subMenu} />)
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
