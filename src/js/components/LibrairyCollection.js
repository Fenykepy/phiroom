import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
import CollectionEditionButton from './CollectionEditionButton'

import {
  fetchCollectionIfNeeded,
  orderCollectionPictures
} from '../actions/collections'
import { fetchPictureIfNeeded } from '../actions/pictures'

import { 
  setTitle,
  setPictures,
  removePictFromCollection,
  unsetPicture,
  orderPictInCollection,
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

  reorderPictures(new_order) {
    new_order.map((picture, order) => {
      // upgrade collection-picture relation
      this.props.dispatch(orderPictInCollection(
          this.props.params.pk, picture, order))
    })
    // upgrade collection
    this.props.dispatch(orderCollectionPictures(
        this.props.params.pk, new_order))
  }

  render() {
    //console.log('librairy collection', this.props)
    return React.cloneElement(this.props.children, {
      container_title: 'Collection:',
      container: 'collection',
      edition_button: (
        <CollectionEditionButton
          dispatch={this.props.dispatch}
          collection={this.props.params.pk}
          n_pictures={this.props.n_pictures}
          name={this.props.title}
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
    })
  }
}


