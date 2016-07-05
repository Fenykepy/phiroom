import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setViewport } from '../actions/viewport'

// containers
import Lightbox from '../containers/Lightbox'

// components
import Footer from '../components/Footer'

import { appSelector } from '../selectors/appSelector'




class App extends Component {

  componentDidMount() {
    // Injected by connect() call:
    const {
      dispatch,
    } = this.props
    // store bounded function in variable to be able to remove it
    this.bound_handleResize = this.handleResize.bind(this)
    // keep track of viewport size
    window.addEventListener('resize', this.bound_handleResize)
    // set initial viewport size
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bound_handleResize)
  }


  handleResize() {
    // set viewport size
    this.props.dispatch(setViewport({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }))
  }

  getLightbox() {
    // we show lightbox only if we have a "lightbox" url param
    if (this.props.params.lightbox) {
      return (<Lightbox location={this.props.location} />)
    }
    return null
  }

  render() {

    // Injected by connect() call:
    const {
      dispatch,
      modules,
      modal,
    } = this.props
    
    //console.log('app',this.props)
    return (
      <div id={this.props.modules.current}>
        {this.getLightbox()}
        {this.props.children}
        {this.props.modal}
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(appSelector)(App)
