import React, { Component, PropTypes } from 'react'

export default class TabsBar extends Component {
  
  /*
   * Tabulation bar allowing to navigate through components
   * Properties:
   *  tabs: [
   *    {title: my tab title, component: associated component},
   *    {title: my tab title2, component: associated component2},
   *    {title: my tab title3, component: associated component3},
   *  ]
   */


  constructor(props) {
    super(props)

    this.state = {
      current: 0
    }
  }

  render() {

    return (
      <div>
        <div className="tabs-bar">
          {this.props.tabs.map((tab, index) =>
            <button
              key={index}
              type="button"
              className={index == this.state.current ? "active" : ""}
              onClick={() => this.setState({current: index})}
            >{tab.title}</button>
          )}
        </div>
        {this.props.tabs[this.state.current].component}
      </div>
    )
  }
}
