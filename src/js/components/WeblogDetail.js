import React, { Component, PropTypes } from 'react'

// actions
import {
  fetchPostIfNeeded,
  selectPost
} from '../actions/weblog'
import { setModule } from '../actions/modules'

import { Link } from 'react-router'
import Spinner from './Spinner'
import WeblogTime from './WeblogTime'
import WeblogPostNavigation from './WeblogPostNavigation'

export default class WeblogDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug || ! params.d || ! params.y || ! params.m) return promises
    let slug = params.y + '/'
      + params.m + '/'
      + params.d + '/'
      + params.slug
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPostIfNeeded(slug)).then(data => {
      dispatch(selectPost(slug))
    }))
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
    console.log('props', this.props)
    let child
    // show spinner if no selected post or post is fetching
    if (! this.props.weblog.selectedPost ||
        this.props.weblog.selectedPost.is_fetching) {
      child = (<Spinner message="Fetching…" />)
    } else {
      let description = ''
      if (this.props.weblog.selectedPost.description) {
        description = (
            <p className="description">{this.props.weblog.selectedPost.description}</p>
        )
      }
      child = (
        <div><article>
          <header>
            <WeblogTime date={this.props.weblog.selectedPost.pub_date} />
            <h1>{this.props.weblog.selectedPost.title}</h1>
            {description}
          </header>
          <div className="content" dangerouslySetInnerHTML={{__html: this.props.weblog.selectedPost.content}} />
          <footer>
              <ul id="tags">
              </ul>
          </footer>
        </article>
        <WeblogPostNavigation
          next={this.props.weblog.selectedPost.next}
          previous={this.props.weblog.selectedPost.previous}  
        /></div>
      )
    }

    return (
        <section role="main">{child}</section>
    )
  }
}
