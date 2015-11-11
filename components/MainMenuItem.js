import React, { Component, PropTypes } from 'react';



export default class MainMenuItem extends Component {
  render(){
    return (
      <li><a href={this.props.url}
             className={this.props.name == this.props.currentModule ? 'selected' : ''}
          >{this.props.title}</a></li>
    )
  }
}



MainMenuItem.PropTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentModule: PropTypes.string.isRequired,
}
