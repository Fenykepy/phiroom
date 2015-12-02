import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import {
  fetchPortfoliosHeadersIfNeeded,
} from '../actions/portfolios'

import { setViewport } from '../actions/viewport'

// components
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

import { mainSelector } from '../selectors/mainSelector'



class App extends Component {

  componentDidMount() {
    // Injected by connect() call:
    const {
      dispatch,
    } = this.props
    // fetch portfolios headers if necessary
    dispatch(fetchPortfoliosHeadersIfNeeded())
    
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
    } = this.props
    
   

    return (
      <div id={this.props.modules.current}>
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
