import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { contactDescriptionSelector } from '../selectors/contactDescriptionSelector'

import ContactMessage from '../containers/ContactMessage'

import ContactDescription from '../components/ContactDescription'
import Spinner from '../components/Spinner'
import SocialLinks from '../components/SocialLinks'

import { 
  fetchDescriptionIfNeeded,
  fetchHits,
} from '../actions/contact'
import {
  fetchAuthorIfNeeded
} from '../actions/authors'
import { setModule } from '../actions/modules'
import { 
  setDocumentTitleIfNeeded,
  setDocumentAuthor,
  setDocumentDescription,
} from '../actions/common'
import { sendHit } from '../actions/hits'



class Contact extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // get description
    promises.push(dispatch(fetchDescriptionIfNeeded()).then(data => {
      // set document title
      dispatch(setDocumentTitleIfNeeded(data.data.title))
      // set document description
      dispatch(setDocumentDescription('Contact page'))
      return data.data
    }).then(data => {
      // set document author if we have one (it's null with default description)
      if (data.author) {
        return dispatch(fetchAuthorIfNeeded(data.author)).then(data => {
          dispatch(setDocumentAuthor(data.data.author_name))
        })
      }
    }))
    // set module
    dispatch(setModule('contact'))

    return promises
  }

  static sendHit(dispatch, params=null, ip=null) {
    // send a contact page hit to server
    let data = {
      type: 'CONTACT',
      ip: ip
    }
    
    dispatch(sendHit(data))
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    this.constructor.sendHit(this.props.dispatch)
    // get contact page hits if user is staff
    if (this.props.user.is_staff) {
      this.props.dispatch(fetchHits())
    }
  }


  getDescription() {
    let desc = this.props.description
    if (! desc || desc.is_fetching) {
      // show a spinner
      return (<Spinner message="Fetching..." />)
    }
    return (<ContactDescription
      description={desc}
      hits={this.props.hits}
      user={this.props.user}
      dispatch={this.props.dispatch}
      />)
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      description,
      hits,
      user,
      settings,
    } = this.props
    //console.log('contact', this.props)
    
    return (
      <section role="main">
        {this.getDescription()}
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
        <hr />
        <article>
          <h1>Leave me a message</h1>
          <ContactMessage
          />
        </article>
      </section>
    )

  }
}


// Wrap the component to inject dispatch and state into it
export default connect(contactDescriptionSelector)(Contact)
