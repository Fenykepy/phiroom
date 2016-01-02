import React, { Component, PropTypes } from 'react'
import Logo from './Logo'
import MainMenu from './MainMenu'

export default class Header extends Component {
  render () {
    return (
      <header role="banner">
        <Logo
          logo={this.props.settings.weblog_logo}
          title={this.props.settings.title}
          subTitle={this.props.settings.subtitle}
        />
        <h1>{this.props.settings.title}</h1>
        <h2>{this.props.settings.subtitle}</h2>
        <MainMenu
          mainMenu={this.props.modules.mainMenu}
          currentModule={this.props.modules.current}
          user={this.props.user}
        />
      </header>
    )
  }
}

Header.PropTypes = {
  mainMenu: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired).isRequired

}
