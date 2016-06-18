import React, { Component, PropTypes } from 'react'

export default class HitsCounter extends Component {
  render() {
    if (this.props.hits == null) return null
    let view = " views"
    if (this.props.hits <= 1) view = ' view'
    return (
      <div className="hits">{this.props.hits}{view}</div>
    )
  }
}
