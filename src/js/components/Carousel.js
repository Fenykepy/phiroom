import React, { Component, PropTypes } from 'react'
import CarouselItem from './CarouselItem'

import { setLightboxLink } from '../helpers/urlParser'

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

class Carousel extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      swaping: null,
    }
  }

  resetState() {
    this.setState({
      swaping: null,
    })
  }

  getPictWidth(index) {
    return Math.round(
        this.props.pictures[index].ratio * this.props.carousel.height)
  }

  setPositions() {
    //console.log('set positions')
    let positions = []
    let width = this.props.carousel.width
    let current = this.props.carousel.current_picture
    let current_width = this.getPictWidth(current)
    // get current position
    positions[current] = Math.round((width - current_width) / 2)
    // get prevs positions
    let cursor = positions[current]
    for (var i=this.props.carousel.prevs.length - 1; i >= 0; i--) {
      let index = this.props.carousel.prevs[i]
      positions[index] = cursor - PICT_MARGIN - this.getPictWidth(index)
      cursor = positions[index]
    }
    // get nexts positions
    cursor = positions[current] + current_width
    for (var i=0, l=this.props.carousel.nexts.length; i < l; i++) {
      let index = this.props.carousel.nexts[i]
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
      this.stopInterval(this.interval);
    }
  }

  componentDidUpdate(prev_props, prev_state) {
    if (prev_props.carousel.slideshow != this.props.carousel.slideshow) {
      // start slideshow if necessary
      this.resetInterval()
    }
  }

  stopInterval(interval) {
    clearInterval(interval)
    interval = false;
  }

  resetInterval() {
    this.stopInterval(this.interval);
    if (this.props.carousel.slideshow) {
      this.interval = setInterval(this.goNext.bind(this), this.props.carousel.slideshowDuration)
    }
  }


  goNext() {
    let index = this.props.carousel.prevs[0]
    this.setState({
      swaping: index
    },() => 
      // we wait for last item to disappear
      setTimeout(() => {
        this.props.goNext()
        setTimeout(() => {
          this.resetState()
        }, LEFT_TRANSITION)
      }, SWIPED_TRANSITION
      )
    )
  }

  goPrev() {
    // set first image invisible
    let index = this.props.carousel.nexts[this.props.carousel.nexts.length -1]
    this.setState({
      swaping: index
    },() => 
      // we wait for last item to disappear
      setTimeout(() => {
        this.props.goPrev()
        setTimeout(() => {
          this.resetState()
        }, LEFT_TRANSITION)
      }, SWIPED_TRANSITION
      )
    )
  }

  toogleSlideshow() {
    this.props.toggleSlideshow()
  }

  onImageClick(index) {
    if (index == this.props.carousel.current_picture) {
      // reset interval to see picture good time
      this.toogleSlideshow()
    } else if (this.props.carousel.nexts.indexOf(index) != -1) {
      this.goNext()
      this.resetInterval()
    } else if (this.props.carousel.prevs.indexOf(index) != -1) {
      this.goPrev()
      // reset interval to see picture good time
      this.resetInterval()
    } 
  }

  onImageDoubleClick(pk) {
    this.context.router.push(setLightboxLink(
      this.props.location.pathname,
      pk
    ))
  }


  render() {
    let positions = this.setPositions()

    //console.log('carousel', this.props)

    return (
        <ul className="carousel" style={{height: this.props.carousel.height + 'px'}}>

          {this.props.pictures.map((pict, index) =>
            <CarouselItem key={pict.previews_path}
              onClick={this.onImageClick.bind(this)}
              onDoubleClick={this.onImageDoubleClick.bind(this)}
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

Carousel.contextTypes = {
  router: React.PropTypes.object.isRequired,
}


export default Carousel
