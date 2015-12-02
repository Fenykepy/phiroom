import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SubMainMenu from './SubMainMenu'



export default class MainMenuItem extends Component {
  
  render(){
    var submenu
    if (this.props.subMenu.length > 0) { // show submenu only if necessary
      submenu = (<SubMainMenu subMenu={this.props.subMenu} module={this.props.name} />)
    } else {
      submenu = ''
    }
    
    return (
      <li><Link to={this.props.url}
             activeClassName="selected"
          >{this.props.title}</Link>{submenu}</li>
    )
  }
}



MainMenuItem.PropTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentModule: PropTypes.string.isRequired,
}
