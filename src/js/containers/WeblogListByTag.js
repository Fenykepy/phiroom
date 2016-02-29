import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { weblogListByTagSelector } from '../selectors/weblogListByTagSelector'

// actions
import  {
  fetchWeblogPageByTagIfNeeded,
  selectWeblogPageByTag,
} from '../actions/weblog'

import WeblogPagination from '../components/WeblogPagination'
import WeblogPostAbstract from '../components/WeblogPostAbstract'
import Spinner from '../components/Spinner'

class WeblogListByTag extends Component {
  
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

  getPage() {
    let selected = this.props.selectedPageByTag
    // show spinner if no selected page or if page is fetching
    if (! selected || selected.is_fetching) {
      return (<Spinner message="Fetching..." />)
    }
    return (
      <div>
        {selected.results.map(post =>
          <WeblogPostAbstract
            key={post.slug}
            {...post}
          />
        )}
        <WeblogPagination
          next={selected.next}
          previous={selected.previous}
          page={parseInt(this.props.params.page) || 1}
        />
      </div>
    )
  }


  render() {
    // injected by connect() call:
    const {
      dispatch,
      selectedPageByTag,
    } = this.props
    
    return (
        <section role="main">
          {this.getPage()}
        </section>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(weblogListByTagSelector)(WeblogListByTag)
