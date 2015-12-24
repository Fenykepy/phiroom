import React, { Component, PropTypes } from 'react'

// actions
import {
  fetchPostIfNeeded,
  fetchPostPictures,
  selectPost
} from '../actions/weblog'

import { fetchAuthorIfNeeded } from '../actions/authors'
import { fetchShortPictureIfNeeded } from '../actions/pictures'
import { setModule } from '../actions/modules'

import { Link } from 'react-router'
import Spinner from './Spinner'
import WeblogTime from './WeblogTime'
import WeblogAuthor from './WeblogAuthor'
import WeblogDescription from './WeblogDescription'
import WeblogTags from './WeblogTags'
import WeblogPostNavigation from './WeblogPostNavigation'
import WeblogGallery from './WeblogGallery'

export default class WeblogDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug || ! params.d || ! params.y || ! params.m) return promises
    let slug = params.y + '/'
      + params.m + '/'
      + params.d + '/'
      + params.slug
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPostIfNeeded(slug)).then((data) => {
      dispatch(selectPost(slug))
      // fetch related pictures if necessairy
      if (clientSide) {
        data.data.pictures.map((item) => {
          dispatch(fetchShortPictureIfNeeded(item))
        })
      }
      return data
    }).then((data) => {
      // fetch author if necessary
      return dispatch(fetchAuthorIfNeeded(data.data.author))
    }))
    if (! clientSide) {
      // set module
      dispatch(setModule('weblog'))
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPostPictures(slug)))
    }
    return promises
  }

  buildSlug(params) {
    // concatenate params to return a slug
    if (! params.slug || ! params.d || ! params.y || ! params.m) return false
    return params.y + '/'
      + params.m + '/'
      + params.d + '/'
      + params.slug
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
  }

  componentDidMount() {
    this.fetchData(this.props.params)
    // set module
    if (this.props.modules.current != 'weblog') {
      this.props.dispatch(setModule('weblog'))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.slug != nextProps.params.slug) {
      this.fetchData(nextProps.params)
    }
  }

  render() {
    let child, lightboxStarter = ''
    if (this.props.children) {
      lightboxStarter = React.cloneElement(this.props.children, {
            pictures: this.props.weblog.selectedPost.pictures,
            dispatch: this.props.dispatch,
      })
    }

    // show spinner if no selected post or post is fetching
    if (! this.props.weblog.selectedPost ||
        this.props.weblog.selectedPost.is_fetching) {
      child = (<Spinner message="Fetching…" />)
    } else {
      child = (
        <div>
        <article>
          <header>
            <WeblogTime date={this.props.weblog.selectedPost.pub_date} />
            <h1>{this.props.weblog.selectedPost.title}</h1>
            <WeblogDescription description={this.props.weblog.selectedPost.description} />
          </header>
          <div className="content" dangerouslySetInnerHTML={{__html: this.props.weblog.selectedPost.content}} />
          <WeblogAuthor author={this.props.weblog.author} />
          <WeblogGallery pictures={this.props.weblog.pictures} path={this.props.location.pathname} />
          <footer>
              <WeblogTags tags={this.props.weblog.selectedPost.tags} />
          </footer>
        </article>
        <WeblogPostNavigation
          next={this.props.weblog.selectedPost.next}
          previous={this.props.weblog.selectedPost.previous}  
        />
        {lightboxStarter}
        </div>
      )
    }

    return (
        <section role="main">{child}</section>
    )
  }
}
