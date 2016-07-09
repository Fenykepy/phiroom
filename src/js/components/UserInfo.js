import React, { Component, PropTypes } from 'react'

import SocialLinks from '../components/SocialLinks'

export default class UserInfo extends Component {
  render() {
    return (
      <div className="user-info-wrapper">
        <aside className="user-info">
          <header>
            <img 
              src={"/media/" + this.props.user.avatar}
              className="avatar"
              alt={this.props.user.author_name + "'s avatar"}
            />
            <h6>{this.props.user.author_name}</h6>
          </header>
          <SocialLinks
            website={this.props.user.website}
            blog={this.props.user.blog}
            fb_link={this.props.user.fb_link}
            twitter_link={this.props.user.twitter_link}
            gplus_link={this.props.user.gplus_link}
            flickr_link={this.props.user.flickr_link}
            vk_link={this.props.user.vk_link}
            pinterest_link={this.props.user.pinterest_link}
            px500_link={this.props.user.px500_link}
            insta_link={this.props.user.insta_link}
            display_title={true}
            color_hover={false}
          />
        </aside>
      </div>
    )
  }
}
