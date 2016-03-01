import React, {Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Logo extends Component {
  render () {
    return (
      <div id="logo">
        <Link to="/">
          <img src={"/media/" + this.props.logo} alt={this.props.title + ', ' + this.props.subTitle} />
        </Link>
      </div>  
    )
  }
}

Logo.PropTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired
}
