import React, { Component, PropTypes } from 'react'

import CarouselItem from './CarouselItem'

// - we get previous and next images in arrays
// - we store them in a "to_load" state array by loading order:
//    - first, 1 before, 2 after and so on
// - we start loading current image, 2 after and 1 before
// - we show spinner
// - On current image load :
//      - we get it's dimensions and store it in state
//      - we compute it's position and store it to state
//      - we add it to "loaded" state array
//      - we hide spinner
//      - we start slideshow
// - On other images load :
//      - we get it's dimensions and store it in state
//      - we compute it's position and the position of all next/prev already loaded
//      - we add it to "loaded" state array



// constants
const SWAP_TRANSITION = 300
const PICT_MARGIN = 6
const IMAGE_BASE_SRC = '/media/images/previews/height-600/'

const DEFAULT_STATE = {
  slideshow: false, // boolean, slideshow running or not
  current: 0, // index of current picture
  toload: [], // pictures idexes in loading order
  loaded: [], // loaded pictures objects
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
      // reset to first picture and compute positions
      this.setState(DEFAULT_STATE, this.initPictures)
      this.resetInterval()
    }
    if (prev_props.height != this.props.height) {
      // we compute pictures position
      this.setPositions()
    }
  }
  
  componentDidUpdate(prev_props, prev_state) {
    // start slideshow if necessary
    if (prev_state.slideshow != this.state.slideshow) {
      this.resetInterval()
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


  loadImage() {
    let toload = this.state.toload.slice()
    if (toload.length == 0) return
    let index = toload.shift()
    this.setState({toload: toload})
    let img = new Image()
    img.onload = () => this.handleImageLoad(index, img)
    img.src = IMAGE_BASE_SRC + this.props.pictures[index].previews_path
  }


  handleImageLoad(index, img) {
    // we load next image
    this.loadImage()
    // we add pictures to loaded
    let loaded = this.state.loaded.slice()
    loaded[index] = this.props.pictures[index]

    this.setPositions(0, loaded)
  }


  getPictureWidth(index) {
    return this.props.pictures[index].ratio * this.props.height
  }


  setPositions(current=0, loaded) {
    let positions = []
    // get carousel width and set current position
    let width = this.refs.carousel.offsetWidth
    positions[current] = Math.round((width - this.getPictureWidth(0)) / 2)

    let nexts = this.getNexts(current, loaded)
    let prevs = this.getPrevs(current, loaded)

    // get prevs positions
    let cursor = positions[current]
    for (var i=prevs.length - 1; i >= 0; i--) {
      let index = prevs[i]
      positions[index] = Math.round(cursor - PICT_MARGIN - this.getPictureWidth(index))
      cursor = positions[index]
    }

    // get nexts positions
    cursor = positions[current] + this.getPictureWidth(current)
    for (var i=0, l=nexts.length; i < l; i++) {
      let index = nexts[i]
      positions[index] = cursor + PICT_MARGIN
      cursor = positions[index] + this.getPictureWidth(index)
    }
    this.setState({
      positions: positions,
      loaded: loaded,
    })
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


  getLoadingOrder() {
    let indexes = this.props.pictures.map((item, index) => index)
    let toload = []
    
    function load2nexts1prev() {
      if (indexes.length > 0) toload.push(indexes.shift())
      if (indexes.length > 0) toload.push(indexes.shift())
      if (indexes.length > 0) toload.push(indexes.pop())

      if (indexes.length > 0) {
        load2nexts1prev()
      }
    }
    load2nexts1prev()

    return toload
  }


  initPictures() {
    this.setState({
      toload: this.getLoadingOrder()
    }, this.loadImage)
  }


  stopInterval(interval) {
    clearInterval(interval)
    interval = false;
  }


  resetInterval() {
    this.stopInterval(this.interval);
    if (this.state.slideshow) {
      this.interval = setInterval(this.goNext.bind(this), this.props.slideshowDuration)
    }
  }


  toggleSlideshow() {
    this.setState({slideshow: ! this.state.slideshow})
  }


  stopSlideshow() {
    this.setState({slideshow: false})
  }


  goNext() {
    let current = this.state.current
    let next = this.getNexts(current, this.state.loaded)[0]
    let step = - (this.getPictureWidth(current) / 2 + PICT_MARGIN + this.getPictureWidth(next) / 2)

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
        nexts: this.getNexts(next, this.state.loaded),
        prevs: this.getPrevs(next, this.state.loaded),
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
        nexts: this.getNexts(prev, this.state.loaded),
        prevs: this.getPrevs(prev, this.state.loaded),
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
          style={{height: this.props.height + 'px'}}>
          {this.state.loaded.map((pict, index) =>
            <CarouselItem
              ref={index}
              key={pict.sha1+index}
              pathname={this.props.pathname}
              current={this.state.current == index}
              swaping={this.state.swaping == index}
              onClick={() => this.onImageClick(index)}
              toggleSlideshow={this.toggleSlideshow.bind(this)}
              stopSlideshow={this.stopSlideshow.bind(this)}
              slideshow={this.state.slideshow}
              height={this.props.height}
              left={this.state.positions[index] || 0}
              translate={this.state.translate}
              previews_path={pict.previews_path}
              title={pict.title}
              sha1={pict.sha1}
            />
          )}
        </ul>
    )
  }
}

Carousel.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      previews_path: PropTypes.string.isRequired,
      sha1: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  slideshowDuration: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
}
