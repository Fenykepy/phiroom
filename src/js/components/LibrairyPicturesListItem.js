import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'

import ContextualMenu from './ContextualMenu'
import LibrairyPicturesListItemMenu from './LibrairyPicturesListItemMenu'

export default class LibrairyPicturesListItem extends Component {

  constructor(props) {
    super(props)

    this.default_state = {
      contextual_menu: false,
      X: null,
      Y: null
    }

    this.state = this.default_state
  }

  closeContextualMenu() {
    this.setState(this.default_state)
  }

  getImageStyle() {
    let max_height = this.props.columns_width;
    // if selected, we substract padding and borders
    if (this.props.selected) {
      max_height = max_height - 10
    }
    return { maxHeight: max_height + 'px' }
  }

  getContextualMenu() {
    if (this.state.contextual_menu) {
      return (<ContextualMenu
          child={(<LibrairyPicturesListItemMenu />)}
          close={this.closeContextualMenu.bind(this)}
          removePicture={this.props.removePicture}
          container={this.props.container}
          X={this.state.X}
          Y={this.state.Y}
          pk={this.props.pk}
          previews_path={this.props.previews_path}
          source_file={this.props.source_file}
      />)
    }
    return null
  }

  handleClick(e) {
    this.props.handleClick(this.props.index, e.ctrlKey, e.shiftKey)
  }

  handleRightClick(e) {
    e.preventDefault()
    // show context menu
    this.setState({
      contextual_menu: true,
      X: e.clientX,
      Y: e.clientY
    })
  }

  handleDrag(e) {
    //e.preventDefault()
    e.dataTransfer.setData(PICTURE, this.props.pk)
    e.dropEffect = "copy"
    this.props.handleDrag(this.props.pk, this.props.selected)
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
            draggable="true"
            onClick={this.handleClick.bind(this)}
            onDragStart={this.handleDrag.bind(this)}
            onContextMenu={this.handleRightClick.bind(this)}
          />
        </article>
        {this.getContextualMenu()}
      </div>
    )
  }
}
