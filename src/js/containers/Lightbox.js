import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { lightboxSelector } from '../selectors/lightboxSelector'

import {
  lightboxStop,
  lightboxNavTo,
  lightboxToogleSlideshow,
  lightboxTooglePictInfo,
  lightboxCurrentLoaded,
  lightboxNextLoaded,
  lightboxPreviousLoaded,
} from '../actions/lightbox'

import { Link } from 'react-router'

import LightboxFigure from '../components/LightboxFigure'

class Lightbox extends Component {

  componentWillMount() {
    // listen for keyboard events
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    // listen for keyboard events
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  componentDidMount() {
    this.loadImages()
  }

  componentWillReceiveProps(nextProps) {
    // we went to next picture, invalidate next
    if (this.props.current === nextProps.previous) {
      this.props.dispatch(lightboxNextLoaded(false))
    }
    // we went to previous picture, invalidate previous
    if (this.props.current === nextProps.next) {
      this.props.dispatch(lightboxPreviousLoaded(false))
    }
    // stop lightbox if it's not activated anymore
    if (! nextProps.activated && this.props.activated) {
      this.props.dispatch(lightboxStop())
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.current != this.props.current) {
      this.loadImages()
    }
  }

  loadImages() {
    // load current image file first
    //console.log('load images')
    this.loadImage(
      this.props.current,
      this.props.currentLoaded,
      lightboxCurrentLoaded)
      .then(() => {
        //console.log('current loaded, load next')
        this.loadImage( // then load next image file
          this.props.next,
          this.props.nextLoaded,
          lightboxNextLoaded)
          .then(() => { // load previous image file last
            //console.log('next loaded, load prev')
            this.loadImage(
              this.props.previous,
              this.props.previousLoaded,
              lightboxPreviousLoaded)
          })
      })
  }


  loadImage(image, loaded, action) {
    //console.log('loaded', loaded)
    let base_src = '/media/images/previews/large/'
    // if image is already loaded, return resolved promise
    if (loaded) {
      //console.log('is_loaded')
      return new Promise((resolve, reject) => resolve())
    }
    // if we don't have image data we return a rejected promise
    if (! image) {
      //console.log('no image')
      return new Promise((resolve, reject) => reject())
    }
    // if we have image datas
    if (image) {
      let img = new Image()
      let promise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
      })
      img.src = base_src + image.previews_path
      return promise.then((image) => {
        this.props.dispatch(action(true))
        return image
      })
    }
  }
  
  getBasePath() {
    let path = this.props.location.pathname.split('/lightbox/')[0]
    if (path.slice(-1) == '/') {
      path = path.slice(0, -1)
    }
    return path
  }

  getClosePath() {
    return this.getBasePath() + '/'
  }

  getPreviousPath() {
    if (this.props.previous) {
      return this.getBasePath() +
        '/lightbox/' + this.props.previous.sha1 + '/'
    }
    return ""
  }

  getNextPath() {
    if (this.props.next) {
      return this.getBasePath() +
        '/lightbox/' + this.props.next.sha1 + '/'
    }
    return "" 
  }

  handleKeyPress(e) {
    const SPACE = 32
    const BACKSPACE = 8
    const ESCAPE = 27
    const LEFT_ARROW = 37
    const RIGHT_ARROW = 39
    let reset = false
    
    // move to next pict
    if (e.which == SPACE || e.which == RIGHT_ARROW) {
      this.context.router.push(this.getNextPath())
      reset = true
    }
    // move to prev pict
    if (e.which == BACKSPACE || e.which == LEFT_ARROW) {
      this.context.router.push(this.getPreviousPath())
      reset = true
    }
    // close lightbox
    if (e.which == ESCAPE) {
      reset = true
    }
    // prevent bubbling if necessary
    if (reset) {
      e.preventDefault()
      e.stopPropagation()
    }
    //console.log('key pressed', e.which)
  }

  render() {
    // injected by connect call:
    const {
      clientSide,
      current,
      currentIndex,
      currentLoaded,
      next,
      nextLoaded,
      previous,
      previousLoaded,
      pictures,
      length,
      activated,
      slideshow,
      showInfo,
    } = this.props

    console.log('lb', this.props)
    if (! this.props.activated || ! this.props.current) {
      return (<div />)
    }
    return (
        <div>
          <div id="lb-overlay"></div>
          <section id="lightbox">
            <Link id="lb-close" to={this.getClosePath()}></Link>
            <LightboxFigure
              id="stage-1"
              image={this.props.current}
              loaded={this.props.currentLoaded}
              previous_path={this.getPreviousPath()}
              next_path={this.getNextPath()}
              number={this.props.currentIndex + 1}
              length={this.props.pictures.length}
              clientSide={this.props.clientSide}
            />
            {/*<LightboxFigure
              id="stage-2"
              image={this.props.next}
              loaded={this.props.nextLoaded}
              previous_path={this.getPreviousPath()}
              next_path={this.getNextPath()}
              number={this.props.currentIndex + 1}
              length={this.props.pictures.length}
              />*/}
          </section>
        </div>
      )
  }
}

Lightbox.contextTypes = {
  router: React.PropTypes.object.isRequired,
}


// Wrap the component to inject dispatch and state into it
export default connect(lightboxSelector)(Lightbox)
