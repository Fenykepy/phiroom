
const initialState = {
  domain: "phiroom.org",
  title: "Phiroom",
  subtitle: "Le cms des photographes…",
  weblog_logo: "/media/images/default/default_logo.png",
  librairy_logo: "/media/images/default/librairy_default_logo.png",
  n_posts_per_page: 3,
  slideshow_duration: 3000,
  fb_link: null,
  twitter_link: null,
  gplus_link: null,
  flickr_link: null,
  vk_link: null,
  comment: "Default settings",
}


export default function settings(state = initialState, action) {
  return state
}


