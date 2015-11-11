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
      previous: this.renderPrevious(0),
      next: this.renderNext(0)
    }
  }
    
  componentDidMount() {
    // go to next picture each 4 seconds
    this.interval = setInterval(this.goNext.bind(this), slideshow_duration);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateState(index) {
    this.setState({
      current: index,
      previous: this.renderPrevious(index),
      next: this.renderNext(index)
    })
  }

  goNext() {
    // reset interval, else on user click timer continues
    clearInterval(this.interval);
    var next_index = this.state.current + 1
    if (next_index == this.props.pictures.length) {
      next_index = 0
    }
    this.updateState(next_index);
    this.interval = setInterval(this.goNext.bind(this), slideshow_duration);
  }

  goPrev() {
    clearInterval(this.interval);
    var prev_index
    if (this.state.current == 0) {
      prev_index = this.props.pictures.length - 1
    } else {
      prev_index = this.state.current - 1
    }
    this.updateState(prev_index);
    this.interval = setInterval(this.goNext.bind(this), slideshow_duration);
  }

  renderPrevious(index) {
    var previous = []
    var reversed_pictures = this.props.pictures.reverse()
    var last_index = this.props.pictures.length - 1
    for (var i=index + 1; i <= last_index; i++) {
      previous.push(reversed_pictures[i])
    }
    for (var i=0; i < index; i++) {
      previous.push(reversed_pictures[i])
    }
    return previous
  }

  renderNext(index) {
    var nexts = []
    var last_index = this.props.pictures.length - 1
    for (var i=index + 1; i <= last_index; i++) {
      nexts.push(this.props.pictures[i])
    }
    for (var i=0; i < index; i++) {
      nexts.push(this.props.pictures[i])
    }
    return nexts
  }

  render() {
    return (
        <ul className="carousel">
          {this.state.previous.map((item) =>
            <CarouselItem key={item.previews_path} onClick={this.goPrev.bind(this)} {...item} />
          )}
          <CarouselSelectedItem {...this.props.pictures[this.state.current]} />
          {this.state.next.map((item) =>
            <CarouselItem key={item.previews_path} onClick={this.goNext.bind(this)} {...item} />
          )}
        </ul>
    )
  }
}


CarouselItem.PropTypes = {
  pictures: PropTypes.arrayOf(PropTypes.shape({
    previews_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired).isRequired
}
