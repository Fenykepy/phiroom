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
    if (this.props.carousel.dynamic) { // we are client side
      carousel = (<Carousel
        pictures={this.props.pictures}
        carousel={this.props.carousel}
        toggleSlideshow={this.props.toggleSlideshow}
        goNext={this.props.goNext}
        goPrev={this.props.goPrev}
      />)
    } else { // we are server side
      carousel = <CarouselInline pictures={this.props.pictures} />
    }
    
    return (
        <section role="main">{carousel}</section>
    )
  }
}

