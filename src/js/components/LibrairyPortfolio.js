import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'

import { fetchPortfolioIfNeeded } from '../actions/portfolios'
import { fetchPictureIfNeeded } from '../actions/pictures'
import { setPictures } from '../actions/librairy'

export default class LibrairyPortfolio extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    if (! params.slug) return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then((data) => {
        dispatch(setPictures(data.data.pictures))
        data.data.pictures.map((item) => {
          dispatch(fetchPictureIfNeeded(item))
        })
    }))
    // fetch all portfolio's pictures
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, this.props.params, true)
  }

  render() {
    console.log('port',this.props)
    return (
          <LibrairyPicturesList pictures={null} />
    )
  }
}
