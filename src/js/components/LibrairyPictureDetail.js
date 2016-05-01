import React, { Component, PropTypes } from 'react'

import LibrairyGridViewButton from './LibrairyGridViewButton'
import LibrairyPictureTitle from './LibrairyPictureTitle'

import { getItemByKey } from '../helpers/utils'


export default class LibrairyPictureDetail extends Component {
  render() {
    //console.log('librairy picture detail', this.props)
    let picture = getItemByKey(this.props.pictures, 'sha1', this.props.params.picture)

    if (picture) {
      return (
        <section id="librairy-detail">
          <header id="toolbar">
            <div className="title">
              <strong>{picture.name}</strong> | <LibrairyPictureTitle
                title={picture.title}
                picture={picture.sha1}
              />
            </div>
            <div className="right-bar">
              <div className="grid">
                <LibrairyGridViewButton
                  pathname={this.props.location.pathname}
                />
              </div>
              <div className="selection">
                {this.props.n_selected} selected / {this.props.n_pictures} pictures
              </div>
            </div>
          </header>
          <article>
            <img
              src={'/media/images/previews/large/' + picture.previews_path}
            />
          </article>
        </section>
      )
    }
    // TODO redirect to 404
    return null 
  }
}
