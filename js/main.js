// 全局变量
let products = [];
let tariffRates = {};

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadTariffRates();
});

// 加载商品数据
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products;
        displayProducts();
    } catch (error) {
        console.error('加载商品失败:', error);
        document.getElementById('product-list').innerHTML = '<p>加载商品失败，请刷新重试</p>';
    }
}

// 加载关税数据
async function loadTariffRates() {
    try {
        const response = await fetch('data/tariff-rates.json');
        const data = await response.json();
        tariffRates = data.countries;
    } catch (error) {
        console.error('加载关税数据失败:', error);
    }
}

// 显示商品
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
        <button onclick="quickCalculate(${product.id})" class="calc-quick-btn">
            ${currentLang === 'zh' ? '🚀 快速计算' : '🚀 Быстрый расчет'}
        </button>
    </div>
`;
    });
    
    productList.innerHTML = html;
}

// 关税计算函数
function calculateTariff() {
    // 获取输入值
    const price = parseFloat(document.getElementById('product-price').value);
    const weight = parseFloat(document.getElementById('product-weight').value);
    const country = document.getElementById('country-select').value;
    const category = document.getElementById('category-select').value;
    
    // 验证输入
    if (!price || price <= 0) {
        alert(currentLang === 'zh' ? '请输入商品价格' : 'Введите цену товара');
        return;
    }
    if (!weight || weight <= 0) {
        alert(currentLang === 'zh' ? '请输入商品重量' : 'Введите вес товара');
        return;
    }
    
    // 获取国家税率
    const countryData = tariffRates[country];
    if (!countryData) {
        alert('国家数据加载失败');
        return;
    }
    
    // 获取适用税率
    let tariffRate = countryData.base_rate;
    if (countryData.special_rates && countryData.special_rates[category]) {
        tariffRate = countryData.special_rates[category];
    }
    
    // 计算关税
    const tariff = price * tariffRate;
    
    // 计算增值税
    const vat = (price + tariff) * countryData.vat_rate;
    
    // 计算运费
    const shipping = weight * countryData.shipping_base;
    
    // 计算总价
    const total = price + tariff + vat + shipping;
    
    // 显示结果
    displayResult(price, tariff, vat, shipping, total, tariffRate, countryData);
}

// 快速计算（从商品卡片调用）
function quickCalculate(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-weight').value = product.weight;
        document.getElementById('category-select').value = product.category;
        calculateTariff();
        
        // 滚动到计算器
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}

// 显示计算结果
function displayResult(price, tariff, vat, shipping, total, tariffRate, countryData) {
    const resultDiv = document.getElementById('result');
    const resultDetails = document.getElementById('result-details');
    const currentLang = localStorage.getItem('preferred_language') || 'zh';
    
    resultDiv.style.display = 'block';
    
    const formatMoney = (num) => `$${num.toFixed(2)}`;
    
    let html = '';
    if (currentLang === 'zh') {
        html = `
            <p><strong>商品价格:</strong> ${formatMoney(price)}</p>
            <p><strong>关税 (${(tariffRate*100).toFixed(1)}%):</strong> ${formatMoney(tariff)}</p>
            <p><strong>增值税 (12%):</strong> ${formatMoney(vat)}</p>
            <p><strong>运费:</strong> ${formatMoney(shipping)}</p>
            <p style="font-size: 1.2em; color: #007bff; margin-top: 10px;">
                <strong>总计:</strong> ${formatMoney(total)}
            </p>
        `;
    } else {
        html = `
            <p><strong>Цена товара:</strong> ${formatMoney(price)}</p>
            <p><strong>Пошлина (${(tariffRate*100).toFixed(1)}%):</strong> ${formatMoney(tariff)}</p>
            <p><strong>НДС (12%):</strong> ${formatMoney(vat)}</p>
            <p><strong>Доставка:</strong> ${formatMoney(shipping)}</p>
            <p style="font-size: 1.2em; color: #007bff; margin-top: 10px;">
                <strong>Итого:</strong> ${formatMoney(total)}
            </p>
        `;
    }
    
    resultDetails.innerHTML = html;
}

// 监听语言切换事件（需要配合translator.js）
document.addEventListener('languageChanged', function(e) {
    displayProducts(); // 刷新商品显示的语言
});