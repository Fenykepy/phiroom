import React, { Component, PropTypes } from 'react'

import capitalize from '../helpers/utils'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'
import Modal from './Modal'
import LibrairyDeletePictureConfirm from './LibrairyDeletePictureConfirm'

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

import {
  setModal,
  closeModal,
} from '../actions/modal'


export default class LibrairyPicturesList extends Component {

  constructor(props) {
    super(props)

    this.accepted_drop = [PICTURE]
  }

  closeModal() {
    /*
     * close modal window
     */
    this.props.dispatch(closeModal())
  }

  dropValid(types) {
    /*
     * returns true if drag object is valid for picture target
     */
    if (this.props.orderable) {
      return listsHaveCommon(types, this.accepted_drop)
    }
  }
 

  getActionTargets(picture) {
    /*
     * Take a picture pk as argument
     * returns an array with all selected pictures pk
     * if picture is selected
     * else return an array with only picture pk
     * 
     * used to get all target of an action
     */
    if (this.props.selected_list.indexOf(picture) > -1) {
      // picture is selected, target all selection
      return this.props.selected_list
    }
    // picture is not selected, it's the only target
    return [picture]
  }

  getPicturesByPks(pks) {
    /*
     * Return a list of picture objects corresponding to pks
     * in given array
     */
    return this.props.pictures.filter((pict) => {
      if (pks.indexOf(pict.pk) > -1) return true
      return false
    })
  }


  deletePictures(pictures) {
    /*
     * Delete given pictures from Phiroom
     */
    pictures.map(item => {
      this.props.dispatch(unsetPicture(item))
      this.props.dispatch(deletePicture(item))
    })
    // close modal
    this.closeModal()
  }


  confirmDeletePicture(picture) {
    /*
     * Open a modal window to confirm
     * pictures deletion from Phiroom
     */
    let pks = this.getActionTargets(picture)
    let pictures = this.getPicturesByPks(pks)

    let title, small
    if (pictures.length > 1) {
      title = `Delete ${pictures.length} pictures`
      small = false
    } else {
      title = 'Delete a picture'
      small = true
    }
    let modal = (
        <Modal
          modal_closable={true}
          modal_small={small}
          modal_close={this.closeModal.bind(this)}
          modal_title={title}
          modal_child={LibrairyDeletePictureConfirm}
          pictures={pictures}
          delete={() => this.deletePictures(pks)}
        />
    )
    this.props.dispatch(setModal(modal))
  }


  handleClick(picture, ctrlKey, shiftKey) {
    /*
     * Classical selection system :
     *  - on simple click image is selected and others
     *    are not anymore
     *  - on ctrl click image selection is toogled
     *  - on shift click first selected item and clicked
     *    item interval is selected
     */
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
    /*
     * Unselect all displayed pictures
     */
    return this.props.dispatch(unselectAll())
  }

  handleDrag(e, picture) {
    /*
     * On drag start, store action targets
     * and drag type in state
     */
    e.dataTransfer.setData(PICTURE, picture)
    e.dropEffect = "copy"
    this.props.dispatch(dragStart(PICTURE,
          this.getActionTargets(picture)))
  }

  handleDrop(basket_index) {
    /*
     * Reorder pictures in display area :
     * we reorder pks in array here for it to be common to
     * all pictures list, then send results to parent function
     * which dispatchs with good container
     */
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
    /*
     * Trigger an reordering at the end when a drop
     * occurs on background
     */
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.handleDrop(this.props.pictures.length)
    }
  }

  handleBackgroundDragOver(e) {
    /*
     * Trigger a valid dragover for background
     */
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
        <header id="toolbar">
          <div className="title">
            <strong>{this.props.container_title}</strong> <h2>{this.props.title}</h2>
          </div>
          <div className="right-bar">
            <div className="selection">
              selected pictures: {this.props.n_selected}/{this.props.n_pictures}
            </div>
            <div className="edition">
              {this.props.edition_button}
            </div>
          </div>
        </header>
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
            deletePicture={this.confirmDeletePicture.bind(this)}
            unselectAll={this.unselectAll.bind(this)}
            {...pict}
          />
        )}
      </section>
    )
  }
}
