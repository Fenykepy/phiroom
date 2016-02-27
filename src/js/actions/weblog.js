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


export function invalidatePost(post) {
  return {
    type: types.INVALIDATE_POST,
    post,
  }
}

export function orderPostPictures(post, new_order) {
  return {
    type: types.ORDER_POST_PICTURES,
    post,
    new_order
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



/*
 * Posts edition
 */
function prefillPostForm(data = {tags: []}) {
  // start post edition with given datas
  return {
    type: types.POST_EDIT_PREFILL,
    data: data
  }
}

export function newPost()  {
  // start a new post edition with empty datas
  return function(dispatch) {
    return dispatch(prefillPostForm())
  }
}

export function editPost(post) {
  return function(dispatch, getState) {
    return dispatch(fetchPostIfNeeded(post))
      .then(data => {
        // get only tags names
        let tags = data.data.tags.map(tag => {
          return tag.name
        })
        return dispatch(prefillPostForm({
          slug: data.data.slug,
          title: data.data.title,
          description: data.data.description,
          source: data.data.source,
          tags: tags,
          draft: data.data.draft,
          pub_date: data.data.pub_date,
        }))
      })
  }
}


export function postSetTitle(title) {
  return {
    type: types.POST_EDIT_SET_TITLE,
    title
  }
}

export function postSetDescription(description) {
  return {
    type: types.POST_EDIT_SET_DESCRIPTION,
    description
  }
}

export function postSetSource(source) {
  return {
    type: types.POST_EDIT_SET_SOURCE,
    source
  }
}

export function postSetDraft(draft) {
  return {
    type: types.POST_EDIT_SET_DRAFT,
    draft
  }
}

export function postSetPubDate(pubdate) {
  return {
    type: types.POST_EDIT_SET,
    pubdate
  }
}

export function postAddTag(tag) {
  return {
    type: types.POST_EDIT_ADD_TAG,
    tag
  }
}

export function postDeleteTag(tag) {
  return {
    type: types.POST_EDIT_DELETE_TAG,
    tag
  }
}

function requestCreatePost() {
  return {
    type: types.REQUEST_CREATE_POST,
  }
}

function receiveNewPost(json) {
  return {
    type: types.REQUEST_CREATE_POST_SUCCESS,
    post: json.slug,
    data: json,
    receivedAt: Date.now()
  }
}

function requestCreatePostFailure(errors) {
  return {
    type: types.REQUEST_CREATE_POST_FAILURE,
    errors
  }
}

function getEditedData(state) {
  let post = state.weblog.edited
  return {
    title: post.title,
    draft: post.draft,
    description: post.description,
    source: post.source,
    pub_date: post.pubdate,
    tags_flat_list: post.tags || [],
  }
}

export function createPost() {
  return function(dispatch, getState) {
    dispatch(requestCreatePost())
    let data = getEditedData(getState())

    return Fetch.post('api/weblog/posts/',
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch new posts headers
      dispatch(fetchPostsHeaders())
      return dispatch(receiveNewPost(json))
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestCreatePostFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}


function requestUpdatePost() {
  return {
    type: types.REQUEST_UPDATE_POST,
  }
}

function receiveUpdatedPost(post, json) {
  return {
    type: types.REQUEST_UPDATE_POST_SUCCESS,
    slug: json.slug,
    old_slug: post,
    data: json,
    receivedAt: Date.now()
  }
}

function requestUpdatePostFailure(errors) {
  return {
    type: types.REQUEST_UPDATE_POST_FAILURE,
    errors
  }
}

export function updatePost(post) {
  return function(dispatch, getState) {
    dispatch(requestUpdatePost())
    let data = getEditedData(getState())

    return Fetch.patch(`api/weblog/posts/${post}/`,
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch posts headers
      dispatch(fetchPostsHeaders())
      return dispatch(receiveUpdatedPost(post, json))
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestUpdatePostFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}

export function deletePost(post) {
  /*
   * delete a post from server
   */
  return function(dispatch) {
    Fetch.delete(`api/weblog/posts/${post}/`)
      .then(() => {
        // refetch posts headers
        dispatch(fetchPostsHeaders())
      })

    return {
      type: types.POST_DELETE,
      post
    }
  }
}
