import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { weblogDetailSelector } from '../selectors/weblogDetailSelector'


// actions
import {
  fetchPostIfNeeded,
  fetchPostPictures,
  selectPost
} from '../actions/weblog'

import { fetchAuthorIfNeeded } from '../actions/authors'
import { fetchShortPictureIfNeeded } from '../actions/pictures'
import { lightboxStart } from '../actions/lightbox'

import { Link } from 'react-router'
import Spinner from '../components/Spinner'
import WeblogTime from '../components/WeblogTime'
import WeblogAuthor from '../components/WeblogAuthor'
import WeblogDescription from '../components/WeblogDescription'
import WeblogTags from '../components/WeblogTags'
import WeblogPostNavigation from '../components/WeblogPostNavigation'
import WeblogGallery from '../components/WeblogGallery'


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
    promises.push(dispatch(fetchPostIfNeeded(slug)).then((data) => {
      dispatch(selectPost(slug))
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
      return data
    }).then((data) => {
      // fetch author if necessary
      return dispatch(fetchAuthorIfNeeded(data.data.author))
    }))
    if (! clientSide) {
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPostPictures(slug)))
    }
    return promises
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
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
    // show spinner if no post
    if (this.props.is_fetching || ! this.props.fetched) {
      return (<Spinner message="Fetching..." />)
    }
    return (
      <div>
        <article>
          <header>
            <WeblogTime date={this.props.pub_date} />
            <h1>{this.props.title}</h1>
            <WeblogDescription description={this.props.description} />
          </header>
          <div className="content" dangerouslySetInnerHTML={{__html: this.props.content}} />
          <WeblogAuthor author={this.props.author} />
          <WeblogGallery pictures={this.props.pictures} path={this.props.location.pathname} />
          <footer>
              <WeblogTags tags={this.props.tags} />
          </footer>
        </article>
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
    } = this.props

    return (
        <section role="main">{this.getPost()}</section>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(weblogDetailSelector)(WeblogDetail)
