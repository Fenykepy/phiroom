export function setLightboxLink(path, lightbox) {
  let url = path.split('/lightbox/')[0]
  if (url.slice(-1) != "/") {
    url = url + '/'
  }
  return url + 'lightbox/' + lightbox + '/'
}
