import React, { Component, PropTypes } from 'react'

import Spinner from './Spinner'


export default class Lightbox extends Component {
  
  constructor(props) {
    super(props)

    this.state = this.selectPicture()
  }

  setNext(index, length) {
    let next = index + 1
    return next < length - 1 ? next : 0
  }

  setPrev(index, length) {
    let prev = index - 1
    return prev >= 0 ? prev : length - 1
  }

  selectPicture() {
    let picts = this.props.pictures
    for (let i=0, l=picts.length; i < l; i++) {
      if (picts[i].sha1 == this.props.params.sha1) {
        return {
          current: i,
          next: this.setNext(i, l),
          prev: this.setPrev(i, l)
        }
      }
    }
  }


  handleBgClick(e) {
    this.props.history.pushState(null, this.props.location.pathname.split(
      '/lightbox/')[0] + '/')
  }


  render() {
    console.log(this.props)
    return (
      <div>
        <div id="lb-overlay" onClick={this.handleBgClick.bind(this)}></div>
        <section id="lightbox">
          <figure id="lb-new">
            <div className="lb-buttons-wrapper">
              <img src={} alt={} />
              <button id="lb-previous">Previous picture</button>
              <button id="lb-next">Next picture</button>
            </div>
            <figcaption>
              {}
              <p>Image {} of {this.props.pictures.length}</p>
            </figcaption>
          </figure>
        </section>
      </div>
    )
  }
}
