import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import { displayPortfolio } from '../actions/portfolios'
import { setViewport } from '../actions/viewport'

// components
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

import { mainSelector } from '../selectors/mainSelector'



class App extends Component {

  componentDidMount() {
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

  setModule(module) {
    return
  }


  render() {
    // Injected by connect() call:
    const {
      dispatch,
      settings,
      modules,
      portfolio,
      viewport,
    } = this.props

    console.log('props', this.props)

    return (
      <div id={this.props.modules.current}>
        <Header
          modules={this.props.modules}
          setModule={this.setModule}
          settings={this.props.settings}
        />
        <Portfolio
          {...this.props.portfolio}
        />
        <Footer />
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(mainSelector)(App)
