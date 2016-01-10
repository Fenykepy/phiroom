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

  setHeaders(headers={}) {
    return Object.assign(this.default_headers,
      headers
    )
  }

  get(url, headers={}) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "GET",
          headers: this.setHeaders(headers)
        })
        .then(response =>
            response.json()
        )
  }

  post(url, headers={}, body) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "POST",
          headers: this.setHeaders(headers),
          body: body
        })
        .then(response =>
          response.json()
        )
  }

  delete(url, headers={}) {
    return fetch(base_url + url,
        {
          credentials: 'include',
          method: "DELETE",
          headers: this.setHeaders(headers)
        })
        .then(response => {
          console.log(response)
        })
  }
}


export default new Fetch()

