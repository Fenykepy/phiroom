import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setViewport } from '../actions/viewport'
import { verifyToken } from '../actions/user'

import { getCookie } from '../helpers/cookieManager'

// containers
import Lightbox from '../containers/Lightbox'

// components
import Header from '../components/Header'
import Footer from '../components/Footer'

import { appSelector } from '../selectors/appSelector'




class App extends Component {

  componentDidMount() {
    // Injected by connect() call:
    const {
      dispatch,
    } = this.props
    // try to authenticate user
    let token = getCookie('auth_token')
    if (token) {
      // verify if token is valid
      dispatch(verifyToken(token))

    }
    // keep track of viewport size
    window.addEventListener('resize', this.handleResize.bind(this))
    // set initial viewport size
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
      settings,
      modules,
      user,
      modal,
    } = this.props
    
    console.log('app',this.props)
    return (
      <div id={this.props.modules.current}>
        {this.getLightbox()}
        <Header
          modules={this.props.modules}
          settings={this.props.settings}
          user={this.props.user}
        />
        {this.props.children}
        <Footer
          user={this.props.user}
        />
        {this.props.modal}
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(appSelector)(App)
