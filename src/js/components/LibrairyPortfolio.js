import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'
import PortfolioEditionButton from './PortfolioEditionButton'

import {
  fetchPortfolioIfNeeded,
  orderPortfolioPictures,
} from '../actions/portfolios'
import { fetchPictureIfNeeded } from '../actions/pictures'
import { 
  setTitle,
  setPictures,
  startFetching,
  endFetching,
  removePictFromPortfolio,
  unsetPicture,
  orderPictInPortfolio,
} from '../actions/librairy'
import { setDocumentTitleIfNeeded } from '../actions/common'

export default class LibrairyPortfolio extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    dispatch(startFetching())
    let promises = []
    if (! params.slug) return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then(data => {
        dispatch(setPictures(data.data.pictures))
        dispatch(endFetching())
        dispatch(setTitle(data.data.title))
        // set document title
        dispatch(setDocumentTitleIfNeeded(data.data.title))
        // fetch all portfolio's pictures
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
    if (this.props.params.slug != nextProps.params.slug) {
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
      this.props.dispatch(removePictFromPortfolio(
            this.props.params.slug,
            item
      ))
    })
  }

  reorderPictures(new_order) {
    new_order.map((picture, order) => {
      // upgrade portfolio picture relation
      this.props.dispatch(orderPictInPortfolio(
            this.props.params.slug, picture, order))
    })
    // upgrade portfolio
    this.props.dispatch(orderPortfolioPictures(
          this.props.params.slug, new_order))
  }

  render() {
    //console.log('librairy portfolio', this.props)
    return React.cloneElement(this.props.children, {
      container_title: 'Portfolio: ',
      container: 'portfolio',
      edition_button: (
        <PortfolioEditionButton
          dispatch={this.props.dispatch}
          portfolio={this.props.params.slug}
          n_pictures={this.props.n_pictures}
          title={this.props.title}
        />),
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

