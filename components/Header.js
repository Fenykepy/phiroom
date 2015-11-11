import React, {Component, PropTypes } from 'react'
import Logo from './Logo'
import MainMenu from './MainMenu'

export default class Header extends Component {
  render () {
    return (
      <header role="banner">
        <Logo logo={this.props.logo} title={this.props.title} subTitle={this.props.subTitle} />
        <h1>{this.props.title}</h1>
        <h2>{this.props.subTitle}</h2>
        <MainMenu mainMenu={this.props.mainMenu} currentModule={this.props.currentModule} />
      </header>
    )
  }
}

Header.PropTypes = {
  currentModule: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  mainMenu: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired).isRequired
}
