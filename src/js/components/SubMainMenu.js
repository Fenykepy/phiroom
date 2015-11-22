import React, { Component, PropTypes } from 'react'
import SubMainMenuItem from './SubMainMenuItem'


export default class SubMainMenu extends Component {
  render () {
    return (
        <ul className="sub-main-menu">
          {this.props.subMenu.map((item, index) =>
              <SubMainMenuItem
                key={item.slug}
                navigateTo={this.props.navigateTo}
                module={this.props.module}
                index={index}
                {...item}
              />
          )}
        </ul>
    )
  }
}

