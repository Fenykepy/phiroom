export function getCookie(name) {
  let cname = name + "="
  let cookies = document.cookie.split(';')
  for (let i=0, l=cookies.length; i < l; i++) {
    let cookie = cookies[i]
    if (cookie.substring(0, l) == cname) {
      return cookie.split('=')[1]
    }
  }
  return false
}

export function setCookie(name, value, expire) {
  document.cookie=`${name}=${value}; expires=${expire}`
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
}
