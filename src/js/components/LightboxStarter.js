import React, { Component, PropTypes } from 'react'
import {
  lightboxStart,
  lightboxStop,
  lightboxSetCurrent,
} from '../actions/lightbox'
import { sendHit } from '../actions/hits'



// False component to launch lightbox actions
export default class LightboxStarter extends Component {
 
  static sendHit(dispatch, params, ip=null) {
    // send a hit to server for this weblog post
    let data = {
      type: 'PICT',
      related_key: params.lightbox,
      ip: ip
    }

    dispatch(sendHit(data))
  }

  startLightbox(pictures, current) {
    this.props.dispatch(lightboxStart(pictures, current))
  }

  componentWillMount() {
    //console.log('lb starter', this.props.pictures)
    this.startLightbox(
        this.props.pictures,
        this.props.params.lightbox
    )
    this.constructor.sendHit(this.props.dispatch, this.props.params)
  }

  componentDidMount() {
    // scroll to to
    window.scrollTo(0, 0)

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pictures != nextProps.pictures) {
      this.startLightbox(
          nextProps.pictures,
          nextProps.params.lightbox
      )
    }
    if (this.props.params.lightbox != nextProps.params.lightbox) {
      this.constructor.sendHit(this.props.dispatch, nextProps.params)
      this.props.dispatch(lightboxSetCurrent(nextProps.params.lightbox))
    }
  }

  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
  }
  
  render () {
    return null
  }
}
