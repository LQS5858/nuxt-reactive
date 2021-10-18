
// api/user/profile
export const fetchProfile = (vue, showError = false) => {
    return vue.$http.get('/api/user/profile', { showError })
}