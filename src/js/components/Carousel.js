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


// constants
const LEFT_TRANSITION = 300
const SWIPED_TRANSITION = 300
const PICT_MARGIN = 6

export default class Carousel extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      swaping: null,
      viewport_width: 0,
    }
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
        this.props.pictures[index].ratio * this.props.carousel.height)
  }

  setPositions() {
    let positions = []
    let prevs = this.props.carousel.prevs
    let nexts = this.props.carousel.nexts
    let width = this.props.carousel.width
    let current = this.props.carousel.current_picture
    let current_width = this.getPictWidth(current)
    // get current position
    positions[current] = Math.round((width - current_width) / 2)
    // get prevs positions
    let cursor = positions[current]
    for (var i=prevs.length - 1; i >= 0; i--) {
      let index = prevs[i]
      positions[index] = cursor - PICT_MARGIN - this.getPictWidth(index)
      cursor = positions[index]
    }
    // get nexts positions
    cursor = positions[current] + current_width
    for (var i=0, l=nexts.length; i < l; i++) {
      let index = nexts[i]
      positions[index] = cursor + PICT_MARGIN
      cursor = positions[index] + this.getPictWidth(index)
    }
    
    return positions
  }
  
  componentDidMount() {
    // launch slideshow if necessary
    this.resetInterval()
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  resetInterval() {
    clearInterval(this.interval);
    if (this.props.carousel.slideshow) {
      this.interval = setInterval(this.goNext.bind(this), this.props.carousel.slideshowDuration)
    }
  }


  goNext() {
    let index = this.state.prevs[0]
    this.setState({
      swaping: index
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
      swaping: index
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
    console.log('carousel', this.props)

    let positions = this.setPositions()
    return (
        <ul className="carousel" style={{height: this.props.carousel.height + 'px'}}>

          {this.props.pictures.map((pict, index) =>
            <CarouselItem key={pict.previews_path}
              onClick={this.onImageClick.bind(this)}
              height={this.props.carousel.height}
              width={this.getPictWidth(index)}
              current={this.props.carousel.current_picture == index}
              index={index}
              position={positions[index]}
              swaping={this.state.swaping == index}

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
