import fetch from 'isomorphic-fetch'
import { base_url } from '../config'

/*
 * A wrapper arround fetch.
 * to set default headers
 * and some helper methods.
 */

class Fetch {

  constructor() {
    this.default_headers = {
      'Accept': 'application/json'
    }
  }

  setAuthorization(headers, state) {
    console.log('test')
    if (state && state.common && state.common.user.token) {
      console.log(state.common.user.token)
      return Object.assign(
        headers,
        {'Authorization': 'JWT ' + state.common.user.token}
      )
    }
    return headers
  }

  setDefaultHeaders(headers={}, state) {
    headers = Object.assign(
        this.default_headers,
        this.setAuthorization(headers, state)
    )
    return new Headers(headers)
  }

  checkStatus(response) {
    console.log(response.url)
    if (response.status == 401) {
      console.log('need authentication')
      // redirect to login page
    }
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      let error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  get(url, state, headers={}) {
    return fetch(base_url + url,
        {
          method: "GET",
          headers: this.setDefaultHeaders(headers, state)
        })
        .then(this.checkStatus)
        .then(response => 
          response.json()
        )
  }

  post(url, state, headers={}, body) {
    return fetch(base_url + url,
        {
          method: "POST",
          headers: new Headers(this.setAuthorization(headers, state)),
          body: body
        })
        .then(this.checkStatus)
        .then(response =>
          response.json()
        )
  }

  patch(url, state, headers={}, body) {
    return fetch(base_url + url,
        {
          method: "PATCH",
          headers: new Headers(this.setAuthorization(headers, state)),
          body: body
        })
        .then(this.checkStatus)
        .then(response =>
          response.json()
        )
  }

  delete(url, state, headers={}) {
    return fetch(base_url + url,
        {
          method: "DELETE",
          headers: this.setDefaultHeaders(headers, state)
        })
        .then(this.checkStatus)
  }
}


export default new Fetch()

