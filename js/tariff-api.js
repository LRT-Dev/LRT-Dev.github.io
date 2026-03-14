// tariff-api.js - 真实关税API查询
// 根据商品HS编码实时查询世界银行WITS数据库

// 国家代码映射（ISO3格式 - WITS要求）
const countryToISO3 = {
    'kazakhstan': 'KAZ',
    'uzbekistan': 'UZB',
    'kyrgyzstan': 'KGZ',
    'tajikistan': 'TJK',
    'turkmenistan': 'TKM'
};

// 缓存，避免重复查询
const tariffCache = {};

/**
 * 获取真实关税税率 - 根据HS编码实时查询
 * @param {string} hsCode - 6位HS编码（从商品数据传入）
 * @param {string} country - 国家代码
 * @returns {Promise<Object>} 税率数据
 */
async function getTariffRate(hsCode, country) {
    // 如果没有HS编码，返回空（让主程序使用默认税率）
    if (!hsCode) {
        return {
            rate: null,
            source: 'none',
            note: '无HS编码，使用默认税率'
        };
    }

    const reporter = countryToISO3[country];
    if (!reporter) {
        return {
            rate: null,
            source: 'none',
            note: '国家代码错误'
        };
    }

    // 检查缓存
    const cacheKey = `${hsCode}_${reporter}`;
    if (tariffCache[cacheKey]) {
        return tariffCache[cacheKey];
    }

    try {
        // 使用WITS API查询真实关税 [citation:1]
        const year = 2022; // 最新可用年份
        const url = `https://wits.worldbank.org/API/V1/SDMX/V21/rest/data/WITS,DF_TARIFF_TRN,1.0/${reporter}.CHN.${hsCode}.MFN.A..?startPeriod=${year}&endPeriod=${year}&format=json`;
        
        console.log(`正在查询HS编码 ${hsCode} 在 ${country} 的关税...`);
        
        // 尝试直接请求
        let response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
        });

        // 如果失败，尝试通过代理（用于本地开发）
        if (!response.ok) {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            response = await fetch(proxyUrl + url);
        }

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const data = await response.json();
        
        // 解析WITS返回的税率数据
        let rate = null;
        
        // 尝试解析不同格式的返回数据
        if (data?.data?.datasets?.[0]?.observations) {
            const observations = data.data.datasets[0].observations;
            const firstKey = Object.keys(observations)[0];
            if (firstKey && observations[firstKey] && observations[firstKey][0] !== undefined) {
                rate = observations[firstKey][0] / 100; // 百分比转小数
            }
        } else if (data?.data?.value) {
            rate = data.data.value / 100;
        }

        if (rate !== null && !isNaN(rate)) {
            const result = {
                rate: rate,
                source: 'WITS',
                year: year,
                note: `世界银行${year}年真实关税数据`
            };
            
            tariffCache[cacheKey] = result;
            console.log(`✅ 查询成功: ${hsCode} 关税 ${(rate*100).toFixed(1)}%`);
            return result;
        }

        // 如果API返回成功但没有数据，说明该HS编码无记录
        return {
            rate: null,
            source: 'no_data',
            note: '该HS编码在WITS无数据'
        };

    } catch (error) {
        console.error('查询关税失败:', error);
        return {
            rate: null,
            source: 'error',
            note: '网络连接失败'
        };
    }
}

// 导出函数
window.getTariffRate = getTariffRate;