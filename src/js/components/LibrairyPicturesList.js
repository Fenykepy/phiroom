import React, { Component, PropTypes } from 'react'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'
import { PICTURE } from '../constants/dragTypes'
import {
  selectPicture,
  unselectPicture,
  unselectAll,
  unsetPicture,
  dragStart,
  dragEnd,
} from '../actions/librairy'
import {
  deletePicture,
} from '../actions/pictures'

export default class LibrairyPicturesList extends Component {

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

  handleDrag(picture, selected) {
    let data
    if (selected) {
      data = this.props.selected_list
    } else {
      data = [picture]
    }
    this.props.dispatch(dragStart(PICTURE, data))
  }

  render() {
    //console.log('picturesList', this.props)
    return (
      <section id="librairy-list"
        onClick={this.unselectAll.bind(this)}
      >
        {this.props.pictures.map((pict, index) =>
          <LibrairyPicturesListItem
            key={pict.pk}
            index={index}
            handleClick={this.handleClick.bind(this)}
            handleDrag={this.handleDrag.bind(this)}
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
