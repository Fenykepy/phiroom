import React, { Component } from 'react'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'

var currentModule='portfolios'
          /*logo={'/media/images/default/inline_default_logo.png'}*/

export default class App extends Component {
  render() {
    return (
      <div id={currentModule}>
        <Header
          currentModule={currentModule}
          logo={'/media/images/default/default_logo.png'}
          title={'Phiroom'}
          subTitle={'Le cms des photographes…'}
          mainMenu={[
            {name: 'portfolios', url: '/portfolio', title: 'Portfolios'},
            {name: 'contact', url: '/contact', title: 'Contact'},
          ]}
        />
        <Portfolio />

        </div>
    )
  }
}
