import React, {Component, PropTypes } from 'react'
import Logo from './Logo'

export default class Header extends Component {
  render () {
    return (
      <header role="banner">
        <Logo logo={this.props.logo} title={this.props.title} subTitle={this.props.subTitle} />
        {/*<MainMenu portfolios=this.props.mainMenu />*/}
      </header>
    )
  }
}

Header.PropTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
/*  mainMenu: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    module_name: PropTypes.string.isRequired,
  }).isRequired).isRequired*/
}
