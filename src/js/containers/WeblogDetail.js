import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { weblogDetailSelector } from '../selectors/weblogDetailSelector'

// actions
import {
  fetchPostIfNeeded,
  fetchPostPictures,
  fetchHits,
  selectPost,
} from '../actions/weblog'

import { sendHit } from '../actions/hits'

import { fetchAuthorIfNeeded } from '../actions/authors'
import { fetchShortPictureIfNeeded } from '../actions/pictures'
import { lightboxStart } from '../actions/lightbox'
import {
  setDocumentTitleIfNeeded,
  setDocumentDescription,
  setDocumentAuthor,
} from '../actions/common'

import { Link } from 'react-router'

import Spinner from '../components/Spinner'
import WeblogPostDetail from '../components/WeblogPostDetail'
import WeblogPostNavigation from '../components/WeblogPostNavigation'
import ErrorPage from '../components/ErrorPage'

export function buildPostSlug(params) {
  // concatenate params to return a slug
  if (! params.slug || ! params.d || ! params.y || ! params.m) return false
  return params.y + '/'
    + params.m + '/'
    + params.d + '/'
    + params.slug
}



class WeblogDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    let slug = buildPostSlug(params)
    if (! slug) return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPostIfNeeded(slug)).then(data => {
      dispatch(selectPost(slug))
      // set document title
      dispatch(setDocumentTitleIfNeeded(data.data.title))
      // set document description
      let desc = `Phiroom weblog post : ${data.data.title}`
      if (data.data.description) {
        desc = desc + ` - ${data.data.description}`
      }
      desc = desc + '.'
      dispatch(setDocumentDescription(desc))
      // launch lightbox if needed
      if (params.lightbox) {
        dispatch(lightboxStart(data.data.pictures,
                params.lightbox))
      }
      // fetch related pictures if necessairy
      if (clientSide) {
        data.data.pictures.map((item) => {
          dispatch(fetchShortPictureIfNeeded(item))
        })
      }
      return data.data
    }).then(data => {
      // fetch author if necessary
      return dispatch(fetchAuthorIfNeeded(data.author)).then(data => {
        // set document author
        dispatch(setDocumentAuthor(data.data.author_name))
      })
    }))
    if (! clientSide) {
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPostPictures(slug)))
    }
    return promises
  }

  static sendHit(dispatch, params, ip=null) {
    // send a hit to server for this weblog post
    let data = {
      type: 'POST',
      related_key: buildPostSlug(params),
      ip: ip
    }

    dispatch(sendHit(data))
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
    this.constructor.sendHit(this.props.dispatch, params)
    // get post hits if user is staff
    if (this.props.user.is_staff) {
      this.props.dispatch(fetchHits(buildPostSlug(params)))
    }
  }


  componentDidMount() {
    this.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.slug != nextProps.params.slug) {
      this.fetchData(nextProps.params)
    }
  }

  getLightbox() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        dispatch: this.props.dispatch,
        pictures: this.props.picturesList,
      })
    }
    return null
  }

  getPost() {
    // show error page if error
    if (this.props.error) {
      return (
        <ErrorPage
          status={this.props.error.response.status}
        />
      )
    }
    // show spinner if no post
    if (this.props.is_fetching || ! this.props.fetched) {
      return (<Spinner message="Fetching..." />)
    }
    return (
      <div>
        <WeblogPostDetail
          user={this.props.user}
          dispatch={this.props.dispatch}
          post={buildPostSlug(this.props.params)}
          n_pictures={this.props.n_pictures}
          title={this.props.title}
          pub_date={this.props.pub_date}
          description={this.props.description}
          content={this.props.content}
          author={this.props.author}
          pictures={this.props.pictures}
          tags={this.props.tags}
          path={this.props.location.pathname}
          hits={this.props.hits}
        />
        <WeblogPostNavigation
          next={this.props.next}
          previous={this.props.previous}  
        />
        {this.getLightbox()}
      </div>
    )
  }

  render() {

    const {
      dispatch,
      title,
      description,
      content,
      draft,
      pub_date,
      author,
      n_pictures,
      pictures,
      picturesList,
      next,
      previous,
      tags,
      is_fetching,
      user,
    } = this.props

    //console.log(this.props)

    return (
        <section role="main">{this.getPost()}</section>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(weblogDetailSelector)(WeblogDetail)
