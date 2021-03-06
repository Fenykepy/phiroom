import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { librairySelector } from '../selectors/librairySelector'

import { Link } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LibrairyLeftPanel from '../containers/LibrairyLeftPanel'

import { setModule } from '../actions/modules'
import { dragEnd, setContainer } from '../actions/librairy'
import { fetchPortfoliosHeadersIfNeeded } from '../actions/portfolios'
import { fetchPostsHeadersIfNeeded } from '../actions/weblog'
import { fetchCollectionsHeadersIfNeeded } from '../actions/collections'
import { setDocumentTitleIfNeeded } from '../actions/common'


class Librairy extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // fetch portfolios headers
    promises.push(dispatch(fetchPortfoliosHeadersIfNeeded()))
    // fetch posts headers if user is weblog_author
    promises.push(dispatch(fetchPostsHeadersIfNeeded()))
    // fetch collections headers
    promises.push(dispatch(fetchCollectionsHeadersIfNeeded()))
    // set module
    dispatch(setModule('librairy'))
    // set document title
    dispatch(setDocumentTitleIfNeeded('Librairy'))
    
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    // store bounded function in variable to be able to remove it
    this.bound_handleDragEnd = this.handleDragEnd.bind(this)
    // listen for dragEnd events
    document.addEventListener('dragend', this.bound_handleDragEnd)
    // store current pathname in state as default link to librairy
    this.handleContainerChange(this.props.location.pathname)
  }

  componentWillUnmount() {
    document.removeEventListener('dragend', this.bound_handleDragEnd)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      // store current pathname in state as default link to librairy
      this.handleContainerChange(nextProps.location.pathname)
    }
  }

  handleContainerChange(pathname) {
    // store current pathname in state as default link to librairy
    this.props.dispatch(setContainer(pathname))
  }

  handleDragEnd() {
    this.props.dispatch(dragEnd())
  }

  getChildren() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        dispatch: this.props.dispatch,
        title: this.props.title,
        user: this.props.user,
        drag: this.props.drag,
        pictures: this.props.pictures,
        selected_list: this.props.selected_list,
        n_selected: this.props.n_selected,
        n_pictures: this.props.n_pictures,
        n_columns: this.props.n_columns,
        columns_width: this.props.columns_width,
        left_panel_width: this.props.left_panel_width,
        right_panel_width: this.props.right_panel_width,
        fetching: this.props.fetching,
      })
    }
    return null
  }


  render() {
    // injected by connect call:
    const { 
      dispatch,
      title,
      user,
      drag,
      pictures,
      modules,
      settings,
      selected_list,
      n_selected,
      n_pictures,
      n_columns,
      columns_width,
      left_panel_width,
      right_panel_width,
      fetching,
    } = this.props
    //console.log('lib', this.props)
    return (
      <div>
        <Header
          id="librairy-header"
          modules={this.props.modules}
          settings={this.props.settings}
          user={this.props.user}
          logo={this.props.settings.librairy_logo}
        />
          <LibrairyLeftPanel
            user={this.props.user}
            drag={this.props.drag}
          />
        <section role="main">
          {this.getChildren()}
          <Footer
            user={this.props.user}
            location={this.props.location}
          />
        </section>
      </div>
    )
  }
}


export default connect(librairySelector)(Librairy)
