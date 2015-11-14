import React, { Component } from 'react'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Footer from '../components/Footer'

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
