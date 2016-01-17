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
        className="file-preview"
        title={'filename: ' + this.props.file.name + '1&#013;'
          + 'weight: ' + this.props.file.size}
      >
      <img
        src={this.state.src}
      />
      </div>
    )
  }
}
