import React, { Component, PropTypes } from 'react'

import SocialLinkItem from './SocialLinkItem'

export default class SocialLinks extends Component {
  
  getFacebookLink() {
    if (this.props.fb_link) {
      return (
        <SocialLinkItem
          title={'facebook'}
          class="facebook-link"
          link={this.props.fb_link}
        />
      )
    }
    return null
  }
  
  getTwitterLink() {
    if (this.props.twitter_link) {
      return (
        <SocialLinkItem
          title={'twitter'}
          class="twitter-link"
          link={this.props.twitter_link}
        />
      )
    }
    return null
  }

  getGplusLink() {
    if (this.props.gplus_link) {
      return (
        <SocialLinkItem
          title={'google plus'}
          class="gplus-link"
          link={this.props.gplus_link}
        />
      )
    }
    return null
  }

  getFlickrLink() {
    if (this.props.flickr_link) {
      return (
        <SocialLinkItem
          title={'flickr'}
          class="flickr-link"
          link={this.props.flickr_link}
        />
      )
    }
    return null
  }
  
  getVkLink() {
    if (this.props.vk_link) {
      return (
        <SocialLinkItem
          title={'vkontakte'}
          class="vk-link"
          link={this.props.vk_link}
        />
      )
    }
    return null
  }
  
  getPinterestLink() {
    if (this.props.pinterest_link) {
      return (
        <SocialLinkItem
          title={'pinterest'}
          class="pinterest-link"
          link={this.props.pinterest_link}
        />
      )
    }
    return null
  }
  
  getPx500Link() {
    if (this.props.px500_link) {
      return (
        <SocialLinkItem
          title={'500px'}
          class="px500-link"
          link={this.props.px500_link}
        />
      )
    }
    return null
  }
  
  getInstaLink() {
    if (this.props.insta_link) {
      return (
        <SocialLinkItem
          title={'instagram'}
          class="insta-link"
          link={this.props.insta_link}
        />
      )
    }
    return null
  }
  
  render() {
    return (
      <ul className="social-links">
        {this.getFacebookLink()}
        {this.getTwitterLink()}
        {this.getGplusLink()}
        {this.getFlickrLink()}
        {this.getVkLink()}
        {this.getPinterestLink()}
        {this.getPx500Link()}
        {this.getInstaLink()}
      </ul>
    )
  }
}
