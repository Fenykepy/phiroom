import React, { Component, PropTypes } from 'react'

import Carousel from './Carousel'
import CarouselInline from './CarouselInline'


export default class Portfolio extends Component {

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
        toggleSlideshow={this.props.toggleSlideshow}
        goNext={this.props.goNext}
        goPrev={this.props.goPrev}
      />)
    } else { // we are server side
      carousel = <CarouselInline pictures={this.props.portfolio.pictures} />
    }
    
    return (
        <section role="main">{carousel}</section>
    )
  }
}

