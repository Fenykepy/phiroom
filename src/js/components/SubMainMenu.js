import React, { Component, PropTypes } from 'react'
import SubMainMenuItem from './SubMainMenuItem'


export default class SubMainMenu extends Component {
  render () {
    return (
        <ul className="sub-main-menu">
          {this.props.subMenu.list.map((item) =>
              <SubMainMenuItem
                key={item.slug}
                onClick={this.props.subMenu.onClick}
                {...item}
              />
          )}
        </ul>
    )
  }
}

