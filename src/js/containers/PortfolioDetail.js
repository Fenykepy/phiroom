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
import { fetchAuthorIfNeeded } from '../actions/authors'
import {
  setDocumentTitleIfNeeded,
  setDocumentAuthor,
  setDocumentDescription,
} from '../actions/common'
import { sendHit } from '../actions/hits'


class PortfolioDetail extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    if (! params.slug)  return promises
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchPortfolioIfNeeded(params.slug)).then(data => {
      if (data.error) {
        console.log(data)
      }
      dispatch(selectPortfolio(params.slug))
      // set document title
      // we test for presence of title
      // else if slug doesn't exists it fails.
      if (data.data && data.data.title) {
        dispatch(setDocumentTitleIfNeeded(data.data.title))
        let desc = `Phiroom's portfolio : ${data.data.title}.`
        dispatch(setDocumentDescription(desc))
      }
      // launch lightbox if needed
      if (params.lightbox && data.data) {
        dispatch(lightboxStart(data.data.pictures,
                params.lightbox))
      }
      // fetch portfolios pictures if needed
      if (clientSide) {
        data.data.pictures.map((item) => {
          dispatch(fetchShortPictureIfNeeded(item))
        })
      }
      return data.data
    }) .then(data => {
      // fetch author if necessary
      // we test for presence of author
      // else if slug doesn't exists it fails.
      if (data && data.author) {
        return dispatch(fetchAuthorIfNeeded(data.author)).then(data => {
          // set document author
          dispatch(setDocumentAuthor(data.data.author_name))
        })
      }
    }))
    if (! clientSide) {
      // fetch all pictures at once serverside
      promises.push(dispatch(fetchPortfolioPictures(params.slug)))
    }
    return promises
  }

  static sendHit(dispatch, params, ip=null) {
    // send a hit to server for this weblog post
    let data = {
      type: 'PORT',
      related_key: params.slug,
      ip: ip
    }

    dispatch(sendHit(data))
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
    this.constructor.sendHit(this.props.dispatch, params)
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
    //console.log(this.props)
    if (this.props.error) {
      console.log('error page')
      return (
        <ErrorPage
          status={this.props.error.response.status}
        />
      )
    }
    // show error message if portfolio has no pictures
    if (this.props.fetched && this.props.n_pictures == 0) {
      return (
        <div className="carousel-error">
          <em>Sorry, no pictures in this portfolio yet...</em>
        </div>
      )
    }
    // show a spinner if data's are fetching
    // or if all images aren't fetched yet (else there is lagging in carousel each
    // time a new picture is added
    if (this.props.is_fetching || this.props.pictures.length != this.props.n_pictures) {
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
      fetched,
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

