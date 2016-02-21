import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'

import { receiveShortPicture } from './pictures'


// action creators


export function requestPostsHeaders() {
  return {
    type: types.REQUEST_POSTS_HEADERS
  }
}

export function receivePostsHeaders(json) {
  return {
    type: types.REQUEST_POSTS_HEADERS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPostsHeadersFailure(error) {
  return {
    type: types.REQUEST_POSTS_HEADERS_FAILURE,
    error
  }
}


function shouldFetchPostsHeaders(state) {
  // returns true if headers haven't been fetched or are invalidate
  const headers = state.weblog.headers
  if (! headers) { return true }
  if (headers.is_fetching || headers.fetched) { return false }
  return true
}


function fetchPostsHeaders() {
  // fetch user's posts headers
  return function(dispatch) {
    // start request
    dispatch(requestPostsHeaders())
    // return a promise
    return Fetch.get('api/weblog/posts/headers/')
      .then(json =>
          dispatch(receivePostsHeaders(json))
      )
      .catch(error =>
          dispatch(requestPostsHeadersFailure(error.message))
      )
  }
}

export function fetchPostsHeadersIfNeeded() {
  // fetch posts headers if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPostsHeaders(getState())) {
      return dispatch(fetchPostsHeaders())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve())
  }
}

// posts
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

export function selectPost(post) {
  return { type: types.SELECT_POST, post}
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
    return Fetch.get(`api/weblog/posts/${post}/`)
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
    return Fetch.get(`api/weblog/posts/${post}/pictures/`)
      .then(json => {
        json.map((item) => {
          dispatch(receiveShortPicture(item.pk, item))
        })
      })
    }
}



// pages
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

export function selectWeblogPage(page) {
  return { type: types.SELECT_WEBLOG_PAGE, page}
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
    return Fetch.get(`api/weblog/posts/?page=${page}`)
      .then(json => {
        // add post to state
        dispatch(receiveWeblogPage(page, json))
      })
      .catch(error =>
          dispatch(requestWeblogPageFailure(page, error.message))
      )
  }
}




// pages by tag
export function requestWeblogPageByTag(tag, page) {
  return {
    type: types.REQUEST_WEBLOG_PAGE_BYTAG,
    tag,
    page
  }
}

export function receiveWeblogPageByTag(tag, page, json) {
  return {
    type: types.REQUEST_WEBLOG_PAGE_BYTAG_SUCCESS,
    tag,
    page,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestWeblogPageByTagFailure(tag, page, error) {
  return {
    type: types.REQUEST_WEBLOG_PAGE_FAILURE,
    tag,
    page,
    error
  }
}

export function selectWeblogPageByTag(tag, page) {
  return {
    type: types.SELECT_WEBLOG_PAGE_BYTAG,
    tag,
    page
  }
}

function shouldFetchWeblogPageByTag(state, tag, page) {
  // returns true if page hasn't been fetched yet
  const tagitem = state.weblog.pagesByTag[tag]
  if (! tagitem || ! tagitem[page]) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchWeblogPageByTagIfNeeded(tag, page) {
  // fetch weblog page if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchWeblogPage(getState(), tag, page)) {
      return dispatch(fetchWeblogPageByTag(tag, page))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().weblog.pagesByTag[tag][page]}
    ))
  }
}

function fetchWeblogPageByTag(tag, page) {
  /*
   * Fetch a weblog's page by tag data
   */
  return function(dispatch) {
    // start request
    dispatch(requestWeblogPageByTag(tag, page))
    // return a promise
    return Fetch.get(`api/weblog/posts/tag/${tag}/?page=${page}`)
      .then(json => {
        // add post to state
        dispatch(receiveWeblogPageByTag(tag, page, json))
      })
      .catch(error =>
          dispatch(requestWeblogPageByTagFailure(tag, page, error.message))
      )
  }
}





