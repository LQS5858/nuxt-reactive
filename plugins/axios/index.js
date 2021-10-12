import service from '~/apiServices/http/http.js'

export default ({ app }, inject) => {
    inject('http', service(app))
}
