import React, { Component, PropTypes } from 'react'

// actions
import  {
  fetchWeblogPageIfNeeded,
  selectWeblogPage,
} from '../actions/weblog'
import { setModule } from '../actions/modules'

import WeblogPagination from './WeblogPagination'
import Spinner from './Spinner'

export default class WeblogList extends Component {
  
  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    let page = params.page || 1
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchWeblogPageIfNeeded(page)).then((data) => {
      dispatch(selectWeblogPage(page))
    }))
    return promises
  }

  fetchData(params) {
    console.log('props', this.props)
    this.constructor.fetchData(this.props.dispatch, params, true)
  }


  componentDidMount() {
    this.fetchData(this.props.params)
    // set module
    if (this.props.modules.current != 'weblog') {
      this.props.dispatch(setModule('weblog'))
    }
  }

  componentWillReceiveProps(nextProps) {
    let page = this.props.params.page || 1
    if (page != nextProps.params.page) {
      console.log('fetchpage')
      this.fetchData(nextProps.params)
    }
  }


  render() {
    console.log('weblog', this.props.weblog)
    let child
    // show spinner if no selected page or if page is fetching
    if (! this.props.weblog.selectedPage ||
        this.props.weblog.selectedPage.is_fetching) {
      child = (<Spinner message="Fetching…" />)
    } else {
      child =(
          <WeblogPagination
            next={this.props.weblog.selectedPage.next}
            previous={this.props.weblog.selectedPage.previous}
            page={parseInt(this.props.params.page) || 1} />
      )
    }
    return (
        <section role="main">{child}</section>
    )
  }
}
