import React, {Component, PropTypes } from 'react'

export default class Logo extends Component {
  render () {
    return (
      <div id="logo">
        <a href="">
          <img src={this.props.logo} alt={this.props.title + ', ' + this.props.subTitle} />
        </a>
      </div>  
    )
  }
}

Logo.PropTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired
}
