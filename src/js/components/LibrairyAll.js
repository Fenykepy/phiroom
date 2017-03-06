import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'

import {
  fetchAllPicturesIfNeeded,
  fetchPictureIfNeeded,
} from '../actions/pictures'

import {
  setTitle,
  setPictures,
  startFetching,
  endFetching,
} from '../actions/librairy'

import { setDocumentTitleIfNeeded } from '../actions/common'

export default class LibrairyAll extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    dispatch(startFetching())
    let promises = []
    promises.push(dispatch(fetchAllPicturesIfNeeded()).then(data => {
      dispatch(setPictures(data.data))
      dispatch(endFetching())
      dispatch(setTitle(null))
      // set document title
      dispatch(setDocumentTitleIfNeeded('All pictures'))
      // fetch all pictures if needed
      if (clientSide) {
        data.data.map(sha1 => {
          dispatch(fetchPictureIfNeeded(sha1))
        })
      }
    }))
    if (! clientSide) {
      // fetch all pictures at once serverside
    }
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  render() {
    //console.log('librairy all', this.props)
    return React.cloneElement(this.props.children, {
      container_title: 'All pictures',
      container: 'all',
      orderable: false,
      dispatch: this.props.dispatch,
      selected_list: this.props.selected_list,
      pictures: this.props.pictures,
      n_pictures: this.props.n_pictures,
      n_selected: this.props.n_selected,
      drag: this.props.drag,
      columns_width: this.props.columns_width,
      location: this.props.location,
      fetching: this.props.fetching,
    })
  }
}
