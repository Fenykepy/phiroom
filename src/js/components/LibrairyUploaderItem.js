import React, { Component, Proptypes } from 'react'


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

  render() {
    return (
      <div
        className="thumb-wrapper"
        title={'filename: ' + this.props.file.name + '\n'
          + 'weight: ' + this.props.file.size}
      >
        <article>
          <button
            className="close"
            title="Don't upload this picture"
            onClick={this.props.removeFile}
          >×</button>
          <img
            src={this.state.src}
          />
        </article>
      </div>
    )
  }
}
