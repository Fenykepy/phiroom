import React, { Component, PropTypes } from 'react'

import SocialLinkItem from './SocialLinkItem'

export default class SocialLinks extends Component {

  getClass(className) {
    if (this.props.color_hover) {
      return className + " color"
    }
    return className
  }

  getWebsiteLink() {
    if (this.props.website_link) {
      return (
        <SocialLinkItem
          title={'Website'}
          class={this.getClass("website-link")}
          link={this.props.website_link}
          display_title={this.props.display_title}
        />
      )
    }
  }
  getBlogLink() {
    if (this.props.blog_link) {
      return (
        <SocialLinkItem
          title={'Blog'}
          class={this.getClass("blog-link")}
          link={this.props.blog_link}
          display_title={this.props.display_title}
        />
      )
    }
  }
  getEtsyLink() {
    if (this.props.etsy_link) {
      return (
        <SocialLinkItem
          title={'Etsy'}
          class={this.getClass("etsy-link")}
          link={this.props.etsy_link}
          display_title={this.props.display_title}
        />
      )
    }
  }
  getFacebookLink() {
    if (this.props.fb_link) {
      return (
        <SocialLinkItem
          title={'Facebook'}
          class={this.getClass("facebook-link")}
          link={this.props.fb_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }
  
  getTwitterLink() {
    if (this.props.twitter_link) {
      return (
        <SocialLinkItem
          title={'Twitter'}
          class={this.getClass("twitter-link")}
          link={this.props.twitter_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }

  getGplusLink() {
    if (this.props.gplus_link) {
      return (
        <SocialLinkItem
          title={'Google plus'}
          class={this.getClass("gplus-link")}
          link={this.props.gplus_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }

  getFlickrLink() {
    if (this.props.flickr_link) {
      return (
        <SocialLinkItem
          title={'Flickr'}
          class={this.getClass("flickr-link")}
          link={this.props.flickr_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }
  
  getVkLink() {
    if (this.props.vk_link) {
      return (
        <SocialLinkItem
          title={'Vkontakte'}
          class={this.getClass("vk-link")}
          link={this.props.vk_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }
  
  getPinterestLink() {
    if (this.props.pinterest_link) {
      return (
        <SocialLinkItem
          title={'Pinterest'}
          class={this.getClass("pinterest-link")}
          link={this.props.pinterest_link}
          display_title={this.props.display_title}
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
          class={this.getClass("px500-link")}
          link={this.props.px500_link}
          display_title={this.props.display_title}
          color_hover={this.props.color_hover}
        />
      )
    }
    return null
  }
  
  getInstaLink() {
    if (this.props.insta_link) {
      return (
        <SocialLinkItem
          title={'Instagram'}
          class={this.getClass("insta-link")}
          link={this.props.insta_link}
          display_title={this.props.display_title}
        />
      )
    }
    return null
  }
  
  render() {
    return (
      <ul className="social-links">
        {this.getWebsiteLink()}
        {this.getBlogLink()}
        {this.getEtsyLink()}
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
