import bus from './bus'

export default ({ app }, inject) => {
    inject('bus', bus())
}