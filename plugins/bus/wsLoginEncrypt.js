

import { apiVerificationConfig } from '@/config'
import { StorageCache } from 'bt-tools'
import { randomEncrypt } from '@/utils/randomEncrypt'
import AesEncrypt from 'aes-cross'


function wsLoginEncrypt () {
    // 获取storage统一使用bt-tools的库，参考文档：https://lqs5858.github.io/bt-tools/bt-tools/1.2.4/StorageCache.html
    const token = StorageCache.get('token')
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
        key = token?.substring(temp1, temp2)
    }
    let text = {
        nonce: randomNum,
        ts: Math.floor(Date.now() / 1000),
    };
    key = Buffer.from(key)
    let iv = Buffer.from(_iv)
    text = JSON.stringify(text)
    const encryptText = AesEncrypt.encText(text, key, iv)

    let tempLoginData = {
        op: "loginws",
        data: encryptText,
        token: token,
        nonce: randomNum,
        ts: Math.floor(Date.now() / 1000)
    };
    return tempLoginData
}
export default wsLoginEncrypt