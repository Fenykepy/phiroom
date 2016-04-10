import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'

import {
  fetchPicturesPksIfNeeded,
  fetchPictureIfNeeded,
} from '../actions/pictures'

import {
  setTitle,
  setPictures,
} from '../actions/librairy'

import { setDocumentTitleIfNeeded } from '../actions/title'

export default class LibrairyAll extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    promises.push(dispatch(fetchPicturesPksIfNeeded()).then(data => {
      dispatch(setPictures(data.data))
      dispatch(setTitle(null))
      // set document title
      dispatch(setDocumentTitleIfNeeded('All pictures'))
      // fetch all pictures if needed
      if (clientSide) {
        data.data.map(pk => {
          dispatch(fetchPictureIfNeeded(pk))
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
    return (
          <LibrairyPicturesList
            {...this.props}
            container_title={'All pictures'}
            container={'all'}
            dispatch={this.props.dispatch}

          />
    )
  }
}
