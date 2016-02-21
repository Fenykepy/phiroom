import * as types from '../constants/actionsTypes'
import { PICTURE } from '../constants/dragTypes'

import Fetch from '../helpers/http'

import { invalidatePortfolio } from './portfolios'
import { invalidatePost } from './weblog'
// action creators

export function setTitle(title) {
  return {
    type: types.LIBRAIRY_SET_TITLE,
    title
  }
}

export function setPictures(pictures) {
  return {
    type: types.SET_PICTURES,
    pictures
  }
}

export function selectPicture(picture) {
  return {
    type: types.SELECT_PICTURE,
    picture
  }
}

export function unsetPicture(picture) {
  // remove a picture from librairy displayed list
  return {
    type: types.UNSET_PICTURE,
    picture
  }
}

export function unselectPicture(picture) {
  return {
    type: types.UNSELECT_PICTURE,
    picture
  }
}

export function unselectAll() {
  return {
    type: types.UNSELECT_ALL,
  }
}

export function dragStart(type, data) {
  return {
    type: types.DRAG_START,
    drag_type: type,
    drag_data: data
  }
}

export function dragEnd() {
  return {
    type: types.DRAG_END
  }
}

export function addPict2Portfolio(portfolio, picture) {
  return (dispatch) => {
    // add pictures to portfolio
    return Fetch.post('api/portfolio/portfolio-picture/',
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify({
        portfolio: portfolio,
        picture: picture
      })
    )
    .then(json => {
        dispatch(invalidatePortfolio(portfolio))
    })
    .catch(error =>
        console.log(error.message)
    )
  }
}

export function removePictFromPortfolio(portfolio, picture) {
  return (dispatch) => {
    Fetch.delete('api/portfolio/portfolio-picture/portfolio/'
      + portfolio + '/picture/' + picture + '/')
    .then(json => {
        console.log(json)
    })
    .catch(error => {
        console.warn(error)
        dispatch(invalidatePortfolio(portfolio))
    })
    // optimistically remove picture from portfolio
    dispatch({
      type: types.PORTFOLIO_REMOVE_PICTURE,
      portfolio,
      picture
    })
  }
}

export function orderPictInPortfolio(portfolio, picture, order) {
  return (dispatch) => {
    Fetch.patch('api/portfolio/portfolio-picture/portfolio/'
        + portfolio + '/picture/' + picture + '/',
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          JSON.stringify({
            order: order
          })
    )
    .catch(error => {
      console.warn(error)
      dispatch(invalidatePortfolio(portfolio))
    })
  }
}

export function addPict2Post(post, picture) {
  console.log(post, picture)
  return (dispatch) => {
    // add picture to post
    return Fetch.post('api/weblog/post-picture/',
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify({
        post: post,
        picture: picture
      })
    )
    .then(json => {
      dispatch(invalidatePost(post))
    })
    .catch(error =>
        console.log(error.message)
    )
  }
}


export function removePictFromPost(post, picture) {
  return (dispatch) => {
    Fetch.delete('api/weblog/post-picture/post/'
          + post + '/picture/' + picture + '/')
    .then(json => {
      console.log(json)
    })
    .catch(error => {
      console.warn(error)
      dispatch(invalidatePost(post))
    })
    // optimistically remove picture from post
    dispatch({
      type: types.POST_REMOVE_PICTURE,
      post,
      picture
    })
  }
}


export function orderPictInPost(post, picture, order) {
  return (dispatch) => {
    Fetch.patch('api/weblog/post-picture/post/'
        + post + '/picture/' + picture + '/',
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          JSON.stringify({
            order: order
          })
    )
    .catch(error => {
      console.warn(error)
      dispatch(invalidatePost(post))
    })
  }
}
