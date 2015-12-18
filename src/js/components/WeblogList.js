import React, { Component, PropTypes } from 'react'

// actions
import  {
  fetchWeblogPageIfNeeded,
  selectWeblogPage,
} from '../actions/weblog'
import { setModule } from '../actions/modules'

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

  fetchData() {
    this.constructor.fetchData(this.props.dispatch, this.props.params, true)
  }


  componentDidMount() {
    this.fetchData()
    // set module
    if (this.props.modules.current != 'weblog') {
      this.props.dispatch(setModule('weblog'))
    }
  }

  componentWillReceiveProps(nextProps) {
    let page = this.props.params.page || 1
    if (page != nextProps.params.page) {
      this.fetchData()
    }
  }



  render() {
    console.log('props', this.props)
    return (
        <section role="main">
          <nav id="pagination">
            <a ng-if="prev_page" id="prev" href="" ng-click="goToPage(prev_page)">« Recent posts</a>
            <a ng-if="next_page" id="next" href="" ng-click="goToPage(next_page)">Older posts »</a>
          </nav>
        </section>
    )
  }
}
