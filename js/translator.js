// 翻译数据
const translations = {
  'zh': {
    // 基础翻译
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
    
    // 联系我们 & 预约服务翻译
    'contact_title': '📞 联系我们',
    'contact_subtitle': '有任何需求？我们为您解决中国境内一切事务',
    'quick_contact': '📱 快速联系',
    'phone': '电话',
    'phone_hint': '24小时紧急联系',
    'email': '邮箱',
    'email_hint': '2小时内回复',
    'messenger': '即时通讯',
    'our_services': '🌟 我们提供的服务：',
    
    // 服务标签
    'service_factory': '🏭 厂家考察',
    'service_visa': '📄 签证邀请函',
    'service_translator': '🗣️ 翻译陪同',
    'service_transport': '🚗 接送机',
    'service_hotel': '🏨 酒店预订',
    'service_contract': '⚖️ 合同公证',
    
    // 表单相关
    'service_form_title': '📋 预约陪同服务',
    'form_intro': '请告诉我们您的需求，我们会尽快联系您',
    'form_name': '您的姓名 *',
    'form_phone': '联系电话/WhatsApp *',
    'form_country': '国家 *',
    'form_language': '语言偏好',
    'form_product': '感兴趣的商品 *',
    'form_visit_date': '预计来访时间',
    'form_services': '需要哪些协助？（可多选）',
    'form_contact_method': '联系偏好',
    'form_requests': '备注/特殊要求',
    'form_submit': '📤 提交预约',
    
    // 商品选择
    'select_country': '请选择',
    'select_product': '请选择商品',
    'product_excavator': '工程挖掘机',
    'product_textiles': '棉纺织品',
    'product_solar': '太阳能电池板',
    'product_noodles': '方便面',
    'product_other': '其他（请在备注说明）',
    
    // 语言选项
    'lang_ru': 'Русский',
    'lang_en': 'English',
    'lang_zh': '中文',
    
    // 国家名称
    'country_kz': '哈萨克斯坦',
    'country_uz': '乌兹别克斯坦',
    'country_kg': '吉尔吉斯斯坦',
    'country_tj': '塔吉克斯坦',
    'country_tm': '土库曼斯坦',
    
    // 商品类别
    'category_general': '普通商品',
    'category_machinery': '机械设备',
    'category_textiles': '纺织品',
    'category_food': '食品',
    
    // 成功提示
    'service_success_title': '✅ 预约已提交！',
    'service_success_text': '我们的客户经理会在2小时内联系您',
    'service_emergency': '紧急情况请直接联系：+86 123 4567 890 (微信同号)',
    
    // 页脚
    'footer_text': '© 2024 中亚贸易网 - 中国到中亚五国贸易服务'
  },
  
  'ru': {
    // 基础翻译
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
    
    // 联系我们 & 预约服务翻译
    'contact_title': '📞 Свяжитесь с нами',
    'contact_subtitle': 'Есть вопросы? Мы решим все вопросы в Китае',
    'quick_contact': '📱 Быстрая связь',
    'phone': 'Телефон',
    'phone_hint': 'Круглосуточно',
    'email': 'Email',
    'email_hint': 'Ответ в течение 2 часов',
    'messenger': 'Мессенджеры',
    'our_services': '🌟 Наши услуги:',
    
    // 服务标签
    'service_factory': '🏭 Осмотр заводов',
    'service_visa': '📄 Приглашение на визу',
    'service_translator': '🗣️ Перевод',
    'service_transport': '🚗 Трансфер',
    'service_hotel': '🏨 Бронирование отелей',
    'service_contract': '⚖️ Юридическая помощь',
    
    // 表单相关
    'service_form_title': '📋 Запись на обслуживание',
    'form_intro': 'Сообщите нам свои потребности, мы свяжемся с вами',
    'form_name': 'Ваше имя *',
    'form_phone': 'Телефон/WhatsApp *',
    'form_country': 'Страна *',
    'form_language': 'Язык',
    'form_product': 'Интересующий товар *',
    'form_visit_date': 'Планируемая дата',
    'form_services': 'Какая помощь нужна?',
    'form_contact_method': 'Способ связи',
    'form_requests': 'Особые пожелания',
    'form_submit': '📤 Отправить заявку',
    
    // 商品选择
    'select_country': 'Выберите страну',
    'select_product': 'Выберите товар',
    'product_excavator': 'Экскаватор',
    'product_textiles': 'Ткани',
    'product_solar': 'Солнечные панели',
    'product_noodles': 'Лапша',
    'product_other': 'Другое',
    
    // 语言选项
    'lang_ru': 'Русский',
    'lang_en': 'English',
    'lang_zh': '中文',
    
    // 国家名称
    'country_kz': 'Казахстан',
    'country_uz': 'Узбекистан',
    'country_kg': 'Кыргызстан',
    'country_tj': 'Таджикистан',
    'country_tm': 'Туркменистан',
    
    // 商品类别
    'category_general': 'Обычные товары',
    'category_machinery': 'Оборудование',
    'category_textiles': 'Текстиль',
    'category_food': 'Продукты',
    
    // 成功提示
    'service_success_title': '✅ Заявка отправлена!',
    'service_success_text': 'Наш менеджер свяжется с вами в течение 2 часов',
    'service_emergency': 'Срочно: +86 123 4567 890 (WeChat)',
    
    // 页脚
    'footer_text': '© 2024 Central Asia Trade - Услуги торговли'
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
  
  // 更新select里的option
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // 更新按钮的active状态
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`lang-${lang}`).classList.add('active');
  
  // 保存语言选择
  localStorage.setItem('preferred_language', lang);
  
  // 触发语言改变事件（用于其他组件）
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// 页面加载时，读取上次选择的语言
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('preferred_language') || 'zh';
  changeLanguage(savedLang);
});