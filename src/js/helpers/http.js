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

  setDefaultHeaders(headers={}) {
    headers = Object.assign(
        this.default_headers,
        headers
    )
    return new Headers(headers)
  }

  checkStatus(response) {
    if (response.status == 401) {
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

  get(url, headers={}) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "GET",
          headers: this.setDefaultHeaders(headers)
        })
        .then(this.checkStatus)
        .then(response => 
          response.json()
        )
  }

  post(url, headers={}, body) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "POST",
          headers: new Headers(headers),
          body: body
        })
        .then(this.checkStatus)
        .then(response =>
          response.json()
        )
  }

  patch(url, headers={}, body) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "PATCH",
          headers: new Headers(headers),
          body: body
        })
        .then(this.checkStatus)
        .then(response =>
          response.json()
        )
  }

  delete(url, headers={}) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "DELETE",
          headers: this.setDefaultHeaders(headers)
        })
        .then(this.checkStatus)
  }
}


export default new Fetch()

