import React, { Component, PropTypes } from 'react'
import CarouselItem from './CarouselItem'


/*
 * Infinite carousel :
 *  - each image appears only once
 *  - appear disappear effect if first and last image are in viewport
 *  - infinite rotation effect if first and last image are out of viewport
 *  - react to window resize
 *  - height of picture must always be less than viewport height
 *
 * on start :
 *  Step 1 : set visibility hidden to all images
 *  Step 2 : compute width of each image when they and store it in state
 *  step 3 : position images with left css parameter
 *  Step 4 : set visibility visible to all images with transition
 *
 * on resize :
 *  Step 1 : store new image height
 *  Step 2 : if height is different than actual, run start steps
 *  Step 3 : else if viewport width is different than actual,
 *           compute difference and move all queue of it
 *
 * on next :
 *  Step 1 : make hidden first image with transition
 *  Step 2 : move first image to end of queue
 *  Step 3 : make new last image visible
 *  Step 4 : compute step width :
 *           (half of current image width + margin + half of next image width)
 *  Step 5 : move all queue backward of step width with transition
 *
 * on previous :
 *  Step 1 : make hidden last image with transition
 *  Step 2 : move last image to beginning of queue
 *  Step 3 : make new first image visible
 *  Step 4 : compute step width :
 *           (half of current image width + margin + half of previous image width)
 *  Step 5 : move all queue forward of step width with transition
 * 
 */


// default slideshow duration
var SLIDESHOW_DURATION = 3000

// margin between pictures
var PICT_MARGIN = 6

// constants
const NEXT = 'NEXT'
const PREV = 'PREV'
const LEFT_TRANSITION = 800
const SWIPED_TRANSITION = 800

export default class Carousel extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      prevs: this.getPrevs(),
      nexts: this.getNexts(),
      current: 0,
      slideshow: true,
      swiped: null,
      positions: this.props.pictures.map(() => 0),
      viewport_width: 0,
      picture_height: this.props.picture_height,
    }
    console.log(this.state)
  }
  getNexts(current=0) {
    let nexts = []
    let max_index = this.props.pictures.length - 1
    let n_nexts = Math.ceil((max_index) / 2)
    let index = current + 1
    for (let i=0; i < n_nexts; i++) {
      index = index > max_index ? 0 : index
      nexts.push(index)
      index ++
    }
    return nexts
  }


  getPrevs(current=0) {
    let prevs = []
    let max_index = this.props.pictures.length - 1
    let n_prevs = Math.floor((this.props.pictures.length - 1) / 2)
    let index = current - 1
    for (let i=0; i < n_prevs; i++) {
      index = index < 0 ? max_index : index
      prevs.unshift(index)
      index --
    }
    return prevs
  }

  getPictWidth(index) {
    return Math.round(
        this.props.pictures[index].ratio * this.state.picture_height)
  }

  setPositions() {
    let positions = Object.assign({}, this.state.positions)
    let c = this.state.current
    let c_width = this.getPictWidth(c)
    // get current position
    positions[c] = Math.round((this.state.viewport_width - c_width) / 2)
    // get prevs positions
    let cursor = positions[c]
    for (var i=this.state.prevs.length - 1; i >= 0; i--) {
      let index = this.state.prevs[i]
      positions[index] = cursor - PICT_MARGIN - this.getPictWidth(index)
      cursor = positions[index]
    }
    // get nexts positions
    cursor = positions[c] + c_width
    for (var i=0, l=this.state.nexts.length; i < l; i++) {
      let index = this.state.nexts[i]
      positions[index] = cursor + PICT_MARGIN
      cursor = positions[index] + this.getPictWidth(index)
    }
    this.setState({
      positions: positions
    }, () =>
      // we wait for transition effects
        setTimeout(() =>
          this.setState({
            swiped: null
          }), LEFT_TRANSITION))
  }
  
  componentDidMount() {
    // launch slideshow if necessary
    this.resetInterval()
    window.addEventListener('resize', this.handleResize.bind(this))
    this.handleResize()
    console.log(this.state)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setCurrent(index) {

    this.setState({
      current: index,
      nexts: this.getNexts(index),
      prevs: this.getPrevs(index)
    }, () =>  {this.resetInterval(), this.setPositions()})
    //console.log('setCurrent')
  }


  handleResize() {
    let max_height = document.documentElement.clientHeight - 20
    let viewport_width = Math.round(document.documentElement.clientWidth)
    let default_height = this.props.picture_height

    
    this.setState({
      picture_height: max_height < default_height ? max_height : default_height,
      viewport_width: viewport_width,
    }, this.setPositions)
    //console.log('handleResize', document.documentElement.clientHeight -20);
  }


  resetInterval() {
    clearInterval(this.interval);
    //console.log('resetInterval: ', 'clearinterval')
    if (this.state.slideshow) {
      // go to next picture each SLIDESHOW_DURATION
      this.interval = setInterval(this.goNext.bind(this), SLIDESHOW_DURATION)
    //console.log('resetInterval: ', 'setinterval')
    }
  }


  goNext() {
    let index = this.state.prevs[0]
    this.setState({
      swiped: index
    },() => 
      // we wait for last item to disappear
      setTimeout(() =>
        this.setCurrent(this.state.nexts[0]), SWIPED_TRANSITION
      )
    )
    //console.log('goNext')
  }

  goPrev() {
    // set first image invisible
    let index = this.state.nexts[this.state.nexts.length -1]
    this.setState({
      swiped: index
    },() => 
      // we wait for last item to disappear
      setTimeout(() =>
        this.setCurrent(this.state.prevs[this.state.prevs.length - 1]), SWIPED_TRANSITION
      )
    )
    //console.log('goPrev');
  }
  toogleSlideshow() {
    //console.log('toogleSlideshow before', this.state.slideshow)
    this.setState({
      slideshow: ! this.state.slideshow
    }, this.resetInterval)
  }

  onImageClick(index) {
    if (index == this.state.current) {
      this.toogleSlideshow()
    } else if (this.state.nexts.indexOf(index) != -1) {
      this.goNext()
    } else if (this.state.prevs.indexOf(index) != -1) {
      this.goPrev()
    } 
  }


  render() {

    return (
        <ul className="carousel" style={{height: this.state.picture_height + 'px'}}>

          {this.props.pictures.map((pict, index) =>
            <CarouselItem key={pict.previews_path}
              onClick={this.onImageClick.bind(this)}
              height={this.state.picture_height}
              width={this.getPictWidth(index)}
              current={this.state.current == index}
              index={index}
              position={this.state.positions[index]}
              swiped={this.state.swiped == index}

              {...pict} />
          )}
        </ul>
    )
  }
}


Carousel.PropTypes = {
  pictures: PropTypes.arrayOf(PropTypes.shape({
    previews_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
    ratio: PropTypes.number.isRequired
  }).isRequired).isRequired,
  picture_height: PropTypes.number.isRequired
}
