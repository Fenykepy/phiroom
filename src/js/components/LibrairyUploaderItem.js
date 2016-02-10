import React, { Component, Proptypes } from 'react'

import formatFileSize from '../helpers/utils'


export default class LibrairyUploaderItem extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      src: null
    }
  }

  componentDidMount() {
    let reader = new FileReader()
    reader.onload = (e) => {
      this.setState({src: reader.result})
    }
    reader.readAsDataURL(this.props.file)
  }

  remove() {
    console.log('index',this.props.index)
    this.props.remove(this.props.index)
  }

  render() {
    return (
      <div
        className="thumb-wrapper"
        title={'filename: ' + this.props.file.name + '\n'
          + 'weight: ' + formatFileSize(this.props.file.size)}
      >
        <article>
          <button
            className="overlay"
            title="Don't upload this picture"
            onClick={this.remove.bind(this)}
          >×</button>
          <img
            src={this.state.src}
          />
        </article>
      </div>
    )
  }
}
