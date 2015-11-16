import React, { Component } from 'react'
import { connect } from 'react-redux'

// actions
import { displayPortfolio } from '../actions/portfolios'
import { setViewport } from '../actions/viewport'

// components
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'



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
    console.log(this.props.viewport)
  }


  render() {
    // Injected by connect() call:
    const {
      dispatch,
      settings,
      modules,
      pictures,
      viewport,
      portfolios,
    } = this.props
    return (
      <div id={this.props.modules.currentModule}>
        <Header
          currentModule={this.props.modules.currentModule}
          setModule={''}
          logo={this.props.settings.weblog_logo}
          title={this.props.settings.title}
          subTitle={this.props.settings.subtitle}
          mainMenu={this.props.modules.mainMenu}
          subMenus={{portfolios: {
              list: this.props.portfolios.portfolios_list,
              onClick: (portfolio) => dispatch(displayPortfolio(portfolio)),
            }
          }}
        />
        <Portfolio />
        <Footer />
      </div>
    )
  }
}



function select(state) {
  return state
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)
