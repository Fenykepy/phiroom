import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { portfolioDetailSelector } from '../selectors/portfolioDetailSelector'

import Carousel from '../components/Carousel'
import CarouselInline from '../components/CarouselInline'
import Spinner from '../components/Spinner'


// actions
import {
  fetchPortfolioIfNeeded,
  fetchPortfolioPictures,
  selectPortfolio,
  nextPict,
  prevPict,
  toggleSlideshow
} from '../actions/portfolios'
import { lightboxStart } from '../actions/lightbox'
import { fetchShortPictureIfNeeded } from '../actions/pictures'


class PortfolioDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug)  return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then((data) => {
        dispatch(selectPortfolio(params.slug))
        // launch lightbox if needed
        if (params.lightbox) {
          dispatch(lightboxStart(data.data.pictures,
                  params.lightbox))
        }
        // fetch portfolios pictures if needed
        if (clientSide) {
          data.data.pictures.map((item) => {
            dispatch(fetchShortPictureIfNeeded(item))
          })
        }
    }))
    if (! clientSide) {
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
  }

  componentWillReceiveProps(nextProps) {
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
    //console.log('port detail', this.props)
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
          clientSide: this.props.viewport.clientSide,
          dispatch: this.props.dispatch,

        })
      }
    } else { // we are server side
    // show a full css carousel if client hasn't javascript or if serverside
      carousel = <CarouselInline
        pictures={this.props.portfolio.pictures}
        path={this.props.location.pathname}
      />
    }

    return (
        <section role="main">{carousel}{lightboxStarter}</section>
    )
  }
}


export default connect(portfolioDetailSelector)(PortfolioDetail)

