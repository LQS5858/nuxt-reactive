export const state = () => ({
  count: 8,
  lang: 'zh'
})

export const mutations = {
  ADD_COUNT (state, data) {
    state.count = data
  },
  SET_LANG (state, data) {
    state.lang = data
  }
}
