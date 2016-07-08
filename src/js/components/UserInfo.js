import React, { Component, PropTypes } from 'react'

export default class UserInfo extends Component {
  render() {
    return (
      <div>
        <SocialLinks
          fb_link={this.props.settings.fb_link}
          twitter_link={this.props.settings.twitter_link}
          gplus_link={this.props.settings.gplus_link}
          flickr_link={this.props.settings.flickr_link}
          vk_link={this.props.settings.vk_link}
          pinterest_link={this.props.settings.pinterest_link}
          px500_link={this.props.settings.px500_link}
          insta_link={this.props.settings.insta_link}
        />
      </div>
    )
  }
}
