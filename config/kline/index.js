
/**
 * h5端禁用功能
 */
export const h5_disabled_features = [
    // 'adaptive_logo', // 移动端禁用logo
    'border_around_the_chart',
    'use_localstorage_for_settings',
    'header_chart_type', // 隐藏k线样式选择
    'header_symbol_search',
    'timeframes_toolbar',
    'volume_force_overlay',
    'header_saveload',
    'header_resolutions',
    'header_compare',
    'header_undo_redo',
    'header_screenshot',
    'left_toolbar',
    'display_market_status',
    'show_chart_property_page',
    'show_logo_on_all_charts',
    'control_bar',
    // 'display_market_status',
    'hide_last_na_study_output',
    'header_widget',
    'context_menus', // 隐藏右键上下文
    'source_selection_markers', // 禁用k线选择后小标记
    'property_pages' // 禁用所有属性页
]

export const disabled_features = [
    'header_widget', //隐藏头部组件
    'timezone_menu',
    'use_localstorage_for_settings',
    'header_symbol_search',
    'timeframes_toolbar',
    'volume_force_overlay', // k线和柱状图分离
    'header_saveload',
    // 'header_fullscreen_button', // 开启全屏
    'header_resolutions',
    // 'header_indicators', // 指标隐藏
    'header_compare',
    'header_screenshot',
    'adaptive_logo',
    // 'show_chart_property_page', //关闭禁用属性，开启会导致无法打开设置
    'context_menus', // 隐藏右键菜单
    // 'display_market_status',
    'symbol_search_hot_key',
    'header_chart_type',
    'header_undo_redo',
    'symbol_info',
    'go_to_date',
    'source_selection_markers', // 禁用k线选择后小标记
    // 'property_pages' // 禁用所有属性页,开启会导致无法打开设置
]

export const enabled_features = [
    'hide_last_na_study_output', //隐藏n/a
    'keep_left_toolbar_visible_on_small_screens', // 防止左侧工具栏在小屏幕下消失
    'side_toolbar_in_fullscreen_mode', // 全屏模式启用绘图工具
    'left_toobar'
    // 'study_templates',
    // 'hide_left_toolbar_by_default' // 左边工具栏
]

/**
 * 黑夜模式 studies_overrides，riseFalltype为normal下
 */
export const darkStudies_overrides_normal = {
    'volume.volume.color.0': "#1ab7a6",
    'volume.volume.color.1': "#d35d5d",
}

/**
 * 
 * risefalltype反转下
 */

export const darkStudies_overrides_reverse = {
    'volume.volume.color.0': "#1ab7a6",
    'volume.volume.color.1': "#d35d5d",
}

/**
 * 白天模式 studies_overrides
 */

// 暂时不用

// export const lightStudies_overrides = {
//     'volume.volume.color.0': "#fe3933",
//     'volume.volume.color.1': "#22dda2",
// }



/**
 * 
 * @param {*} addStudies_overrides -改变主题时动态追加样式
 * @returns Object
 */
export function getStudies_overrides (addStudies_overrides) {
    return {
        ...addStudies_overrides,
        'volume.volume.transparency': 50,
        'MACD.MACD.linewidth': 2, // macd线宽
        'MACD.Signal.linewidth': 2, // macd信号线线宽
        'MACD.Histogram.linewidth': 3 // macd柱状图宽
    }
}

/**
 * 正常柱状图颜色，绿涨红跌
 */

export const candleStyleNormal = {
    'mainSeriesProperties.candleStyle': {
        upColor: '#1ab7a6',
        downColor: '#d35d5d',
        drawBorder: true,
        borderColor: "#1ab7a6",
        borderUpColor: '#1ab7a6',
        borderDownColor: '#d35d5d',
        drawWick: true,
        wickColor: '#1ab7a6',
        wickUpColor: '#1ab7a6',
        wickDownColor: '#d35d5d',
        barColorsOnPrevClose: !1
    },
}

/**
 * 反转柱状图颜色，绿涨红跌
 */
export const candleStyleReverse = {
    'mainSeriesProperties.candleStyle': {
        upColor: '#d35d5d',
        downColor: '#1ab7a6',
        drawBorder: true,
        borderColor: "#d35d5d",
        borderUpColor: '#d35d5d',
        borderDownColor: '#1ab7a6',
        drawWick: true,
        wickColor: '#d35d5d',
        wickUpColor: '#d35d5d',
        wickDownColor: '#1ab7a6',
        barColorsOnPrevClose: !1
    },
}


/**
 * 黑夜模式
 */
