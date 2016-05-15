import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyLeftPanelLibrairy extends Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true,
    }
  }

  handleClick() {
    this.setState({show: ! this.state.show})
  }



  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6><span
            onClick={this.handleClick.bind(this)}
          >Librairy</span></h6>
          <ul
            style={{display: this.state.show ? "block" : "none"}}
          >
            <li><Link
              to="/librairy/all/"
              activeClassName="selected"
            >All pictures</Link></li>
            {/*<li><Link>Quick collection</Link></li>
            <li><Link>Last importation</Link></li>*/}
          </ul>
        </div>
      )
    }
    return null
  }
}

