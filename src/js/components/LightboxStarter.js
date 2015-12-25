import React, { Component, PropTypes } from 'react'
import {
  lightboxStart,
  lightboxStop,
  lightboxSetCurrent,
} from '../actions/lightbox'


// False component to launch lightbox actions
export default class LightboxStarter extends Component {

  startLightbox(pictures, current) {
    this.props.dispatch(lightboxStart(pictures, current))
  }

  componentWillMount() {
    this.startLightbox(
        this.props.pictures,
        this.props.params.lightbox
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pictures != nextProps.pictures) {
      this.startLightbox(
          nextProps.pictures,
          nextProps.params.lightbox
      )
    }
    if (this.props.params.lightbox != nextProps.params.lightbox) {
      this.props.dispatch(lightboxSetCurrent(nextProps.params.lightbox))
    }
  }

  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
  }
  
  render () {
    
    return (<div />)
  }
}
