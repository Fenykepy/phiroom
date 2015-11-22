let production = false

let base_url

if (production) {
  base_url = '/'
} else {
  base_url = 'http://127.0.0.1:8000/'
}

export { base_url }
