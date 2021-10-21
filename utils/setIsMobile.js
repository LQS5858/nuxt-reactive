
export function setIsMobile (Store) {
  const screenWidth = document.documentElement.clientWidth
  const ua = navigator.userAgent
  if (/iPad/gi.test(ua) || (screenWidth < 880 && screenWidth >= 775)) {
    Store.commit('basic/SET_SCREEN_SIZE', 'ipad')
    console.log('ipad>>>');
  } else if (screenWidth < 775) {
    /**
     * width小于775判定为移动端,参考币安的
     */
    console.log('ipad h5>>>');
    Store.commit('basic/SET_SCREEN_SIZE', 'h5')
  } else if (screenWidth < 1540) {
    Store.commit('basic/SET_SCREEN_SIZE', 'smallPc')
  } else {
    Store.commit('basic/SET_SCREEN_SIZE', 'bigPc')
  }
}

