import React, { Component, PropTypes } from 'react'

import LibrairyPicturesList from './LibrairyPicturesList'


export default class LibrairyAll extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // fetch all full pictures
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  render() {
    //console.log(this.props)
    return (
          <LibrairyPicturesList pictures={null}/>
    )
  }
}
