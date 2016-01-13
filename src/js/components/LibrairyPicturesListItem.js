import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'
import { listsHaveCommon } from '../helpers/utils'

import ContextualMenu from './ContextualMenu'
import LibrairyPicturesListItemMenu from './LibrairyPicturesListItemMenu'

export default class LibrairyPicturesListItem extends Component {

  constructor(props) {
    super(props)

    this.accepted_drop = [PICTURE]

    this.default_state = {
      baskets: false,
      padding_right: 0,
      padding_left: 10,
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
          deletePicture={this.props.deletePicture}
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

  getBaskets() {
    if (this.state.baskets) {
      return (
          <div>
            <div className="basket-left"
              onDragEnter={this.handleBasketLeftEnter.bind(this)}
              onDragLeave={this.handleBasketLeave.bind(this)}
              style={{
                width: this.props.columns_width + 'px',
                right: this.state.padding_right + this.props.columns_width / 2 + 'px'
              }}
            />
            <div className="basket-right"
              onDragEnter={this.handleBasketRightEnter.bind(this)}
              onDragLeave={this.handleBasketLeave.bind(this)}
              style={{
                width: this.props.columns_width + 'px',
                left: this.state.padding_left + this.props.columns_width / 2 + 'px'
              }}
            />
          </div>
      )
    }
    return null

  }

  handleClick(e) {
    e.stopPropagation() // to avoid unselectAll to trigger
    this.props.handleClick(this.props.index, e.ctrlKey, e.shiftKey)
  }

  handleWrapperClick(e) {
    // unselect all pictures
    this.props.unselectAll()
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

  handleWrapperDragEnter(e) {
    if (listsHaveCommon(e.dataTransfer.types, this.accepted_drop)) {
      e.preventDefault()
      this.setState({baskets: true})
    }
  }

  handleBasketLeftEnter(e) {
    e.preventDefault()
    this.setState({padding_left: 100 + 10})
  }

  handleBasketRightEnter(e) {
    e.preventDefault()
    this.setState({padding_right: 100})
  }

  handleBasketLeave(e) {
    e.preventDefault()
      this.setState({
        baskets: false,
        padding_right: 0,
        padding_left: 10,
      })
  }

  render() {
    return (
      <div className="thumb-wrapper"
        style={{
          height: this.props.columns_width + 'px',
          width: this.props.columns_width + 'px',
          lineHeight: this.props.columns_width + 'px',
          paddingRight: this.state.padding_right + 'px',
          paddingLeft: this.state.padding_left + 'px',
        }}
        onClick={this.handleWrapperClick.bind(this)}
        onDragEnter={this.handleWrapperDragEnter.bind(this)}
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
        {this.getBaskets()}
      </div>
    )
  }
}
