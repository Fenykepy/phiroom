import React, {Component, PropTypes } from 'react'
import MainMenuItem from './MainMenuItem'


export default class MainMenu extends Component {
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
