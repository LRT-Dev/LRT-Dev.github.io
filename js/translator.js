// 翻译数据
const translations = {
  'zh': {
    'site_title': '中亚贸易网 - 中国到中亚五国',
    'site_logo': '中亚贸易网',
    'nav_home': '首页',
    'nav_products': '商品展示',
    'nav_calculator': '关税计算器',
    'nav_contact': '联系我们',
    'hero_title': '中国到中亚五国 · 一站式贸易服务',
    'hero_desc': '提供商品展示、关税计算、物流运输全流程支持',
    'products_title': '热门商品',
    'loading': '加载商品中...',
    'calculator_title': '关税运费计算器',
    'calc_product_price': '商品价格 (美元)',
    'calc_weight': '重量 (kg)',
    'calc_country': '目的国家',
    'calc_category': '商品类别',
    'calc_btn': '计算总费用',
    'result_title': '计算结果',
    'contact_title': '联系我们',
    'contact_email': '邮箱: trade@example.com',
    'contact_phone': '电话: +86 123 4567 890',
    'footer_text': '© 2024 中亚贸易网 - 中国到中亚五国贸易服务',
    'country_kz': '哈萨克斯坦',
    'country_uz': '乌兹别克斯坦',
    'country_kg': '吉尔吉斯斯坦',
    'country_tj': '塔吉克斯坦',
    'country_tm': '土库曼斯坦',
    'category_general': '普通商品',
    'category_machinery': '机械设备',
    'category_textiles': '纺织品',
    'category_food': '食品'
  },
  'ru': {
    'site_title': 'Central Asia Trade - Китай в страны Центральной Азии',
    'site_logo': 'Central Asia Trade',
    'nav_home': 'Главная',
    'nav_products': 'Товары',
    'nav_calculator': 'Калькулятор',
    'nav_contact': 'Контакты',
    'hero_title': 'Китай в страны Центральной Азии · Полный спектр услуг',
    'hero_desc': 'Товары, расчет пошлин, логистика',
    'products_title': 'Популярные товары',
    'loading': 'Загрузка...',
    'calculator_title': 'Калькулятор пошлин и доставки',
    'calc_product_price': 'Цена товара (USD)',
    'calc_weight': 'Вес (кг)',
    'calc_country': 'Страна назначения',
    'calc_category': 'Категория товара',
    'calc_btn': 'Рассчитать стоимость',
    'result_title': 'Результат',
    'contact_title': 'Контакты',
    'contact_email': 'Email: trade@example.com',
    'contact_phone': 'Тел: +86 123 4567 890',
    'footer_text': '© 2024 Central Asia Trade - Услуги торговли',
    'country_kz': 'Казахстан',
    'country_uz': 'Узбекистан',
    'country_kg': 'Кыргызстан',
    'country_tj': 'Таджикистан',
    'country_tm': 'Туркменистан',
    'category_general': 'Обычные товары',
    'category_machinery': 'Оборудование',
    'category_textiles': 'Текстиль',
    'category_food': 'Продукты'
  }
};

// 切换语言的函数
function changeLanguage(lang) {
  // 获取所有需要翻译的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // 更新input的placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
  
  // 更新按钮的active状态
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`lang-${lang}`).classList.add('active');
  
  // 保存语言选择
  localStorage.setItem('preferred_language', lang);
}

// 页面加载时，读取上次选择的语言
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('preferred_language') || 'zh';
  changeLanguage(savedLang);
});