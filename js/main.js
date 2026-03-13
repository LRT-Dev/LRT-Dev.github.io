// main.js - 升级版，支持HS编码、真实关税API和运费查询

// 全局变量
let products = [];
let currentProduct = null; // 当前选中的商品（用于快速计算）

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    // 如果运费查询部分存在，初始化目的城市
    if (document.getElementById('dest-country')) {
        updateDestCity();
    }
});

// ========== 商品展示相关 ==========
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products || [];
        displayProducts();
    } catch (error) {
        console.error('加载商品失败:', error);
        document.getElementById('product-list').innerHTML = '<p>加载商品失败，请刷新重试</p>';
    }
}

function displayProducts() {
    const productList = document.getElementById('product-list');
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    
    if (!products || products.length === 0) {
        productList.innerHTML = '<p>暂无商品</p>';
        return;
    }
    
    let html = '';
    products.forEach(product => {
        const name = currentLang === 'zh' ? product.name_zh : product.name_ru;
        const desc = currentLang === 'zh' ? product.description_zh : product.description_ru;
        
        html += `
    <div class="product-card">
        <div class="product-image">
            <img src="${product.image || 'https://via.placeholder.com/300'}" 
                 alt="${name}" 
                 onerror="this.src='https://via.placeholder.com/300'">
            ${product.stock < 10 ? '<span class="stock-badge">库存紧张</span>' : ''}
        </div>
        <h3>${name}</h3>
        <p class="product-desc">${desc}</p>
        <div class="price-section">
            <span class="product-price">$${product.price.toLocaleString()}</span>
            <span class="product-weight">${product.weight}kg</span>
        </div>
        ${product.hs_code ? `<div class="hs-badge">HS: ${product.hs_code}</div>` : ''}
        <button onclick="quickCalculate(${product.id})" class="calc-quick-btn">
            ${currentLang === 'zh' ? '🚀 快速计算' : '🚀 Быстрый расчет'}
        </button>
    </div>
`;
    });
    
    productList.innerHTML = html;
}

