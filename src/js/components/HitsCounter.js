import React, { Component, PropTypes } from 'react'

export default class HitsCounter extends Component {
  render() {
    let hits = this.props.hits
    let view = " views"
    if (hits && hits <= 1) view = ' view'
    if (! hits) hits = "..."
      
      return (
      <div className="hits">{hits}{view}</div>
    )
  }
}
