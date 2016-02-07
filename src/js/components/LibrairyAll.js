import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'

import {
  fetchPicturesPksIfNeeded,
  fetchPictureIfNeeded,
} from '../actions/pictures'

import { setPictures } from '../actions/librairy'


export default class LibrairyAll extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    promises.push(dispatch(fetchPicturesPksIfNeeded()).then(data => {
      console.log('set picture', data.data)
      dispatch(setPictures(data.data))
      data.data.map(pk => {
        dispatch(fetchPictureIfNeeded(pk))
      })
    }))
    // fetch all full pictures
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  render() {
    console.log('librairy all', this.props)
    return (
          <LibrairyPicturesList
            {...this.props}
            container={'all'}
            dispatch={this.props.dispatch}
          />
    )
  }
}
