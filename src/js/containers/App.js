import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'


class App extends Component {
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
          logo={this.props.settings.weblog_logo}
          title={this.props.settings.title}
          subTitle={this.props.settings.subtitle}
          mainMenu={[
            {name: 'portfolios', url: '/portfolio', title: 'Portfolios', subMenu: [
              {slug: 'portraits', title: 'Portraits', pk: 1},
              {slug: 'macro', title: 'Quelque part en France', pk: 2},
              {slug: 'paysages', title: 'Un monde miniature', pk: 3},
            ]},
            {name: 'contact', url: '/contact', title: 'Contact'},
          ]}
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
