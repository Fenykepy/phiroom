import React, { Component, PropTypes } from 'react'

import Carousel from './Carousel'
import CarouselInline from './CarouselInline'
import Spinner from './Spinner'


// actions
import {
  fetchPortfolioIfNeeded,
  fetchPortfolioPictures,
  selectPortfolio,
  nextPict,
  prevPict,
  toggleSlideshow
} from '../actions/portfolios'
import { fetchShortPictureIfNeeded } from '../actions/pictures'
import { setModule } from '../actions/modules'


export default class PortfolioDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug)  return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then((data) => {
        dispatch(selectPortfolio(params.slug))
        // fetch portfolios pictures if needed
        if (clientSide) {
          // set module
          data.data.pictures.map((item) => {
            dispatch(fetchShortPictureIfNeeded(item))
          })
        }
    }))
    if (! clientSide) {
      // set module
      dispatch(setModule('portfolios'))
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPortfolioPictures(params.slug)))
    }
    return promises
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
  }

  componentDidMount() {
    this.fetchData(this.props.params)
    // set module
    if (this.props.modules.current != 'portfolios') {
      this.props.dispatch(setModule('portfolios'))
    }
  }

  componentWillReceiveProps(nextProps) {
    // if no slug redirect to default portfolio
    if (! this.props.params.slug) {
      this.props.history.pushState(null, `/portfolio/${this.props.portfolio.default}/`)
    }
    if (this.props.params.slug != nextProps.params.slug) {
      this.fetchData(nextProps.params)
    }
  }

  goNext() {
    this.props.dispatch(nextPict(this.props.portfolio.pictures.length))
  }

  goPrev() {
    this.props.dispatch(prevPict(this.props.portfolio.pictures.length))
  }

  toggleSlideshow() {
    this.props.dispatch(toggleSlideshow())
  }

  render() { 
    /*
     * viewport.clientside is true only on client side.
     * server side rendering gives a classical horizontal scroll list
     * and client side only enable slide show if any js available.
     */
    let lightboxStarter = ''
    let carousel
    // show error message if portfolio has no pictures
    if (this.props.portfolio.n_pictures == 0) {
      carousel = (<div className="carousel-error"
        ><em>Sorry, no pictures in this portfolio yet…</em></div>)
    } else if (this.props.portfolio.selected.is_fetching ||
        this.props.portfolio.pictures.length == 0) {
    // show a spinner if datas are fetching
      carousel = (<Spinner message="Fetching…" />)
    } else if (this.props.portfolio.carousel.dynamic) { // we are client side
    // show a javascript driven carousel if client has javascript
      carousel = (<Carousel
        history={this.props.history}
        location={this.props.location}
        pictures={this.props.portfolio.pictures}
        carousel={this.props.portfolio.carousel}
        toggleSlideshow={this.toggleSlideshow.bind(this)}
        goNext={this.goNext.bind(this)}
        goPrev={this.goPrev.bind(this)}
      />)
      if (this.props.children) {
        lightboxStarter = React.cloneElement(this.props.children, {
          pictures: this.props.portfolio.selected.pictures,
          dispatch: this.props.dispatch,
        })
      }
    } else { // we are server side
    // show a full css carousel if client hasn't javascript or if serverside
      carousel = <CarouselInline pictures={this.props.portfolio.pictures} />
    }

    return (
        <section role="main">{carousel}{lightboxStarter}</section>
    )
  }
}

