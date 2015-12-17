import { combineReducers } from 'redux'

function selectedPost(state = null, action) {
  switch (action.type) {
    default:
      return state
  }
}

function selectedPage(state = null, action) {
  switch (action.type) {
    default:
      return state
  }
}
function posts(state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}

function pages(state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}

function tags(state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}



const weblog = combineReducers({
  selectedPost,
  selectedPage,
  posts,
  pages,
  tags,
})

export default weblog
