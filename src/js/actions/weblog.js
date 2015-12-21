import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionsTypes'
import { receiveShortPicture } from './pictures'

import { base_url } from '../config'

// action creators

export function requestWeblogPage(page) {
  return {
    type: types.REQUEST_WEBLOG_PAGE,
    page
  }
}

export function receiveWeblogPage(page, json) {
  return {
    type: types.REQUEST_WEBLOG_PAGE_SUCCESS,
    page,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestWeblogPageFailure(page, error) {
  return {
    type: types.REQUEST_WEBLOG_PAGE_FAILURE,
    page,
    error
  }
}


export function requestPost(post) {
  return {
    type: types.REQUEST_POST,
    post
  }
}

export function receivePost(post, json) {
  return {
    type: types.REQUEST_POST_SUCCESS,
    post,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPostFailure(post, error) {
  return {
    type: types.REQUEST_POST_FAILURE,
    post,
    error
  }
}

export function requestPostPictures(post) {
  return {
    type: types.REQUEST_POST_PICTURES,
    post
  }
}

export function receivePostPictures(post, json) {
  return {
    type: types.REQUEST_POST_PICTURES_SUCCESS,
    post,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPostPicturesFailure(post, error) {
  return {
    type: types.REQUEST_POST_PICTURES_FAILURE,
    post,
    error
  }
}




export function selectWeblogPage(page) {
  return { type: types.SELECT_WEBLOG_PAGE, page}
}

export function selectPost(post) {
  return { type: types.SELECT_POST, post}
}


function shouldFetchWeblogPage(state, page) {
  // returns true if page hasn't been fetched yet
  const item = state.weblog.pages[page]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}


export function fetchWeblogPageIfNeeded(page) {
  // fetch weblog page if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchWeblogPage(getState(), page)) {
      return dispatch(fetchWeblogPage(page))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().weblog.pages[page]}
    ))
  }
}


function fetchWeblogPage(page) {
  /*
   * Fetch a weblog's page data
   */
  return function(dispatch) {
    // start request
    dispatch(requestWeblogPage(page))
    // return a promise
    return fetch(`${base_url}api/weblog/posts/?page=${page}`)
      .then(response =>
          response.json()
      )
      .then(json => {
        // add post to state
        dispatch(receiveWeblogPage(page, json))
      })
      .catch(error =>
          dispatch(requestWeblogPageFailure(page, error.message))
      )
  }
}

function shouldFetchPost(state, post) {
  // returns true if post hasn't been fetched yet
  const item = state.weblog.posts[post]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}


export function fetchPostIfNeeded(post) {
  // fetch weblog post if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPost(getState(), post)) {
      return dispatch(fetchPost(post))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
        {data: getState().weblog.posts[post]}
    ))
  }
}


function fetchPost(post) {
  /*
   * Fetch a weblog's post data
   */
  return function(dispatch) {
    // start request
    dispatch(requestPost(post))
    // return a promise
    return fetch(`${base_url}api/weblog/posts/${post}/`)
      .then(response =>
          response.json()
      )
      .then(json =>
        dispatch(receivePost(post, json))
      )
      .catch(error =>
          dispatch(requestPostFailure(post, error.message))
      )
  }
}



export function fetchPostPictures(post) {
  /*
   * fetch all pictures of a post at once
   */
  return function(dispatch) {
    // start request
    dispatch(requestPostPictures(post))
    // return a promise
    return fetch(`${base_url}api/weblog/posts/${post}/pictures/`)
      .then(response =>
          response.json()
      )
      .then(json => {
        json.map((item) => {
          dispatch(receiveShortPicture(item.pk, item))
        })
      })
    }
}
