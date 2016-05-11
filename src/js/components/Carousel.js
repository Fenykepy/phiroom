import React, { Component, PropTypes } from 'react'

import CarouselItem from './CarouselItem'

import { setLightboxLink } from '../helpers/urlParser'


// constants
const SWAP_TRANSITION = 300
const PICT_MARGIN = 6

const DEFAULT_STATE = {
  slideshow: false, // boolean, slideshow running or not
  current: 0, // index of current picture
  widths: [], // widths of pictures
  prevs: [], // pictures indexes displayed before current
  nexts: [], // pictures indexes displayed after current
  positions: [], // left css property of pictures
  translate: 0, // default translateX
  swaping: null, // index of tail pictures moving to other side of rubber
}

export default class Carousel extends Component {

  constructor(props) {
    super(props)

    this.state = DEFAULT_STATE
  }

  componentDidMount() {
    // launch slideshow if necessary
    this.resetInterval()
    this.initPictures()
  }

  componentWillUpdate(prev_props, prev_state) {
    if (prev_props.pictures != this.props.pictures) {
      this.setState(DEFAULT_STATE, this.initPictures)
    }
  }
  
  componentDidUpdate(prev_props, prev_state) {
    // start slideshow if necessary
    if (prev_state.slideshow != this.state.slideshow) {
      this.resetInterval()
    }
    if (prev_props.pictures != this.props.pictures) {
      this.initPictures()
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      this.stopInterval(this.interval);
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  getPictWidth(index) {
    if (this.refs[index]) {
      return this.refs[index].getWidth()
    }
    return 0
  }

  getWidths(pictures) {
    let widths = pictures.map((picture, index) => {
        return this.getPictWidth(index)
    })

    return widths
  }
  
  getNexts(current, pictures) {
    let nexts = []
    let max_index = pictures.length - 1
    let n_nexts = Math.ceil(max_index / 2)
    let index = current + 1
    for (let i=0; i < n_nexts; i++) {
      index = index > max_index ? 0 : index
      nexts.push(index)
      index ++
    }

    return nexts
  }

  getPrevs(current, pictures) {
    let prevs = []
    let max_index = pictures.length - 1
    let n_prevs = Math.floor(max_index / 2)
    let index = current - 1
    for (let i=0; i < n_prevs; i++) {
      index = index < 0 ? max_index : index
      prevs.unshift(index)
      index --
    }

    return prevs
  }

  initPictures() {
    //console.log(this.props.carousel.height)
    let current = this.state.current
    let positions = []
    let widths = this.getWidths(this.props.pictures) 
    // get carousel width and set current position
    let width = this.refs.carousel.offsetWidth
    positions[current] = Math.round((width - widths[current]) / 2)
    
    // get prevs positions
    let cursor = positions[current]
    let prevs = this.getPrevs(current, this.props.pictures)
    for (var i=prevs.length - 1; i >= 0; i--) {
      let index = prevs[i]
      positions[index] = cursor - PICT_MARGIN - widths[index]
      cursor = positions[index]
    }

    // get nexts positions
    cursor = positions[current] + widths[current]
    let nexts = this.getNexts(current, this.props.pictures)
    for (var i=0, l=nexts.length; i < l; i++) {
      let index = nexts[i]
      positions[index] = cursor + PICT_MARGIN
      cursor = positions[index] + widths[index]
    }

    this.setState({
      widths: widths,
      nexts: nexts,
      prevs: prevs,
      positions: positions,
      current: current,
      swapping: null,
      translate: 0,
    })
    
  }

  stopInterval(interval) {
    clearInterval(interval)
    interval = false;
  }

  resetInterval() {
    this.stopInterval(this.interval);
    if (this.state.slideshow) {
      this.interval = setInterval(this.goNext.bind(this), this.props.carousel.slideshowDuration)
    }
  }

  toggleSlideshow() {
    this.setState({slideshow: ! this.state.slideshow})
  }

  goNext() {
    let widths = this.state.widths
    let current = this.state.current
    let next = this.state.nexts[0]
    let step = - (widths[current] / 2 + PICT_MARGIN + widths[next] / 2)

    // swape first picture to end
    let last = this.state.nexts[this.state.nexts.length - 1]
    let first = this.state.prevs[0]
    if (this.props.pictures.length == 2) first = current
    let positions = this.state.positions.slice()
    positions[first] = positions[last] + widths[last] + PICT_MARGIN
    
    // make first image disappear
    this.setState({swaping: first})
    this.timeout = setTimeout(() => 
      this.setState({
        current: next,
        nexts: this.getNexts(next, this.props.pictures),
        prevs: this.getPrevs(next, this.props.pictures),
        translate: this.state.translate + step,
        positions: positions,
        swaping: null,
    }), SWAP_TRANSITION)
  }

  goPrev() {
    let widths = this.state.widths
    let current = this.state.current
    let prev = this.state.prevs[this.state.prevs.length - 1]
    let step = widths[current] / 2 + PICT_MARGIN + widths[prev] / 2

    // swape last picture to beginning
    let last = this.state.nexts[this.state.nexts.length - 1]
    let first = this.state.prevs[0]
    let positions = this.state.positions.slice()
    positions[last] = positions[first] - widths[last] - PICT_MARGIN
    
    // make last image disapper
    this.setState({swaping: last})
    this.timeout = setTimeout(() =>
      this.setState({
        current: prev,
        nexts: this.getNexts(prev, this.props.pictures),
        prevs: this.getPrevs(prev, this.props.pictures),
        translate: this.state.translate + step,
        positions: positions,
        swaping: null,
    }), SWAP_TRANSITION)
  }

  onImageClick(index) {
    if (this.state.nexts.indexOf(index) != -1) {
      // go next
      this.goNext()
    }
    if (this.state.prevs.indexOf(index) != -1) {
      // go prev
      this.goPrev()
    }
    // reset interval to see picture good time
    this.resetInterval()
  }

  render() {
    //console.log('carousel', this.props)
    return (
      <ul ref="carousel"
          className="carousel"
          style={{height: this.props.carousel.height + 'px'}}>
          {this.props.pictures.map((pict, index) =>
            <CarouselItem
              height={this.props.carousel.height}
              width={this.state.widths[index]}
              ref={index}
              key={pict.sha1}
              current={this.state.current == index}
              swaping={this.state.swaping == index}
              onLoad={this.initPictures.bind(this)}
              onClick={() => this.onImageClick(index)}
              toggleSlideshow={this.toggleSlideshow.bind(this)}
              slideshow={this.state.slideshow}
              lightboxLink={setLightboxLink(this.props.location.pathname,
                pict.sha1)}
              left={this.state.positions[index] || 0}
              translate={this.state.translate}
              {...pict} />
          )}
        </ul>
    )
  }
}
