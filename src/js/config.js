
/*
 * django rest API url
 * usually 'http://127.0.0.1:8000/' in development
 * and 'https://mon_domaine.com/' in production
 * you must add trailing slash '/'
 */
let base_url = 'http://127.0.0.1:8000/'

/*
 * whether or not express must serve static files
 * true: statics files are served by a proxy (like nginx)
 * false: they are served by express
 */
let statics_proxy = false

/*
 * port on which express app will listen at.
 * it can be a port number (default is 3000)
 * or a unix socket filepath (like '/tmp/my_unix_socket.sock')
 */
let port = 3000


export { base_url, statics_proxy, port }
