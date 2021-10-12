
import AesEncrypt from 'aes-cross'
import { StorageCache } from 'bt-tools'


export function randomEncrypt (min, max) {
    var str = "";
    var range = min;
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    range = Math.round(Math.random() * (max - min)) + min;
    for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
// 自定义判断元素类型JS
function toType (obj) {
    return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
}
// 参数过滤函数
function filterNull (o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key];
        }
        if (toType(o[key]) === "string") {
            o[key] = o[key].trim();
        } else if (toType(o[key]) === "object") {
            o[key] = filterNull(o[key]);
        } else if (toType(o[key]) === "array") {
            o[key] = filterNull(o[key]);
        }
    }
    return o;
}

/**
 * @param {*} apiVerificationConfig -接口验签配置,默认值{ keyPrefix: 'hoo', iv: 'develop-zhenjing'}
 * @param {*} token -登录态
 * @param {*} params -参数，默认值{}
 * @returns Object -加密后的对象
 */


export function generateEncrypt (apiVerificationConfig, token, params = {}) {
    try {
        // 未登录
        //生成13位随机字符串
        let randomNum = randomEncrypt(13, 13);
        const { keyPrefix, iv: _iv, g2, b2 } = apiVerificationConfig || { keyPrefix: 'hoo', iv: 'develop-zhenjing' }
        //获取key,iv
        let key = keyPrefix + randomNum;
        if (token) {
            /**
             * 开发调试的时候localstorage没有dasauto，为了开发调试方便设置默认值
             */
            let temp1 = StorageCache.get(g2) || 20
            let temp2 = StorageCache.get(b2) || 34
            temp1 = temp1 || String(temp1) === '0' ? parseInt(temp1) - 4 : temp1
            temp2 = temp2 || String(temp2) === '0' ? parseInt(temp2) - 2 : temp2
            randomNum = randomEncrypt(16, 16)
            key = token?.substring(temp1, temp2)
            // console.log('加密传入token>>>', token, g2, temp1, temp2, key);

        }
        let text = params ? Object.assign({}, params, {
            nonce: randomNum,
            ts: Math.floor(Date.now() / 1000)
        }) : Object.assign({}, {
            nonce: randomNum,
            ts: Math.floor(Date.now() / 1000)
        })
        key = Buffer.from(key)
        let iv = Buffer.from(_iv)
        text = JSON.stringify(text)
        const encryptText = AesEncrypt.encText(text, key, iv)
        let encryptData = {
            data: encryptText,
            nonce: randomNum
        }
        encryptData = filterNull(encryptData)
        return encryptData
    } catch (error) {
        console.warn('[设置加密data出错]>>>', error)
    }

}

