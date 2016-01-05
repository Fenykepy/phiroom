import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItem extends Component {

  getImageStyle() {
    let max_height = this.props.columns_width;
    // if selected, we substract padding and borders
    if (this.props.selected) {
      max_height = max_height - 10
    }
    return { maxHeight: max_height + 'px' }
  }

  handleClick(e) {
    this.props.handleClick(this.props.index, e.ctrlKey, e.shiftKey)
  }

  render() {
    return (
      <div className="thumb-wrapper"
        style={{
          height: this.props.columns_width + 'px',
          width: this.props.columns_width + 'px',
          lineHeight: this.props.columns_width + 'px'
        }}
      >
        <article className={this.props.selected ? 'selected' : null}>
          <img
            style={this.getImageStyle()}
            src={'/media/images/previews/max-500/' + this.props.previews_path}
            onClick={this.handleClick.bind(this)}
          />
        </article>
      </div>
    )
  }
}
