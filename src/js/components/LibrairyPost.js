import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
//import PostEditionButton from './PostEditionButton'

import {
  fetchPostIfNeeded,
  orderPostPictures,
} from '../actions/weblog'

import { fetchPictureIfNeeded } from '../actions/pictures'
import {
  setTitle,
  setPictures,
  removePictFromPost,
  unsetPicture,
  orderPictInPost,
} from '../actions/librairy'

import { buildPostSlug } from '../containers/WeblogDetail'

export default class LibrairyPost extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    let slug = buildPostSlug(params)
    if (! slug) return promises
    // use static to be able to call it server side befour component is rendered
    promises.push(dispatch(fetchPostIfNeeded(slug)).then(data => {
      dispatch(setPictures(data.data.pictures))
      dispatch(setTitle(data.data.title))
      // fetch all post's pictures
      data.data.pictures.map(item => {
        dispatch(fetchPictureIfNeeded(item))
      })
    }))
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
    return (
      <LibrairyPicturesList
        container_title={'Post:'}
        container={'post'}
        orderable={true}
        removePicture={this.removePicture.bind(this)}
        reorderPictures={this.reorderPictures.bind(this)}
        {...this.props}
      />
    )
  }
}

