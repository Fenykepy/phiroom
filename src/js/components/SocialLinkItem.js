import React, { Component, PropTypes } from 'react'

export default class SocialLinkItem extends Component {
  
  render() {
    return (
      <li
        className="social-icon"
      ><a
        target="_blank"
        href={this.props.link}
        className={this.props.class}
        title={"Follow me on " + this.props.title}
      ><span
          className={(() => this.props.display_title ? "" : "accessibility")()}
        >{this.props.title}</span></a></li>
    )
  }
}
