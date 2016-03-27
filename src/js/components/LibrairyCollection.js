import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
//import CollectionEditionButton from './CollectionEditionButton'

import {
  fetchCollectionIfNeeded,
  //orderCollectionPictures
} from '../actions/collections'
import { fetchPictureIfNeeded } from '../actions/pictures'

import { 
  setTitle,
  setPictures,
  removePictFromCollection,
  unsetPicture,
  //orderPictInCollection,
} from '../actions/librairy'
import { setDocumentTitleIfNeeded } from '../actions/title'


export default class LibrairyCollection extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    if (! params.pk) return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchCollectionIfNeeded(params.pk)).then(data => {
      dispatch(setPictures(data.data.pictures))
      // set librairy title
      dispatch(setTitle(data.data.name))
      // set document title
      dispatch(setDocumentTitleIfNeeded(data.data.name))
      // fetch all collection's pictures
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
    if (this.props.params.pk != nextProps.params.pk) {
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
      this.props.dispatch(removePictFromCollection(
        this.props.params.pk,
        item
      ))
    })
  }

  render() {
    //console.log('librairy collection', this.props)
    return (
      <LibrairyPicturesList
        container_title={'Collection:'}
        container={'collection'}
        orderable={true}
        removePicture={this.removePicture.bind(this)}
        {...this.props}
      />
    )
  }
}


