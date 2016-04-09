import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'

// action creators

function requestSettings() {
  return {
    type: types.REQUEST_SETTINGS
  }
}

function receiveSettings(json) {
  return {
    type: types.REQUEST_SETTINGS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

function requestSettingsFailure(error) {
  return {
    type: types.REQUEST_SETTINGS_FAILURE,
    error
  }
}

function shouldFetchSettings(state) {
  const settings = state.common.settings
  if (! settings) return true
  if (settings.is_fetching || settings.fetched) return false
  return true
}

export function fetchSettingsIfNeeded() {
  // fetch settings if it's not done yet
  return (dispatch, getState) => {
    let state = getState()
    if ( shouldFetchSettings(state) ) {
      return dispatch(fetchSettings())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
      state.common.settings
    ))
  }
}

function fetchSettings() {
  /*
   * fetch settings
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestSettings())
    // return a promise
    return Fetch.get('api/settings/latest/', getState())
      .then(json =>
        dispatch(receiveSettings(json))
      )
      .catch(error =>
        dispatch(requestSettingsFailure(error.message))
      )
  }
}
