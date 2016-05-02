import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
import EnsembleEditionButton from './EnsembleEditionButton'

import {
  fetchCollectionEnsembleIfNeeded,
} from '../actions/collections'
import { fetchPictureIfNeeded } from '../actions/pictures'

import {
  setTitle,
  setPictures,
} from '../actions/librairy'
import { setDocumentTitleIfNeeded } from '../actions/title'


export default class LibrairyCollectionEnsemble extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    if (! params.pk) return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchCollectionEnsembleIfNeeded(params.pk)).then(data => {
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

  render() {
    //console.log('librairy collection ensemble', this.props)
    return React.cloneElement(this.props.children, {
      container_title: 'Collection ensemble:',
      container: 'collection ensemble',
      edition_button: (
        <EnsembleEditionButton
          dispatch={this.props.dispatch}
          ensemble={this.props.params.pk}
          n_pictures={this.props.n_pictures}
          name={this.props.title}
        />
      ),
      orderable: false,
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
