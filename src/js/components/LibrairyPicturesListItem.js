import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import LibrairyPicturesListItemMenu from './LibrairyPicturesListItemMenu'

export default class LibrairyPicturesListItem extends Component {

  constructor(props) {
    super(props)

    this.default_state = {
      baskets: false,
      padding_right: 0,
      padding_left: 10,
      menu: false,
      max_height: 0,
    }

    this.state = this.default_state
  }

  componentDidMount() {
    this.setImageHeight()
  }

  setImageHeight() {
    if (this.refs.content) {
      // we get parent (.content) width - 10 of padding
      let max_height = this.refs.content.offsetWidth - 10
      // if selected, we substract padding and borders
      if (this.props.selected) {
        max_height = max_height - 10
      }
      this.setState({max_height: max_height})
    }
  }

  getMenu() {
    if (this.state.menu) {
      return (
          <LibrairyPicturesListItemMenu
            removePicture={this.props.removePicture}
            deletePicture={this.props.deletePicture}
            container={this.props.container}
            sha1={this.props.sha1}
            index={this.props.index}
            previews_path={this.props.previews_path}
            source_file={this.props.source_file}
            close={this.closeMenu.bind(this)}
          />
      )
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
              onDragOver={this.handleBasketOver.bind(this)}
              onDrop={this.handleBasketLeftDrop.bind(this)}
            />
            <div className="basket-right"
              onDragEnter={this.handleBasketRightEnter.bind(this)}
              onDragLeave={this.handleBasketLeave.bind(this)}
              onDragOver={this.handleBasketOver.bind(this)}
              onDrop={this.handleBasketRightDrop.bind(this)}
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

  toggleMenu(e) {
    e.preventDefault()
    e.stopPropagation()
    // toggle menu
    this.setState({menu: ! this.state.menu})
  }

  closeMenu() {
    this.setState({menu: false})
  }

  handleDrag(e) {
    //e.preventDefault()
    this.props.handleDrag(e, this.props.sha1)
  }

  handleWrapperDragEnter(e) {
    if (this.props.dropValid(e.dataTransfer.types)) {
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

  handleBasketOver(e) {
    if (this.props.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    }
  }

  handleBasketRightDrop(e) {
    if (this.props.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      e.stopPropagation() // to avoid section drop to trigger
      this.props.handleDrop(this.props.index + 1)
      // reset margins
      this.handleBasketLeave(e)
    }
  }

  handleBasketLeftDrop(e) {
    if (this.props.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      e.stopPropagation() // to avoid section drop to trigger
      this.props.handleDrop(this.props.index)
      // reset margins
      this.handleBasketLeave(e)
    }
  }

  render() {
    return (
      <div className="thumb-wrapper"
        style={{
<<<<<<< HEAD
          height: this.props.columns_width + 'px',
          width: this.props.columns_width + 'px',
          lineHeight: this.props.columns_width + 'px',
=======
          width: '20%',
        }}
        onClick={this.handleWrapperClick.bind(this)}
        onDragEnter={this.handleWrapperDragEnter.bind(this)}
      >
      <div className="content"
        ref="content"
        style={{
>>>>>>> cae4842c65855afc8e18049cffc7492f3d3a39d1
          paddingRight: this.state.padding_right + 'px',
          paddingLeft: this.state.padding_left + 'px',
        }}
        onClick={this.handleWrapperClick.bind(this)}
        onDragEnter={this.handleWrapperDragEnter.bind(this)}
      >
        <article className={this.props.selected ? 'selected' : null}>
          <button
            className="overlay tr"
            title="Open menu"
            onClick={this.toggleMenu.bind(this)}
          >&#8226; &#8226; &#8226;</button>
          <button
            className="overlay br zoom"
            title="Open in single view"
          ><Link
              to={`${this.props.pathname}single/${this.props.sha1}/`}
          ><span className="accessibility">Single view</span></Link></button>
          <img
            style={{ maxHeight: this.state.max_height + 'px' }}
            src={'/media/images/previews/max-500/' + this.props.previews_path}
            draggable="true"
            onClick={this.handleClick.bind(this)}
            onDragStart={this.handleDrag.bind(this)}
          />
          {this.getMenu()}
        </article>
        {this.getBaskets()}
      </div>
    )
  }
}

LibrairyPicturesListItem.propTypes = {
  columns_width: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  container: PropTypes.string.isRequired,
  sha1: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  previews_path: PropTypes.string.isRequired,
  source_file: PropTypes.string.isRequired,
  removePicture: PropTypes.func, // optional: not available in all pictures list
  deletePicture: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  handleDrag: PropTypes.func.isRequired,
  dropValid: PropTypes.func.isRequired,
  unselectAll: PropTypes.func.isRequired,
}

