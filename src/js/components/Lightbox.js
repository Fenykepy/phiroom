import React, { Component, PropTypes } from 'react'

import Spinner from './Spinner'


export default class Lightbox extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      current: null,
      next: null,
      prev: null
    }
  }

  componentDidMount() {
    this.setState(this.selectPicture(this.props))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.sha1 != nextProps.params.sha1 ||
        this.props.pictures != nextProps.pictures) {
      this.setState(this.selectPicture(nextProps))
    }
  }

  setNext(index, length) {
    let next = index + 1
    return next < length - 1 ? next : 0
  }

  setPrev(index, length) {
    let prev = index - 1
    return prev >= 0 ? prev : length - 1
  }

  selectPicture(props) {
    if (! props.pictures.length || ! props.params.sha1) return {}
    console.log('props',props)
    let picts = props.pictures
    for (let i=0, l=picts.length; i < l; i++) {
      if (picts[i].sha1 == props.params.sha1) {
        return {
          current: i,
          next: this.setNext(i, l),
          prev: this.setPrev(i, l)
        }
      }
    }
    return {}
  }


  handleBgClick(e) {
    this.props.history.pushState(null, this.props.location.pathname.split(
      '/lightbox/')[0] + '/')
  }


  render() {
    let current = this.props.pictures[this.state.current]
    let child
    if (this.state.current) {
      child = (
        <div>
          <div id="lb-overlay" onClick={this.handleBgClick.bind(this)}></div>
          <section id="lightbox">
            <figure id="lb-new">
              <div className="lb-buttons-wrapper">
                <img src={'/media/images/previews/large/' + current.previews_path} alt={current.title} />
                <button id="lb-previous">Previous picture</button>
                <button id="lb-next">Next picture</button>
              </div>
              <figcaption>
                {current.title}
                <p>Image {this.state.index + 1} of {this.props.pictures.length}</p>
              </figcaption>
            </figure>
          </section>
        </div>
      )
    } else child = (<div />)

    return child
  }
}
