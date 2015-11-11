import React, { Component, PropTypes } from 'react'

import Carousel from './Carousel'
import CarouselInline from './CarouselInline'

var pictures = [
  {
    "previews_path": "63/cf/63cfd11dda6c8b592e47a16c5eb917aacfd2513d.jpg",
    "title": "photo 1",
    "legend": "légende de la photo 1"
  },
  {
    "previews_path": "d5/96/d596e0624dac49dd772c6bb606b18f764d2a547a.jpg",
    "title": "photo 1",
    "legend": "légende de la photo 1"
  },
  {
    "previews_path": "20/1f/201f8799a001882c7233924f5c9535a6d9b1bb68.jpg",
    "title": "photo 1",
    "legend": "légende de la photo 1"
  },
]

export default class Portfolio extends Component {


  constructor(props) {
    super(props)
    
    this.state = {
      clientside: false
    }
  }


  componentDidMount() {
    /*
     * set clientside = true here because it fires only client side.
     * like this, server side rendering gives a classical horizontal scroll list
     * and client side only enable slide show if any js available.
     */
    this.setState({
      //clientside: false
      clientside: true
    })
  }


  render() {
    
    return (
        <div>{this.state.clientside ? <Carousel pictures={pictures} /> : <CarouselInline pictures={pictures} />}</div>
    )
  }
}