// ========== 关税计算相关 ==========
function quickCalculate(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (currentProduct) {
        document.getElementById('product-price').value = currentProduct.price;
        document.getElementById('product-weight').value = currentProduct.weight;
        if (currentProduct.category) {
            document.getElementById('category-select').value = currentProduct.category;
        }
        
        calculateTariffWithAPI();
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}

async function calculateTariffWithAPI() {
    const price = parseFloat(document.getElementById('product-price').value);
    const weight = parseFloat(document.getElementById('product-weight').value);
    const country = document.getElementById('country-select').value;
    const category = document.getElementById('category-select').value;
    
    if (!price || price <= 0) {
        alert('请输入商品价格');
        return;
    }
    if (!weight || weight <= 0) {
        alert('请输入商品重量');
        return;
    }
    
    const resultDiv = document.getElementById('result');
    const resultDetails = document.getElementById('result-details');
    resultDiv.style.display = 'block';
    resultDetails.innerHTML = '<p>正在查询最新关税数据...</p>';
    
    const hsCode = currentProduct?.hs_code || null;
    
    let tariffData = null;
    if (typeof getTariffRate === 'function') {
        tariffData = await getTariffRate(hsCode, country);
    }
    
    if (!tariffData) {
        const defaultRates = {
            'kazakhstan': 0.086, 'uzbekistan': 0.074, 'kyrgyzstan': 0.08,
            'tajikistan': 0.08, 'turkmenistan': 0.05
        };
        
        const specialRates = {
            'machinery': 0.05, 'textiles': 0.12, 'food': 0.15,
            'electronics': 0.08, 'general': 0.08
        };
        
        let rate = defaultRates[country] || 0.08;
        if (category && specialRates[category]) {
            rate = specialRates[category];
        }
        
        tariffData = {
            rate: rate,
            source: 'local',
            note: '使用本地默认税率'
        };
    }
    
    const countryData = getCountryData(country);
    
    const tariff = price * tariffData.rate;
    const vat = (price + tariff) * countryData.vatRate;
    const shipping = weight * countryData.shippingBase;
    const total = price + tariff + vat + shipping;
    
    displayResult(price, tariff, vat, shipping, total, tariffData, countryData);
}

function getCountryData(country) {
    const countryDB = {
        'kazakhstan': { vatRate: 0.12, shippingBase: 10, name: '哈萨克斯坦' },
        'uzbekistan': { vatRate: 0.12, shippingBase: 12, name: '乌兹别克斯坦' },
        'kyrgyzstan': { vatRate: 0.12, shippingBase: 11, name: '吉尔吉斯斯坦' },
        'tajikistan': { vatRate: 0.14, shippingBase: 14, name: '塔吉克斯坦' },
        'turkmenistan': { vatRate: 0.15, shippingBase: 15, name: '土库曼斯坦' }
    };
    return countryDB[country] || { vatRate: 0.12, shippingBase: 10, name: '未知' };
}

function displayResult(price, tariff, vat, shipping, total, tariffData, countryData) {
    const resultDetails = document.getElementById('result-details');
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    
    const formatMoney = (num) => `$${num.toFixed(2)}`;
    const tariffPercent = (tariffData.rate * 100).toFixed(1);
    
    const sourceColor = tariffData.source === 'WITS' ? '#28a745' : '#ffc107';
    const sourceText = tariffData.source === 'WITS' ? '世界银行实时数据' : '本地估算';
    
    let html = '';
    if (currentLang === 'zh') {
        html = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>商品价格:</strong> ${formatMoney(price)}</p>
                <p><strong>关税 (${tariffPercent}%):</strong> ${formatMoney(tariff)}</p>
                <p><strong>增值税 (${(countryData.vatRate*100).toFixed(0)}%):</strong> ${formatMoney(vat)}</p>
                <p><strong>运费:</strong> ${formatMoney(shipping)}</p>
            </div>
            <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                总计: ${formatMoney(total)}
            </div>
            <div style="font-size: 0.8em; color: ${sourceColor}; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd;">
                📊 关税数据来源: ${sourceText}
                ${tariffData.note ? `<br>📝 备注: ${tariffData.note}` : ''}
                ${currentProduct?.hs_code ? `<br>🔖 HS编码: ${currentProduct.hs_code}` : ''}
            </div>
        `;
    } else {
        html = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>Цена товара:</strong> ${formatMoney(price)}</p>
                <p><strong>Пошлина (${tariffPercent}%):</strong> ${formatMoney(tariff)}</p>
                <p><strong>НДС (${(countryData.vatRate*100).toFixed(0)}%):</strong> ${formatMoney(vat)}</p>
                <p><strong>Доставка:</strong> ${formatMoney(shipping)}</p>
            </div>
            <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                Итого: ${formatMoney(total)}
            </div>
            <div style="font-size: 0.8em; color: ${sourceColor}; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd;">
                📊 Источник данных: ${tariffData.source === 'WITS' ? 'Всемирный банк' : 'Оценка'}
                ${tariffData.note ? `<br>📝 Примечание: ${tariffData.note}` : ''}
                ${currentProduct?.hs_code ? `<br>🔖 HS код: ${currentProduct.hs_code}` : ''}
            </div>
        `;
    }
    
    resultDetails.innerHTML = html;
}

// 兼容原版按钮
window.calculateTariff = function() {
    calculateTariffWithAPI();
};

// ========== 新增：运费查询相关 ==========

// 城市映射
const cityMap = {
    'tianjin': '天津', 'qingdao': '青岛', 'shanghai': '上海', 'shenzhen': '深圳',
    'yiwu': '义乌', 'urumqi': '乌鲁木齐', 'khorgos': '霍尔果斯', 'xinjiang': '新疆口岸',
    'almaty': '阿拉木图', 'astana': '阿斯塔纳', 'dostyk': '多斯特克',
    'tashkent': '塔什干', 'bishkek': '比什凯克', 'dushanbe': '杜尚别', 'ashgabat': '阿什哈巴德'
};

const modeNames = {
    'sea_rail': '海铁联运', 'rail': '铁路运输', 'road': '公路运输', 'air_road': '空陆联运'
};

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

// 根据国家更新目的城市下拉框
window.updateDestCity = function() {
    const country = document.getElementById('dest-country').value;
    const citySelect = document.getElementById('dest-city');
    
    citySelect.innerHTML = '';
    
    const cities = {
        'kazakhstan': [
            {value: 'almaty', text: '阿拉木图'},
            {value: 'astana', text: '阿斯塔纳'},
            {value: 'dostyk', text: '多斯特克'}
        ],
        'uzbekistan': [{value: 'tashkent', text: '塔什干'}],
        'kyrgyzstan': [{value: 'bishkek', text: '比什凯克'}],
        'tajikistan': [{value: 'dushanbe', text: '杜尚别'}],
        'turkmenistan': [{value: 'ashgabat', text: '阿什哈巴德'}]
    };
    
    const cityList = cities[country] || [];
    cityList.forEach(city => {
        const option = document.createElement('option');
        option.value = city.value;
        option.textContent = city.text;
        citySelect.appendChild(option);
    });
}

// 获取运费参考
async function getShippingHint(origin, destination, mode, cargoType, quantity) {
    const routes = await loadShippingRates();
    
    const originCn = cityMap[origin] || origin;
    const destCn = cityMap[destination] || destination;
    
    const matches = routes.filter(route => {
        const originMatch = route.origin.includes(originCn) || originCn.includes(route.origin);
        const destMatch = route.destination.includes(destCn) || destCn.includes(route.destination);
        const modeMatch = route.mode.includes(mode) || mode.includes(route.mode);
        return originMatch && destMatch && modeMatch;
    });
    
    if (matches.length === 0) {
        return { hasReference: false, hint: '⚠️ 未找到匹配的运费参考数据', details: '' };
    }
    
    let totalRate = 0;
    let count = 0;
    let sources = [];
    let dates = [];
    
    matches.forEach(route => {
        if (cargoType === '20gp' && route.rate_20gp) {
            totalRate += route.rate_20gp;
            count++;
            sources.push(`${route.source} ($${route.rate_20gp})`);
            if (route.source_date) dates.push(route.source_date);
        } else if (cargoType === '40gp' && route.rate_40gp) {
            totalRate += route.rate_40gp;
            count++;
            sources.push(`${route.source} ($${route.rate_40gp})`);
            if (route.source_date) dates.push(route.source_date);
        } else if (cargoType === 'ltl' && route.rate_per_kg) {
            totalRate += route.rate_per_kg;
            count++;
            sources.push(`${route.source} ($${route.rate_per_kg}/kg)`);
            if (route.source_date) dates.push(route.source_date);
        } else if (cargoType === 'bulk' && route.rate_per_ton) {
            totalRate += route.rate_per_ton;
            count++;
            sources.push(`${route.source} ($${route.rate_per_ton}/吨)`);
            if (route.source_date) dates.push(route.source_date);
        }
    });
    
    if (count === 0) {
        return { hasReference: false, hint: '⚠️ 该货物类型无匹配参考数据', details: '' };
    }
    
    const avgRate = totalRate / count;
    const latestDate = dates.sort().reverse()[0] || '近期';
    
    return {
        hasReference: true,
        avgRate: avgRate,
        hint: `📊 参考价: $${avgRate.toFixed(2)} (基于${count}家货代公司报价，${latestDate})`,
        details: sources.join('；')
    };
}

// 运费计算主函数
window.calculateShipping = async function() {
    const origin = document.getElementById('origin-city').value;
    const destCity = document.getElementById('dest-city').value;
    const mode = document.getElementById('transport-mode').value;
    const cargoType = document.getElementById('cargo-type').value;
    const quantity = parseFloat(document.getElementById('cargo-quantity').value);
    
    if (!quantity || quantity <= 0) {
        alert('请输入数量');
        return;
    }
    
    const resultDiv = document.getElementById('shipping-result');
    const detailsDiv = document.getElementById('shipping-details');
    resultDiv.style.display = 'block';
    detailsDiv.innerHTML = '<p>正在查询运费参考数据...</p>';
    
    const hint = await getShippingHint(origin, destCity, mode, cargoType, quantity);
    
    let estimatedCost = 0;
    if (hint.hasReference) {
        estimatedCost = hint.avgRate * quantity;
    } else {
        const defaultRates = {
            'sea_rail': { '20gp': 5000, '40gp': 9000 },
            'rail': { '20gp': 4500, '40gp': 8500 },
            'road': { '20gp': 4000, '40gp': 7500 },
            'air_road': { 'ltl': 10 }
        };
        
        if (defaultRates[mode] && defaultRates[mode][cargoType]) {
            estimatedCost = defaultRates[mode][cargoType] * quantity;
        } else {
            estimatedCost = 5000 * quantity;
        }
    }
    
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    
    let html = '';
    if (currentLang === 'zh') {
        html = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>路线:</strong> ${cityMap[origin] || origin} → ${cityMap[destCity] || destCity}</p>
                <p><strong>运输方式:</strong> ${modeNames[mode] || mode}</p>
                <p><strong>估算运费:</strong> $${estimatedCost.toFixed(2)}</p>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 0.95rem;">
                    <strong>💡 参考提示</strong><br>
                    ${hint.hint}
                </p>
                ${hint.details ? `
                <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #666;">
                    <strong>数据来源:</strong> ${hint.details}
                </p>
                ` : ''}
                <p style="margin: 8px 0 0 0; font-size: 0.8rem; color: #999;">
                    ⚠️ 以上为市场参考价，实际运费以货代公司报价为准
                </p>
            </div>
        `;
    } else {
        html = `<p>运费估算结果（俄语版本待补充）</p>`;
    }
    
    detailsDiv.innerHTML = html;
};

// 监听语言切换
document.addEventListener('languageChanged', function(e) {
    displayProducts();
});
// ===== 全程陪同服务表单处理 =====
document.addEventListener('DOMContentLoaded', function() {
    const accompanyForm = document.getElementById('accompany-form');
    if (accompanyForm) {
        accompanyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 收集表单数据
            const formData = {
                name: document.getElementById('client-name').value,
                phone: document.getElementById('client-phone').value,
                country: document.getElementById('client-country').value,
                language: document.getElementById('client-language').value,
                product: document.getElementById('interested-product').value,
                visitDate: document.getElementById('visit-date').value,
                contactMethod: document.getElementById('contact-method').value,
                specialRequests: document.getElementById('special-requests').value,
                services: []
            };
            
            // 收集选中的服务
            document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                formData.services.push(cb.value);
            });
            
            // 这里可以发送到您的邮箱或后台
            console.log('预约数据:', formData);
            
            // 模拟发送
            setTimeout(() => {
                // 隐藏表单，显示成功信息
                document.querySelector('.service-form').style.display = 'none';
                document.getElementById('service-success').style.display = 'block';
                
                // 可选：发送到您的邮箱（需要后端支持）
                // sendToEmail(formData);
            }, 1000);
        });
    }
});

// 可选：发送邮件函数（需要后端API）
function sendToEmail(formData) {
    // 这里可以调用您的后端API
    // 例如：fetch('/api/send-email', { method: 'POST', body: JSON.stringify(formData) })
    alert('预约已提交，我们会尽快联系您！');
}