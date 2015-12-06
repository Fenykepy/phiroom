import React, { Component, PropTypes } from 'react'

import Carousel from './Carousel'
import CarouselInline from './CarouselInline'


// actions
import {
  fetchPortfolioIfNeeded,
  fetchPortfolioPictures,
  selectPortfolio,
  nextPict,
  prevPict,
  toggleSlideshow
} from '../actions/portfolios'


export default class Portfolio extends Component {

  static fetchData(dispatch, portfolio, clientSide=false) {
    let promises = []
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(portfolio)).then((data) => {
        dispatch(selectPortfolio(portfolio))
        // fetch portfolios pictures if needed
        if (clientSide) {
          data.data.pictures.map((item) => {
            //dispatch(fetchShortPictureIfNeeded(item))
          })
        }
    }))
    if ( clientSide) {
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPortfolioPictures(portfolio)))
    }
    return promises
  }

  componentDidMount() {
    console.log('props', this.props)
    this.constructor.fetchData(this.props.dispatch, this.props.params.slug, true)
  }

  componentWillReceiveProps(nextProps) {
    console.log('props', this.props)
    if (this.props.params.slug != nextProps.params.slug) {
      this.constructor.fetchData(this.props.dispatch, nextProps.params.slug, true)
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

    let carousel
    if (this.props.portfolio.pictures.length == 0) {
        carousel = (<div className="carousel-error"
        ><em>Sorry, no pictures in this portfolio yet…</em></div>)
    } else if (this.props.portfolio.carousel.dynamic) { // we are client side
      carousel = (<Carousel
        pictures={this.props.portfolio.pictures}
        carousel={this.props.portfolio.carousel}
        toggleSlideshow={this.toggleSlideshow.bind(this)}
        goNext={this.goNext.bind(this)}
        goPrev={this.goPrev.bind(this)}
      />)
    } else { // we are server side
      carousel = <CarouselInline pictures={this.props.portfolio.pictures} />
    }
    


    return (
        <section role="main">{carousel}</section>
    )
  }
}

