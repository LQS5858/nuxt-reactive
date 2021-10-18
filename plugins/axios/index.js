import service from '@/apiServices/http/http.js'

export default ({ app, store }, inject) => {
    inject('http', service(app, store))
}
