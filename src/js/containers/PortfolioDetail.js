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
    this.props.dispatch(nextPict(this.props.pictures.length))
  }

  goPrev() {
    this.props.dispatch(prevPict(this.props.pictures.length))
  }

  toggleSlideshow() {
    this.props.dispatch(toggleSlideshow())
  }

  getLightbox() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        dispatch: this.props.dispatch,
        pictures: this.props.picturesList,
      })
    }
    return null
  }

  getCarousel() {
    // show error message if portfolio has no pictures
    if (this.props.n_pictures == 0) {
      return (
        <div className="carousel-error">
          <em>Sorry, no pictures in this portfolio yet...</em>
        </div>
      )
    }
    // show a spinner if data's are fetching
    // or if first image isn't arrived yet
    if (this.props.is_fetching || this.props.pictures.length == 0) {
      return (<Spinner message="Fetching..." />)
    }
    // show a dynamic carousel if we are clientside and client has js
    if (this.props.carousel.dynamic) {
      return (
        <Carousel
          history={this.props.history}
          location={this.props.location}
          pictures={this.props.pictures}
          carousel={this.props.carousel}
          toggleSlideshow={this.toggleSlideshow.bind(this)}
          goNext={this.goNext.bind(this)}
          goPrev={this.goPrev.bind(this)}
        />
      )
    }
    // show a full css carousel if client hasn't javascript
    // or if we are server side
    return (<CarouselInline
        pictures={this.props.pictures}
        path={this.props.location.pathname}
    />)

  }

  render() { 
    /*
     * viewport.clientside is true only on client side.
     * server side rendering gives a classical horizontal scroll list
     * and client side only enable slide show if any js available.
     */
    const {
      dispatch,
      is_fetching,
      carousel,
      pictures,
      n_pictures,
      picturesList,
    } = this.props
    
    console.log('port detail', this.props)

    return (
        <section role="main">
          {this.getCarousel()}
          {this.getLightbox()}
        </section>
    )
  }
}


export default connect(portfolioDetailSelector)(PortfolioDetail)

