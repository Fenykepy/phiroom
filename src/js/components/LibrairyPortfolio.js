import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'

import { fetchPortfolioIfNeeded } from '../actions/portfolios'
import { fetchPictureIfNeeded } from '../actions/pictures'
import { 
  setPictures,
  removePictFromPortfolio,
  unsetPicture,
} from '../actions/librairy'

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

  componentWillReceiveProps(nextProps) {
    if (this.props.params.slug != nextProps.params.slug) {
      this.constructor.fetchData(this.props.dispatch, nextProps.params, true)
    }
  }

  removePicture(picture) {
    console.log(this.props)
    let to_remove
    // picture is selected, remove all selection
    if (this.props.librairy.selected_list.indexOf(picture) > -1) {
      to_remove = this.props.librairy.selected_list
    } else {
      // remove only given picture
      to_remove = [picture]
    }
    // remove all picts in array
    to_remove.map(item => {
      this.props.dispatch(unsetPicture(item))
      this.props.dispatch(removePictFromPortfolio(
            this.props.params.slug,
            item
      ))
    })
  }

  render() {
    return (
          <LibrairyPicturesList
            {...this.props.librairy}
            container={'portfolio'}
            dispatch={this.props.dispatch}
            removePicture={this.removePicture.bind(this)}
          />
    )
  }
}
