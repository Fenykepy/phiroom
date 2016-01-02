import React, {Component, PropTypes } from 'react'

import { Link } from 'react-router'
import MainMenuItem from './MainMenuItem'


export default class MainMenu extends Component {

  getLibrairyLink() {
    if (this.props.user.is_staff) {
      return (
        <li><Link to="/librairy/"
            activeClassName="selected"
        >Librairy</Link></li>
      )
    }
    return null
  }

  render () {
    return (
      <nav role="navigation">
        <ul id="main-menu">
          {this.props.mainMenu.map((item) =>
              <MainMenuItem
                key={item.name}
                {...item}
                currentModule={this.props.currentModule}
              />
          )}
          {this.getLibrairyLink()}
        </ul>
      </nav>  
    )
  }
}

MainMenu.PropTypes = {
  currentModule: PropTypes.string.isRequired,
  mainMenu: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired).isRequired
}
