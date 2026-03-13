// shipping-data.js - 运费参考数据库

// 加载运费数据
async function loadShippingRates() {
    try {
        const response = await fetch('data/shipping-rates.json');
        const data = await response.json();
        return data.routes || [];
    } catch (error) {
        console.error('加载运费数据失败:', error);
        return [];
    }
}

// 城市代码映射（用于匹配）
const cityMap = {
    // 中国城市
    'tianjin': '天津',
    'qingdao': '青岛',
    'shanghai': '上海',
    'shenzhen': '深圳',
    'yiwu': '义乌',
    'urumqi': '乌鲁木齐',
    'khorgos': '霍尔果斯',
    'xinjiang': '新疆口岸',
    
    // 中亚城市
    'tashkent': '塔什干',
    'almaty': '阿拉木图',
    'astana': '阿斯塔纳',
    'bishkek': '比什凯克',
    'dushanbe': '杜尚别',
    'ashgabat': '阿什哈巴德',
    'dostyk': '多斯特克'
};

// 获取匹配的运费参考
async function getShippingReference(origin, destination, mode, cargoType, quantity) {
    const routes = await loadShippingRates();
    
    // 获取中文名称
    const originCn = cityMap[origin] || origin;
    const destCn = cityMap[destination] || destination;
    
    // 查找匹配的路线
    const matches = routes.filter(route => {
        // 始发地匹配（模糊匹配）
        const originMatch = route.origin.includes(originCn) || originCn.includes(route.origin);
        // 目的地匹配
        const destMatch = route.destination.includes(destCn) || destCn.includes(route.destination);
        // 运输方式匹配（粗略）
        const modeMatch = route.mode.includes(mode) || mode.includes(route.mode);
        
        return originMatch && destMatch && modeMatch;
    });
    
    if (matches.length === 0) {
        return {
            hasReference: false,
            message: '未找到匹配的运费参考数据'
        };
    }
    
    // 计算平均参考价
    let totalRate = 0;
    let count = 0;
    let sources = [];
    
    matches.forEach(route => {
        if (cargoType === '20gp' && route.rate_20gp) {
            totalRate += route.rate_20gp;
            count++;
            sources.push(`${route.source} ($${route.rate_20gp})`);
        } else if (cargoType === '40gp' && route.rate_40gp) {
            totalRate += route.rate_40gp;
            count++;
            sources.push(`${route.source} ($${route.rate_40gp})`);
        } else if (cargoType === 'ltl' && route.rate_per_kg) {
            totalRate += route.rate_per_kg;
            count++;
            sources.push(`${route.source} ($${route.rate_per_kg}/kg)`);
        } else if (cargoType === 'bulk' && route.rate_per_ton) {
            totalRate += route.rate_per_ton;
            count++;
            sources.push(`${route.source} ($${route.rate_per_ton}/吨)`);
        }
    });
    
    if (count === 0) {
        return {
            hasReference: false,
            message: '该货物类型无匹配参考数据'
        };
    }
    
    const avgRate = totalRate / count;
    
    return {
        hasReference: true,
        avgRate: avgRate,
        matches: matches,
        sources: sources,
        message: `基于 ${matches.length} 家货代公司参考价`,
        details: sources.join('；')
    };
}

// 获取运费提示文本
async function getShippingHint(origin, destination, mode, cargoType, quantity) {
    const ref = await getShippingReference(origin, destination, mode, cargoType, quantity);
    
    if (!ref.hasReference) {
        return {
            hint: `⚠️ 参考价: ${ref.message}`,
            rate: null
        };
    }
    
    return {
        hint: `📊 参考价: $${ref.avgRate.toFixed(2)} (基于${ref.matches.length}家货代公司报价，${ref.matches[0]?.source_date || '近期'})`,
        rate: ref.avgRate,
        details: ref.details
    };
}

// 导出
window.getShippingHint = getShippingHint;
window.getShippingReference = getShippingReference;