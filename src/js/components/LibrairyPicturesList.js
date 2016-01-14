import React, { Component, PropTypes } from 'react'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'

import { PICTURE } from '../constants/dragTypes'

import { listsHaveCommon } from '../helpers/utils'

import {
  selectPicture,
  unselectPicture,
  unselectAll,
  unsetPicture,
  dragStart,
} from '../actions/librairy'
import {
  deletePicture,
} from '../actions/pictures'

export default class LibrairyPicturesList extends Component {

  constructor(props) {
    super(props)

      this.accepted_drop = [PICTURE]

  }

  dropValid(types) {
    return listsHaveCommon(types, this.accepted_drop)
  }

  deletePicture(picture) {
    let to_delete = [picture]
    // picture is selected, delete all selection
    if (this.props.selected_list.indexOf(picture) > -1) {
      to_delete = this.props.selected_list
    }
    // delete all picts in array
    to_delete.map(item => {
      this.props.dispatch(unsetPicture(item))
      this.props.dispatch(deletePicture(item))
    })
  }

  handleClick(picture, ctrlKey, shiftKey) {
    let pict = this.props.pictures[picture]
    // if ctrl key was pressed, toggle picture selection
    if (ctrlKey) {
      if (pict.selected) {
        return this.props.dispatch(unselectPicture(pict.pk))
      }
      return this.props.dispatch(selectPicture(pict.pk))
    }
    // if shiftkey was pressed and at least one picture is selected
    if (shiftKey && this.props.n_selected) {
      // get first selected picture index
      let i=0, l=this.props.pictures.length
      for (i; i < l; i++) {
        if (this.props.pictures[i].selected) break
      }
      let start_index, end_index
      if (i < picture) {
        start_index = i
        end_index = picture + 1
      }
      if (i > picture) {
        start_index = picture
        end_index = i + 1
      }
      // if we didn't click on selected picture
      if (i != picture) {
        this.props.dispatch(unselectAll())
        for (let i=start_index; i < end_index; i++) {
          this.props.dispatch(selectPicture(
                this.props.pictures[i].pk
          ))
        }
        return
      }
    }
    // if shift key was pressed, select all pictures between selected and clicked
    // unselect all and select picture
    this.props.dispatch(unselectAll())
    return this.props.dispatch(selectPicture(pict.pk))
  }
  
  unselectAll() {
    return this.props.dispatch(unselectAll())
  }

  handleDrag(e, picture, selected) {
    e.dataTransfer.setData(PICTURE, picture)
    e.dropEffect = "copy"
    let data
    if (selected) {
      data = this.props.selected_list
    } else {
      data = [picture]
    }
    this.props.dispatch(dragStart(PICTURE, data))
  }

  handleDrop(basket_index) {
    /*
     * we reorder pks in array here for it to be common to
     * all pictures list, then send results to parent function
     * which dispatchs with good container
     */
    //console.log(this.props)
    let statics_before = []
    let statics_after = []
    let moved = []
    this.props.pictures.map((item, index) => {
      if (this.props.drag.data.indexOf(item.pk) > -1) {
        // picture will be moved, push it to moved ones
        moved.push(item.pk)
      } else {
        // picture won't be moved, add it to statics ones
        if (index < basket_index) {
          statics_before.push(item.pk)
        } else {
          statics_after.push(item.pk)
        }
      }
    })
    this.props.reorderPictures([...statics_before, ...moved, ...statics_after])
  }

  handleBackgroundDrop(e) {
    console.log('bg drop')
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.handleDrop(this.props.pictures.length)
    }
  }

  handleBackgroundDragOver(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
    }
  }

  render() {
    //console.log('picturesList', this.props)
    return (
      <section id="librairy-list"
        onClick={this.unselectAll.bind(this)}
        onDrop={this.handleBackgroundDrop.bind(this)}
        onDragOver={this.handleBackgroundDragOver.bind(this)}
      >
        {this.props.pictures.map((pict, index) =>
          <LibrairyPicturesListItem
            key={pict.pk}
            index={index}
            handleClick={this.handleClick.bind(this)}
            handleDrag={this.handleDrag.bind(this)}
            handleDrop={this.handleDrop.bind(this)}
            dropValid={this.dropValid.bind(this)}
            columns_width={this.props.columns_width}
            container={this.props.container}
            removePicture={this.props.removePicture}
            deletePicture={this.deletePicture.bind(this)}
            unselectAll={this.unselectAll.bind(this)}
            {...pict}
          />
        )}
      </section>
    )
  }
}
