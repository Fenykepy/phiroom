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
    console.log(this.props)
    
    return (
        <section role="main">{this.props.viewport.clientSide ? <Carousel pictures={this.props.pictures} picture_height={picture_height} /> : <CarouselInline pictures={this.props.pictures} />}
        </section>
    )
  }
}

