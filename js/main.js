// main.js - 升级版，支持HS编码、真实关税API

// 全局变量
let products = [];
let currentProduct = null; // 当前选中的商品（用于快速计算）

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    // 初始化弹窗事件
    setupModalEvents();
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
    <div class="product-card" data-product-id="${product.id}" style="cursor: pointer;">
        <div class="product-image" onclick="showProductDetail(${product.id})">
            <img src="${product.image || 'https://via.placeholder.com/300'}" 
                 alt="${name}" 
                 onerror="this.src='https://via.placeholder.com/300'">
            ${product.stock < 10 ? '<span class="stock-badge">库存紧张</span>' : ''}
        </div>
        <h3 onclick="showProductDetail(${product.id})">${name}</h3>
        <p class="product-desc" onclick="showProductDetail(${product.id})">${desc}</p>
        <div class="price-section" onclick="showProductDetail(${product.id})">
            <span class="product-price">$${product.price.toLocaleString()}</span>
            <span class="product-weight">${product.weight}kg</span>
        </div>
        ${product.hs_code ? `<div class="hs-badge" onclick="showProductDetail(${product.id})">HS: ${product.hs_code}</div>` : ''}
        <button onclick="event.stopPropagation(); quickCalculate(${product.id})" class="calc-quick-btn">
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
    const total = price + tariff + vat; // 只加关税和增值税，删除运费
    
    displayResult(price, tariff, vat, total, tariffData, countryData);
}

function getCountryData(country) {
    const countryDB = {
        'kazakhstan': { vatRate: 0.12, name: '哈萨克斯坦' },
        'uzbekistan': { vatRate: 0.12, name: '乌兹别克斯坦' },
        'kyrgyzstan': { vatRate: 0.12, name: '吉尔吉斯斯坦' },
        'tajikistan': { vatRate: 0.14, name: '塔吉克斯坦' },
        'turkmenistan': { vatRate: 0.15, name: '土库曼斯坦' }
    };
    return countryDB[country] || { vatRate: 0.12, name: '未知' };
}

function displayResult(price, tariff, vat, total, tariffData, countryData) {
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
            </div>
            <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                总计 (含关税+增值税): ${formatMoney(total)}
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

// ===== 商品详情弹窗功能 =====

// 打开详情弹窗
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    const name = currentLang === 'zh' ? product.name_zh : product.name_ru;
    const description = currentLang === 'zh' ? product.description_zh : product.description_ru;
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-detail');
    
    // 构建详情HTML
    modalContent.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-header">
                <div class="product-detail-image">
                    <img src="${product.image || 'https://via.placeholder.com/400'}" 
                         alt="${name}"
                         onerror="this.src='https://via.placeholder.com/400'">
                </div>
                <div class="product-detail-info">
                    <h2>${name}</h2>
                    <div class="product-detail-price">${product.price.toLocaleString()}</div>
                    
                    <div class="product-detail-specs">
                        <div class="spec-item">
                            <span class="spec-label">${currentLang === 'zh' ? 'HS编码' : 'HS код'}:</span>
                            <span class="spec-value">${product.hs_code || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">${currentLang === 'zh' ? '重量' : 'Вес'}:</span>
                            <span class="spec-value">${product.weight} kg</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">${currentLang === 'zh' ? '类别' : 'Категория'}:</span>
                            <span class="spec-value">${product.category || 'general'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="product-detail-description">
                <h3>${currentLang === 'zh' ? '商品描述' : 'Описание'}</h3>
                <p>${description}</p>
                ${product.features ? `
                <ul style="margin-top: 15px; padding-left: 20px;">
                    ${product.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            
            <div class="product-detail-actions">
                <button onclick="quickCalculate(${product.id}); closeProductModal()" class="detail-calc-btn">
                    ${currentLang === 'zh' ? '📊 快速计算关税' : '📊 Быстрый расчет'}
                </button>
                <a href="#contact" onclick="closeProductModal()" class="detail-contact-btn">
                    ${currentLang === 'zh' ? '📞 咨询陪同服务' : '📞 Сопровождение'}
                </a>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
}

// 关闭弹窗
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
}

// 设置弹窗事件
function setupModalEvents() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.onclick = closeProductModal;
    }
    
    // 点击空白区域关闭
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeProductModal();
        }
    };
}

// 监听语言切换
document.addEventListener('languageChanged', function(e) {
    displayProducts();
});