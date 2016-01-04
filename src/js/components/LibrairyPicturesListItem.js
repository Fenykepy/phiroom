import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItem extends Component {

  getImageStyle() {
    let max_height = this.props.columns_width;
    // if selected, we substract padding and borders
    if (this.props.selected) {
      max_height = max_height - 10
    }
    console.log(max_height)
    return { maxHeight: max_height + 'px' }
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
            onClick={() => this.props.handleClick(this.props.pk)}
          />
        </article>
      </div>
    )
  }
}
