import React, { Component } from 'react'
import { connect } from 'react-redux'

// components
import Header from '../components/Header'
import Footer from '../components/Footer'

import { headersSelector } from '../selectors/headersSelector'


class WeblogWrapper extends Component {

  render() {
    // injected by connect call:
    const {
      dispatch,
      settings,
      modules,
      user
    } = this.props

    // console.log('weblog wrapper', this.props)
    return (
      <div>
        <Header
          modules={this.props.modules}
          settings={this.props.settings}
          user={this.props.user}
          logo={this.props.settings.weblog_logo}
        />
        {this.props.children}
        <Footer
          user={this.props.user}
          location={this.props.location}
        />
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(headersSelector)(WeblogWrapper)
