import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { portfolioDetailSelector } from '../selectors/portfolioDetailSelector'

import Carousel from '../components/Carousel'
import CarouselInline from '../components/CarouselInline'
import Spinner from '../components/Spinner'
import ErrorPage from '../components/ErrorPage'


// actions
import {
  fetchPortfolioIfNeeded,
  fetchPortfolioPictures,
  selectPortfolio,
} from '../actions/portfolios'
import { lightboxStart } from '../actions/lightbox'
import { fetchShortPictureIfNeeded } from '../actions/pictures'
import { setDocumentTitleIfNeeded } from '../actions/title'


class PortfolioDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug)  return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then((data) => {
        dispatch(selectPortfolio(params.slug))
        // set document title
        dispatch(setDocumentTitleIfNeeded(data.data.title))
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
    // show error page if error
    if (this.props.error) {
      return (
        <ErrorPage
          status={this.props.error.response.status}
        />
      )
    }
    // show error message if portfolio has no pictures
    if (! this.props.is_fetching && this.props.n_pictures == 0) {
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
          pathname={this.props.location.pathname}
          pictures={this.props.pictures}
          slideshowDuration={this.props.carousel.slideshowDuration}
          height={this.props.carousel.height}
        />
      )
    }
    // show a full css carousel if client hasn't javascript
    // or if we are server side
    return (<CarouselInline
        pictures={this.props.pictures}
        pathname={this.props.location.pathname}
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
      title,
      n_pictures,
      picturesList,
    } = this.props
    
    //console.log('port detail', this.props)

    return (
        <section role="main">
          <h1 className="accessibility">{this.props.title}</h1>
          {this.getCarousel()}
          {this.getLightbox()}
        </section>
    )
  }
}

PortfolioDetail.propTypes = {
  title: PropTypes.string,
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      previews_path: PropTypes.string.isRequired,
      sha1: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  carousel: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}



export default connect(portfolioDetailSelector)(PortfolioDetail)

