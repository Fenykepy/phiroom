import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setViewport } from '../actions/viewport'

// components
import Header from '../components/Header'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'

import { mainSelector } from '../selectors/mainSelector'



class App extends Component {

  componentDidMount() {
    // Injected by connect() call:
    const {
      dispatch,
    } = this.props
    
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

  render() {

    // Injected by connect() call:
    const {
      dispatch,
      settings,
      modules,
      portfolio,
      viewport,
      routing,
      lightbox,
    } = this.props
    
    // we show lightbox only if we have a "lightbox" url param
    let lb = (<Lightbox {...this.props.lightbox}
              dispatch={this.props.dispatch}
              location={this.props.location}
              clientSide={this.props.viewport.clientSide}
    />)
   

    return (
      <div id={this.props.modules.current}>
        {this.props.params.lightbox ? lb : ''}
        <Header
          modules={this.props.modules}
          settings={this.props.settings}
        />
        {React.cloneElement(this.props.children, this.props)}
        <Footer />
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(mainSelector)(App)
