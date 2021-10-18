export const state = () => ({
  count: 8,
  lang: 'zh',
  userInfo: {}
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
  }
}
