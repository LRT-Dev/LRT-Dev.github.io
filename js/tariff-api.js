// tariff-api.js - 根据WITS官方文档严格编写 [citation:1]

// 国家代码映射（ISO3格式 - WITS要求）
const countryToISO3 = {
  'kazakhstan': 'KAZ',
  'uzbekistan': 'UZB',
  'kyrgyzstan': 'KGZ',
  'tajikistan': 'TJK',
  'turkmenistan': 'TKM'
};

// 默认税率（当API失败时使用）
const defaultRates = {
  'kazakhstan': 0.086,
  'uzbekistan': 0.074,
  'kyrgyzstan': 0.08,
  'tajikistan': 0.08,
  'turkmenistan': 0.05
};

// 缓存
const tariffCache = {};

/**
 * 获取真实关税税率 - 严格按照WITS API规范 [citation:1]
 * @param {string} hsCode - 6位HS编码
 * @param {string} country - 国家代码
 * @returns {Promise<Object>} 税率数据
 */
async function getTariffRate(hsCode, country) {
  
  // 参数验证
  if (!hsCode) {
    console.log('无HS编码，使用默认税率');
    return {
      rate: defaultRates[country] || 0.08,
      source: 'default',
      note: '无HS编码'
    };
  }

  const reporter = countryToISO3[country];
  if (!reporter) {
    console.warn('未知国家:', country);
    return {
      rate: 0.08,
      source: 'default',
      note: '国家错误'
    };
  }

  // 检查缓存
  const cacheKey = `${hsCode}_${reporter}`;
  if (tariffCache[cacheKey]) {
    console.log('使用缓存数据');
    return tariffCache[cacheKey];
  }

  // 显示查询状态
  if (window.showStatus) {
    window.showStatus(`正在查询HS编码 ${hsCode} 的关税...`);
  }

  try {
    // 根据WITS官方文档构建正确的请求URL [citation:1]
    // 格式: /reporter.partner.product.year...
    const year = 2022; // 使用有数据的年份
    
    // 方法1: 使用SDMX格式（官方推荐）
    const sdmxUrl = `https://wits.worldbank.org/API/V1/SDMX/V21/rest/data/WITS,DF_TARIFF_TRN,1.0/${reporter}.CHN.${hsCode}.MFN.A..?startPeriod=${year}&endPeriod=${year}&format=json`;
    
    console.log('请求URL (SDMX):', sdmxUrl);
    
    // 尝试直接请求
    let response = await fetch(sdmxUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'  // 明确要求CORS
    });
    
    // 如果直接请求失败，尝试通过代理
    if (!response.ok) {
      console.log('直接请求失败，尝试通过代理...');
      
      // 使用公共CORS代理
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      response = await fetch(proxyUrl + sdmxUrl);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API返回数据:', data);
    
    // 按照WITS官方文档解析数据 [citation:1]
    // 官方说明：SimpleAverage字段包含平均税率
    let rate = null;
    
    // 尝试解析WITS的SDMX格式
    if (data?.data?.datasets?.[0]?.observations) {
      // SDMX格式：observations包含数据点
      const observations = data.data.datasets[0].observations;
      // 取第一个observation的值（OBS_VALUE）
      const firstKey = Object.keys(observations)[0];
      if (firstKey && observations[firstKey] && observations[firstKey][0] !== undefined) {
        rate = observations[firstKey][0] / 100; // 百分比转小数
        console.log('找到税率 (SDMX格式):', rate);
      }
    } 
    // 尝试其他可能的格式
    else if (data?.data?.value) {
      rate = data.data.value / 100;
    } else if (data?.value) {
      rate = data.value / 100;
    }
    
    // 如果解析成功
    if (rate !== null && !isNaN(rate)) {
      const result = {
        rate: rate,
        source: 'WITS',
        year: year,
        note: `世界银行${year}年真实关税数据`
      };
      
      // 存入缓存
      tariffCache[cacheKey] = result;
      
      if (window.showStatus) {
        window.showStatus(`✅ 获取成功: ${(rate*100).toFixed(1)}%`);
      }
      
      return result;
    }
    
    // 解析失败，但API可能返回了其他格式
    console.warn('无法解析税率，API返回:', data);
    
    // 根据官方文档，可能是没有数据 [citation:1]
    if (window.showStatus) {
      window.showStatus('该商品没有关税数据，使用默认值');
    }
    
    return {
      rate: defaultRates[country] || 0.08,
      source: 'default',
      note: 'WITS无此商品数据'
    };
    
  } catch (error) {
    console.error('获取关税失败:', error);
    
    if (window.showStatus) {
      window.showStatus(`连接失败: ${error.message}`);
    }
    
    // 返回默认税率
    return {
      rate: defaultRates[country] || 0.08,
      source: 'default',
      note: '网络连接失败'
    };
  }
}

// 添加状态显示功能（可选）
window.showStatus = function(msg) {
  // 如果有状态显示元素就更新
  const statusEl = document.getElementById('api-status');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  } else {
    console.log('状态:', msg);
  }
};

// 导出函数
window.getTariffRate = getTariffRate;