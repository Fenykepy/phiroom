import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { weblogListSelector } from '../selectors/weblogListSelector'

// actions
import  {
  fetchWeblogPageIfNeeded,
  selectWeblogPage,
  fetchHits,
} from '../actions/weblog'

import WeblogPagination from '../components/WeblogPagination'
import WeblogPostAbstract from '../components/WeblogPostAbstract'
import Spinner from '../components/Spinner'
import ErrorPage from '../components/ErrorPage'

class WeblogList extends Component {
  
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
    this.constructor.fetchData(this.props.dispatch, params, true)
  }


  componentDidMount() {
    this.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    let page = this.props.params.page || 1
    let nextPage = nextProps.params.page || 1
    if (page != nextPage) {
      this.fetchData(nextProps.params)
    }
  }

  fetchHits(slug) {
    return this.props.dispatch(fetchHits(slug))
  }

  getPage() {
    let selected = this.props.selectedPage
    // show spinner if no selected page or if page is fetching
    if (! selected || selected.is_fetching) {
      return (<Spinner message="Fetching..." />)
    }
    // show error page if error
    if (selected.error) {
      return (
        <ErrorPage
          status={this.props.error.response.status}
        />
      )
    }
    // show error message if no posts found
    if (! selected.count) {
      return (
        <article>
          <p className="centered">
            Sorry, no published posts yet...
          </p>
        </article>
      )
    }

    return (
      <div>
        {selected.results.map(post =>
          <WeblogPostAbstract
            key={post.slug}
            user={this.props.user}
            hits={this.props.hits[post.slug]}
            fetchHits={this.fetchHits.bind(this)}
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
    // injected. by connect() call:
    const {
      dispatch,
      selectedPage,
      user,
      hits,
    } = this.props
    //console.log('weblog list', this.props)

    return (
        <section role="main">
          {this.getPage()}
        </section>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(weblogListSelector)(WeblogList)