export const darkOverrides = {
    'scalesProperties.textColor': "#7a8793", // 图标区域xy轴 文字颜色
    'scalesProperties.lineColor': "rgba(20, 36, 50, 0.4)", // 图标区域xy轴颜色
    'paneProperties.background': '#0e1a24', // 图标区域 背景色
    'paneProperties.vertGridProperties.color': "rgba(20, 36, 50, 0.4)", // 图标区域 表格纵轴颜色
    'paneProperties.horzGridProperties.color': "rgba(20, 36, 50, 0.4)", // 图标区域 表格橫轴颜色
    'paneProperties.crossHairProperties.color': '#25445f', // 图标区域 鼠标十字线颜色
    // 柱状图颜色设置

    // 分时图颜色设置
    'mainSeriesProperties.areaStyle.color1': 'rgba(26, 183, 166, 0.12)',
    'mainSeriesProperties.areaStyle.color2': 'rgba(26, 183, 166, 0)',
    'mainSeriesProperties.areaStyle.linecolor': '#1ab7a6'
}

/**
 * 白天模式
 */

export const lightOverrides = {
    'scalesProperties.textColor': "#7a8793", // 图标区域xy轴 文字颜色
    'scalesProperties.lineColor': "rgba(20, 36, 50, 0.05)", // 图标区域xy轴颜色
    'paneProperties.background': '#fff', // 图标区域 背景色
    'paneProperties.vertGridProperties.color': "transparent", // 图标区域 表格纵轴颜色
    'paneProperties.horzGridProperties.color': "rgba(20, 36, 50, 0.04)", // 图标区域 表格橫轴颜色
    'paneProperties.crossHairProperties.color': '#c2ccd1', // 图标区域 鼠标十字线颜色
    // 柱状图颜色设置

    // 分时图颜色设置
    'mainSeriesProperties.areaStyle.color1': 'rgba(0, 192, 171, 0.12)',
    'mainSeriesProperties.areaStyle.color2': 'rgba(0, 192, 171, 0)',
    'mainSeriesProperties.areaStyle.linecolor': '#00c0ab'
}

/**
 * 
 * @param {*} addOverrides -改变主题时动态追加样式
 * @returns Object
 */

export function getOverrides (addOverrides) {
    return {
        ...addOverrides,
        // k线的颜色
        volumePaneSize: 'small', // 成交量大小
        'scalesProperties.fontSize': 10, // 图标区域xy轴 字体大小
        'paneProperties.legendProperties.showLegend': true, // 折叠信息
        'mainSeriesProperties.areaStyle.linestyle': 0,
        'mainSeriesProperties.areaStyle.linewidth': 0.5,
        'mainSeriesProperties.areaStyle.priceSource': 'close'
    }
}


// kline时间周期
export const klineTimePeriod = [
    {
        text: 'trade_kline_time_text_1',
        icon: '',
        id: 'time'
    },
    {
        text: 'trade_kline_time_text_2',
        icon: '',
        id: '1'
    },
    {
        text: 'trade_kline_time_text_3',
        icon: '',
        id: '3'
    },
    {
        text: 'trade_kline_time_text_4',
        icon: '',
        id: '5'
    },
    {
        text: 'trade_kline_time_text_5',
        icon: '',
        id: '15'
    },
    {
        text: 'trade_kline_time_text_6',
        icon: '',
        id: '30'
    },
    {
        text: 'trade_kline_time_text_7',
        icon: '',
        id: '60'
    },
    {
        text: 'trade_kline_time_text_8',
        icon: '',
        id: '120'
    },
    {
        text: 'trade_kline_time_text_9',
        icon: '',
        id: '360'
    },
    {
        text: 'trade_kline_time_text_10',
        icon: '',
        id: '720'
    },
    {
        text: 'trade_kline_time_text_11',
        icon: '',
        id: '1440'
    },
    {
        text: 'trade_kline_time_text_12',
        icon: '',
        id: '10080'
    },
]

//kline给接口入参数
export const klineApiParams = {
    time: '1Min',
    1: '1Min',
    3: '3Min',
    5: '5Min',
    15: '15Min',
    30: '30Min',
    60: '1Hour',
    120: '2Hour',
    360: '6Hour',
    720: '12Hour',
    1440: '1Day',
    10080: '1Week'
}



// 资金结算周期
export const fund_end_time = [
    '08:00',
    '16:00',
    '23:59'
]

//资金结算最大间隔时间
export const fund_max_time = 28800


//配置是否展示macd

export const showMacd = false