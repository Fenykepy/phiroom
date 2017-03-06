import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
import PostEditionButton from './PostEditionButton'

import {
  fetchPostIfNeeded,
  orderPostPictures,
} from '../actions/weblog'

import { fetchPictureIfNeeded } from '../actions/pictures'
import {
  setTitle,
  setPictures,
  startFetching,
  endFetching,
  removePictFromPost,
  unsetPicture,
  orderPictInPost,
} from '../actions/librairy'
import { setDocumentTitleIfNeeded } from '../actions/common'

import { buildPostSlug } from '../containers/WeblogDetail'

export default class LibrairyPost extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    dispatch(startFetching())
    let promises = []
    let slug = buildPostSlug(params)
    if (! slug) return promises
    // use static to be able to call it server side befour component is rendered
    promises.push(dispatch(fetchPostIfNeeded(slug)).then(data => {
      dispatch(setPictures(data.data.pictures))
      dispatch(endFetching())
      dispatch(setTitle(data.data.title))
      // set document title
      dispatch(setDocumentTitleIfNeeded(data.data.title))
      // fetch all post's pictures
      if (clientSide) {
        data.data.pictures.map(item => {
          dispatch(fetchPictureIfNeeded(item))
        })
      }
    }))
    if (! clientSide) {
      // fetch all pictures at once serverside
    }
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props.params, true)
  }

  componentWillReceiveProps(nextProps) {
    let slug = buildPostSlug(this.props.params)
    let next_slug = buildPostSlug(nextProps.params)
    if (slug != next_slug) {
      this.constructor.fetchData(this.props.dispatch, nextProps.params, true)
    }
  }
  
  removePicture(picture) {
    let to_remove = [picture]
    // picture is selected, remove all selection
    if (this.props.selected_list.indexOf(picture) > -1) {
      to_remove = this.props.selected_list
    }
    // remove all picts in array
    to_remove.map(item => {
      this.props.dispatch(unsetPicture(item))
      this.props.dispatch(removePictFromPost(
        buildPostSlug(this.props.params),
        item
      ))
    })
  }

  reorderPictures(new_order) {
    new_order.map((picture, order) => {
      // upgrade post picture relation
      this.props.dispatch(orderPictInPost(
          buildPostSlug(this.props.params), picture, order))
    })
    // upgrade post
    this.props.dispatch(orderPostPictures(
        buildPostSlug(this.props.params), new_order))
  }

  render() {
    //console.log('librairy post', this.props)
    return React.cloneElement(this.props.children, {
      container_title: 'Post:',
      container: 'post',
      edition_button: (
        <PostEditionButton
          dispatch={this.props.dispatch}
          post={buildPostSlug(this.props.params)}
          n_pictures={this.props.n_pictures}
          title={this.props.title}
        />
      ),
      orderable: true,
      removePicture: this.removePicture.bind(this),
      reorderPictures: this.reorderPictures.bind(this),
      dispatch: this.props.dispatch,
      selected_list: this.props.selected_list,
      pictures: this.props.pictures,
      n_pictures: this.props.n_pictures,
      n_selected: this.props.n_selected,
      title: this.props.title,
      drag: this.props.drag,
      columns_width: this.props.columns_width,
      location: this.props.location,
      fetching: this.props.fetching,
    })
  }
}

