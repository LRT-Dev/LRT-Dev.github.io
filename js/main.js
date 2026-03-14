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
        
        calculateTariffWithAPI(); // 改为调用API
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}

// ========== API关税计算函数 ==========
async function calculateTariffWithAPI() {
    const price = parseFloat(document.getElementById('product-price').value);
    const country = document.getElementById('country-select').value;
    const hsCode = currentProduct?.hs_code || '';
    
    if (!price || price <= 0) {
        alert('请输入商品价格');
        return;
    }
    
    const resultDiv = document.getElementById('result');
    const resultDetails = document.getElementById('result-details');
    resultDiv.style.display = 'block';
    resultDetails.innerHTML = '<p>正在查询真实关税数据...</p>';
    
    try {
        const response = await fetch('http://localhost:5000/api/get-tariff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hs_code: hsCode,
                country: country
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            // 计算关税
            let tariff = 0;
            let rateDisplay = '';
            
            if (data.tariff_type === 'percentage') {
                tariff = price * data.tariff_rate;
                rateDisplay = `${(data.tariff_rate*100).toFixed(1)}%`;
                
                const vat = (price + tariff) * data.vat_rate;
                const total = price + tariff + vat;
                
                // 显示结果
                const html = `
                    <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                        <p><strong>商品价格:</strong> $${price.toFixed(2)}</p>
                        <p><strong>关税 (${rateDisplay}):</strong> $${tariff.toFixed(2)}</p>
                        <p><strong>增值税 (${(data.vat_rate*100).toFixed(0)}%):</strong> $${vat.toFixed(2)}</p>
                    </div>
                    <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                        总计: $${total.toFixed(2)}
                    </div>
                    <div style="font-size: 0.8em; color: #666; margin-top: 10px;">
                        📊 数据来源: ${data.tariff_note || '真实海关数据'}
                    </div>
                `;
                
                resultDetails.innerHTML = html;
            } else {
                // 从量税显示提示
                resultDetails.innerHTML = `
                    <p style="color: #856404; background: #fff3cd; padding: 15px; border-radius: 8px;">
                        <strong>ⓘ 该商品按从量税计征</strong><br>
                        ${data.full_response}<br>
                        <span style="font-size: 0.9rem;">请联系客服获取精确报价，并提供具体规格参数。</span>
                    </p>
                `;
            }
        } else {
            throw new Error('查询失败');
        }
        
    } catch (error) {
        console.error('API调用失败:', error);
        resultDetails.innerHTML = `
            <p style="color: red;">❌ API连接失败，请确保本地服务器已启动</p>
            <p style="font-size: 0.8em; color: #666;">错误信息: ${error.message}</p>
        `;
    }
}

// 保留本地计算函数作为备用（但不使用）
function calculateTariffLocally() {
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
    
    // 默认税率
    const defaultRates = {
        'kazakhstan': 0.086, 'uzbekistan': 0.074, 'kyrgyzstan': 0.08,
        'tajikistan': 0.08, 'turkmenistan': 0.05
    };
    
    // 特殊类别税率
    const specialRates = {
        'machinery': 0.05, 'textiles': 0.12, 'food': 0.15,
        'electronics': 0.08, 'general': 0.08
    };
    
    let rate = defaultRates[country] || 0.08;
    if (category && specialRates[category]) {
        rate = specialRates[category];
    }
    
    // 国家数据（增值税率）
    const vatRates = {
        'kazakhstan': 0.12,
        'uzbekistan': 0.12,
        'kyrgyzstan': 0.12,
        'tajikistan': 0.14,
        'turkmenistan': 0.15
    };
    const vatRate = vatRates[country] || 0.12;
    
    // 计算
    const tariff = price * rate;
    const vat = (price + tariff) * vatRate;
    const total = price + tariff + vat;
    
    // 直接显示结果
    displayLocalResult(price, tariff, vat, total, rate, country);
}

// 本地结果显示函数
function displayLocalResult(price, tariff, vat, total, rate, country) {
    const resultDetails = document.getElementById('result-details');
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    const formatMoney = (num) => `$${num.toFixed(2)}`;
    const tariffPercent = (rate * 100).toFixed(1);
    
    // 获取国家增值税率显示
    const vatRates = {
        'kazakhstan': 12, 'uzbekistan': 12, 'kyrgyzstan': 12,
        'tajikistan': 14, 'turkmenistan': 15
    };
    const vatPercent = vatRates[country] || 12;
    
    if (currentLang === 'zh') {
        resultDetails.innerHTML = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>商品价格:</strong> ${formatMoney(price)}</p>
                <p><strong>关税 (${tariffPercent}%):</strong> ${formatMoney(tariff)}</p>
                <p><strong>增值税 (${vatPercent}%):</strong> ${formatMoney(vat)}</p>
            </div>
            <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                总计: ${formatMoney(total)}
            </div>
            <div style="font-size: 0.8em; color: #666; margin-top: 10px;">
                📊 数据来源: 本地参考税率
            </div>
        `;
    } else {
        resultDetails.innerHTML = `
            <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                <p><strong>Цена товара:</strong> ${formatMoney(price)}</p>
                <p><strong>Пошлина (${tariffPercent}%):</strong> ${formatMoney(tariff)}</p>
                <p><strong>НДС (${vatPercent}%):</strong> ${formatMoney(vat)}</p>
            </div>
            <div style="font-size: 1.3em; color: #0052cc; font-weight: bold; margin: 15px 0;">
                Итого: ${formatMoney(total)}
            </div>
            <div style="font-size: 0.8em; color: #666; margin-top: 10px;">
                📊 Источник: Локальная ставка
            </div>
        `;
    }
}

// 兼容原版按钮
window.calculateTariff = function() {
    calculateTariffWithAPI(); // 改为调用API
};

// ===== 全程陪同服务表单处理 =====
document.addEventListener('DOMContentLoaded', function() {
    const accompanyForm = document.getElementById('accompany-form');
    if (accompanyForm) {
        accompanyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
                formData.services.push(cb.value);
            });
            
            console.log('预约数据:', formData);
            
            setTimeout(() => {
                document.querySelector('.service-form').style.display = 'none';
                document.getElementById('service-success').style.display = 'block';
            }, 1000);
        });
    }
});

// ===== 商品详情弹窗功能 =====
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    const name = currentLang === 'zh' ? product.name_zh : product.name_ru;
    const description = currentLang === 'zh' ? product.description_zh : product.description_ru;
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-detail');
    
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
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setupModalEvents() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = closeProductModal;
    }
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeProductModal();
        }
    };
}

document.addEventListener('languageChanged', function(e) {
    displayProducts();
});