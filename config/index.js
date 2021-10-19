/**
 * 接口验签加密基础配置
 */

export const apiVerificationConfig = {
    keyPrefix: 'hoo',
    iv: 'develop-zhenjing',
    g2: "hoo.logger.G2",
    b2: "hoo.logger.B2"
}

/**
 * websocket路径
 */
export const wsUrl = process.env.NODE_ENV === 'development' ? 'wss://ws.hoowss.com/ws' : 'wss://ws.hoowss.com/ws'