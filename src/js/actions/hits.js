import Fetch from '../helpers/http'

export function sendHit(data) {
  /*
   * Send a view hit to server
   */
  return function(dispatch, getState) {
    return Fetch.post('api/stats/hits/',
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .catch(error => {
      throw error
    })
  }
}
