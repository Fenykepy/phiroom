import React, { Component, PropTypes } from 'react'

// actions
import  {
  fetchWeblogPageByTagIfNeeded,
  selectWeblogPageByTag,
} from '../actions/weblog'

import WeblogPagination from './WeblogPagination'
import WeblogAbstract from './WeblogAbstract'
import Spinner from './Spinner'

export default class WeblogList extends Component {
  
  static fetchData(dispatch, params, clientSide=false) {
    let promises = []
    let page = params.page || 1
    // use static to be able to call it server side before component is rendered
    promises.push(dispatch(fetchWeblogPageByTagIfNeeded(params.tag, page)).then((data) => {
      dispatch(selectWeblogPageByTag(params.tag, page))
    }))
    
    return promises
  }

  fetchData(params) {
    this.constructor.fetchData(this.props.dispatch, params, true)
  }


  componentDidMount() {
    this.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    let page = this.props.params.page || 1
    let nextPage = nextProps.params.page || 1
    if (page != nextPage ||
        this.props.params.tag != nextProps.params.tag) {
      console.log('fetch webloglistbytag')
      this.fetchData(nextProps.params)
    }
  }


  render() {
    let child
    // show spinner if no selected page or if page is fetching
    if (! this.props.weblog.selectedPageByTag ||
        this.props.weblog.selectedPageByTag.is_fetching) {
      child = (<Spinner message="Fetching…" />)
    } else {
      child =(
        <div>
          {this.props.weblog.selectedPageByTag.results.map((item) => 
              <WeblogAbstract
                key={item.slug}
                {...item}
              />
          )}
          <WeblogPagination
            next={this.props.weblog.selectedPageByTag.next}
            previous={this.props.weblog.selectedPageByTag.previous}
            page={parseInt(this.props.params.page) || 1} />
        </div>
      )
    }
    return (
        <section role="main">{child}</section>
    )
  }
}
