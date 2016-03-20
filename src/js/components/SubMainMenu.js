import React, { Component, PropTypes } from 'react'
import SubMainMenuItem from './SubMainMenuItem'


export default class SubMainMenu extends Component {
  render () {
    return (
      <div className="sub-main-menu-wrapper">
        <ul className="sub-main-menu">
          {this.props.subMenu.map((item, index) =>
              <SubMainMenuItem
                url={this.props.url}
                key={item.slug}
                module={this.props.module}
                index={index}
                {...item}
              />
          )}
        </ul>
      </div>
    )
  }
}

