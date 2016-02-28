
const initialState = {
  domain: "phiroom.org",
  title: "Phiroom",
  subtitle: "Le cms des photographes…",
  weblog_logo: "/media/images/default/default_logo.png",
  librairy_logo: "/media/images/default/librairy_default_logo.png",
  n_posts_per_page: 3,
  slideshow_duration: 3000,
  carousel_default_height: 600,
  fb_link: '/',
  twitter_link: '/',
  gplus_link: '/',
  flickr_link: '/',
  vk_link: '/',
  pinterest_link: '/',
  px500_link: '/',
  insta_link: '/',
  comment: "Default settings",
}


export default function settings(state = initialState, action) {
  return state
}


