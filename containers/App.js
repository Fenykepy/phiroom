import React, { Component } from 'react';
import Header from '../components/Header';



export default class App extends Component {
  render(){
    return (
      <div>
        <Header
          logo={'/media/images/default/inline_default_logo.png'}
          title={'Phiroom'}
          subTitle={'Le cms des photographes…'}
        />
        </div>
    )
  }
}
