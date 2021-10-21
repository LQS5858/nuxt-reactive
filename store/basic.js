export const state = () => ({
  count: 8,
  lang: 'zh',
  userInfo: {},
  screenSize: 'bigPc'
})

export const mutations = {
  ADD_COUNT (state, data) {
    state.count = data
  },
  SET_LANG (state, data) {
    state.lang = data
  },
  SAVE_USER_INFO (state, data) {
    state.userInfo = data
  },
  SET_SCREEN_SIZE (state, size) {
    state.screenSize = size
  }
}
