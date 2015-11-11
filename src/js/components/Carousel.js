import React, { Component, PropTypes } from 'react'
import CarouselItem from './CarouselItem'
import CarouselSelectedItem from './CarouselSelectedItem'


// default slideshow duration
var slideshow_duration = 3000

export default class Carousel extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      current: 0,
      slideshow: true,
    }
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

  updateCurrent(index) {
    this.setState({
      current: index,
    }, this.resetInterval)
    console.log('updateCurrent')
  }

  resetInterval() {
    clearInterval(this.interval);
    console.log('resetInterval: ', 'clearinterval')
    if (this.state.slideshow) {
      // go to next picture each 4 seconds
      this.interval = setInterval(this.goNext.bind(this), slideshow_duration);
    console.log('resetInterval: ', 'setinterval')
    }
  }


  goNext() {
    var next_index = this.state.current + 1
    if (next_index == this.props.pictures.length) {
      next_index = 0
    }
    this.updateCurrent(next_index)
    console.log('goNext');
  }

  goPrev() {
    var prev_index
    if (this.state.current == 0) {
      prev_index = this.props.pictures.length - 1
    } else {
      prev_index = this.state.current - 1
    }
    this.updateCurrent(prev_index)
    console.log('goPrev');
  }

  toogleSlideshow() {
    console.log('toogleSlideshow before', this.state.slideshow)
    this.setState({
      slideshow: ! this.state.slideshow
    }, this.resetInterval)
  }


  renderOthers(index) {
    var nexts = []
    var last_index = this.props.pictures.length - 1
    for (var i=index + 1; i <= last_index; i++) {
      nexts.push(this.props.pictures[i])
    }
    for (var i=0; i < index; i++) {
      nexts.push(this.props.pictures[i])
    }
    console.log('renderNext', nexts);
    return nexts
  }

  render() {

    let others = this.renderOthers(this.state.current)
    
    return (
        <ul className="carousel">

          {others.map((item) =>
            <CarouselItem key={item.previews_path} onClick={this.goPrev.bind(this)} {...item} />
          )}
          <CarouselSelectedItem {...this.props.pictures[this.state.current]} onClick={this.toogleSlideshow.bind(this)}/>
          {others.map((item) =>
            <CarouselItem key={item.previews_path} onClick={this.goNext.bind(this)} {...item} />
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
  }).isRequired).isRequired
}
