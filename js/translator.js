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
    'calculator_title': '关税计算器',
    'calc_product_price': '商品价格 (美元)',
    'calc_weight': '重量 (kg)',
    'calc_country': '目的国家',
    'calc_category': '商品类别',
    'calc_btn': '计算总费用',
    'result_title': '计算结果',

    // 服务承诺翻译
    'promise_factory': '🏭 有意向？直接带您去厂家考察！',
    'promise_detail': '看中商品后，我亲自陪同您前往工厂实地考察，现场洽谈，确保交易透明放心。',
    
    // 微信相关翻译
    'wechat_title': '📱 添加我的微信',
    'wechat_id_label': '微信号：',
    'copy_btn': '复制微信号',
    'quick_contact_title': '⚡ 快速联系',
    'response_time': '⏰ 通常 5 分钟内回复',
    
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
    'footer_text': '© 2024 中亚贸易网 - 中国到中亚五国贸易服务',
    
    // ===== 铁路网络模块翻译 =====
    'rail_title': '🚂 中国-中亚铁路网络',
    'rail_subtitle': '覆盖中亚五国的铁路运输线路，助您货物通达',
    'partners_title': '🌟 战略合作伙伴',
    'routes_title': '📋 主要铁路线路',
    'route_origin': '始发城市',
    'route_destination': '目的城市/站',
    'route_country': '目的国家',
    'route_port': '出境口岸',
    'route_time': '运输时效',
    'route_operator': '承运方/线路',
    'rail_note': '※ 以上线路信息基于中铁集装箱2026年招标结果及实际运营数据，可扫码微信咨询具体运价和班期',
    
    // 铁路时间翻译
    'days_18_20': '18-20天',
    'days_12_15': '12-15天',
    'days_10_12': '10-12天',
    'days_8_10': '8-10天',
    'days_13_16': '13-16天',
    'days_18_25': '18-25天',
    'days_22_tour': '22天（旅游）',
    'days_5_6': '5-6天',
    
    // 铁路站点和路线翻译
    'dushanbe_station': '杜尚别-2站',
    'via_kyrgyzstan': '经吉尔吉斯斯坦',
    'almaty_1': '阿拉木图-1',
    'sergeli': '谢尔盖利',
    'chukursay': '丘库尔赛',
    'burendai': '布伦代',
    'zhetysu': '热特苏',
    'atengli_dostyk': '阿腾科里/多斯特克',
    'beijing_xian_dunhuang': '北京/西安/敦煌',
    'almaty_tashkent': '阿拉木图/塔什干',
    'kz_uz': '哈/乌',
    'air_rail': '航空+铁路',
    'china_cities': '中国各城市',
    'transcaspian': '跨里海（中间走廊）',
    'via_azerbaycan_georgia': '经阿塞拜疆/格鲁吉亚',
    'aktau_baku': '阿克套/巴库',
    
    // 合作伙伴名称
    'partner_crct': '中铁集装箱',
    'partner_crct_desc': 'CRCT',
    'partner_crceg': '中铁建工集团',
    'partner_crceg_desc': 'CRCEG',
    'partner_cosco': '中远海运',
    'partner_cosco_desc': 'COSCO',
    'partner_shandong': '山东高速齐鲁',
    'partner_shandong_desc': '欧亚班列',
    'partner_xinjiang': '新疆哈铁资',
    'partner_xinjiang_desc': '国际物流',
    'partner_hubei': '湖北铁路集团',
    'partner_hubei_desc': '国际联运',
    'partner_caspian': 'Caspian express',
    'partner_caspian_desc': '中亚物流',
    'partner_ptc': 'PTC Cargo',
    'partner_ptc_desc': '多式联运',
    'partner_atasu': 'Atasu Global',
    'partner_atasu_desc': 'Trans',
    'partner_utk': 'UTK Logistics',
    'partner_utk_desc': '中乌合资',
    'partner_golden': 'Golden Eagle',
    'partner_golden_desc': '豪华专列',
    'partner_ksira': 'Ksira Logistics',
    'partner_ksira_desc': 'LLC',
    
    // 合作伙伴全名（用于表格）
    'partner_crct_participate': '中铁集装箱参与',
    'partner_utk_full': 'UTK International Logistics',
    'partner_hubei_full': '湖北铁路集团',
    'partner_xinjiang_full': '新疆哈铁资国际物流',
    'partner_shandong_full': '山东高速齐鲁欧亚班列',
    'partner_ptc_full': 'PTC Cargo',
    'partner_caspian_full': 'Caspian express',
    'partner_ksira_full': 'Ksira Logistics',
    'partner_atasu_full': 'Atasu Global Trans',
    'partner_golden_full': 'Golden Eagle Luxury Trains',
    
    // 城市名称
    'tianjin': '天津',
    'qingdao': '青岛',
    'shanghai': '上海',
    'shenzhen': '深圳',
    'yiwu': '义乌',
    'urumqi': '乌鲁木齐',
    'xian': '西安',
    'chengdu': '成都',
    'khorgos': '霍尔果斯',
    'kashi': '喀什',
    'lanzhou': '兰州',
    'wuhan': '武汉（香炉山站）',
    'beijing': '北京',
    'dunhuang': '敦煌',
    'almaty': '阿拉木图',
    'tashkent': '塔什干',
    'bishkek': '比什凯克',
    'dushanbe': '杜尚别',
    'ashgabat': '阿什哈巴德',
    'dostyk': '多斯特克',
    'atengli': '阿腾科里'
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
    'calculator_title': 'Калькулятор пошлин',
    'calc_product_price': 'Цена товара (USD)',
    'calc_weight': 'Вес (кг)',
    'calc_country': 'Страна назначения',
    'calc_category': 'Категория товара',
    'calc_btn': 'Рассчитать стоимость',
    'result_title': 'Результат',

    // 服务承诺翻译
    'promise_factory': '🏭 Заинтересованы? Организую поездку на завод!',
    'promise_detail': 'После выбора товара я лично сопровожу вас на завод для переговоров, гарантируя прозрачность сделки.',
    
    // 微信相关翻译
    'wechat_title': '📱 Добавить в WeChat',
    'wechat_id_label': 'WeChat ID:',
    'copy_btn': 'Копировать',
    'quick_contact_title': '⚡ Быстрая связь',
    'response_time': '⏰ Ответ в течение 5 минут',
    
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
    'footer_text': '© 2024 Central Asia Trade - Услуги торговли',
    
    // ===== 铁路网络模块翻译 =====
    'rail_title': '🚂 Железнодорожная сеть Китай-Центральная Азия',
    'rail_subtitle': 'Маршруты, охватывающие все пять стран Центральной Азии',
    'partners_title': '🌟 Стратегические партнеры',
    'routes_title': '📋 Основные маршруты',
    'route_origin': 'Город отправления',
    'route_destination': 'Станция назначения',
    'route_country': 'Страна назначения',
    'route_port': 'Пограничный переход',
    'route_time': 'Срок доставки',
    'route_operator': 'Оператор',
    'rail_note': '※ Данные основаны на результатах тендера CRCT 2026 и операционных данных, свяжитесь с нами для получения информации о ставках и расписании',
    
    // 铁路时间翻译
    'days_18_20': '18-20 дней',
    'days_12_15': '12-15 дней',
    'days_10_12': '10-12 дней',
    'days_8_10': '8-10 дней',
    'days_13_16': '13-16 дней',
    'days_18_25': '18-25 дней',
    'days_22_tour': '22 дня (туристический)',
    'days_5_6': '5-6 дней',
    
    // 铁路站点和路线翻译
    'dushanbe_station': 'Душанбе-2',
    'via_kyrgyzstan': 'через Кыргызстан',
    'almaty_1': 'Алматы-1',
    'sergeli': 'Сергели',
    'chukursay': 'Чукурсай',
    'burendai': 'Бурендай',
    'zhetysu': 'Жетысу',
    'atengli_dostyk': 'Атенгли/Достык',
    'beijing_xian_dunhuang': 'Пекин/Сиань/Дуньхуан',
    'almaty_tashkent': 'Алматы/Ташкент',
    'kz_uz': 'КЗ/УЗ',
    'air_rail': 'Авиа+ЖД',
    'china_cities': 'Города Китая',
    'transcaspian': 'Транскаспийский коридор',
    'via_azerbaycan_georgia': 'через Азербайджан/Грузию',
    'aktau_baku': 'Актау/Баку',
    
    // 合作伙伴名称
    'partner_crct': 'CRCT',
    'partner_crct_desc': 'Китайская контейнерная компания',
    'partner_crceg': 'CRCEG',
    'partner_crceg_desc': 'Строительная группа',
    'partner_cosco': 'COSCO',
    'partner_cosco_desc': 'Судоходная компания',
    'partner_shandong': 'Shandong Hi-Speed',
    'partner_shandong_desc': 'Евразийский поезд',
    'partner_xinjiang': 'Xinjiang Hatiezi',
    'partner_xinjiang_desc': 'Международная логистика',
    'partner_hubei': 'Hubei Railway',
    'partner_hubei_desc': 'Международные перевозки',
    'partner_caspian': 'Caspian express',
    'partner_caspian_desc': 'Логистика в ЦА',
    'partner_ptc': 'PTC Cargo',
    'partner_ptc_desc': 'Мультимодальные',
    'partner_atasu': 'Atasu Global',
    'partner_atasu_desc': 'Trans',
    'partner_utk': 'UTK Logistics',
    'partner_utk_desc': 'Китайско-узбекское СП',
    'partner_golden': 'Golden Eagle',
    'partner_golden_desc': 'Люкс поезд',
    'partner_ksira': 'Ksira Logistics',
    'partner_ksira_desc': 'LLC',
    
    // 合作伙伴全名（用于表格）
    'partner_crct_participate': 'Участие CRCT',
    'partner_utk_full': 'UTK International Logistics',
    'partner_hubei_full': 'Hubei Railway Group',
    'partner_xinjiang_full': 'Xinjiang Hatiezi International Logistics',
    'partner_shandong_full': 'Shandong Hi-Speed Qilu Eurasia',
    'partner_ptc_full': 'PTC Cargo',
    'partner_caspian_full': 'Caspian express',
    'partner_ksira_full': 'Ksira Logistics',
    'partner_atasu_full': 'Atasu Global Trans',
    'partner_golden_full': 'Golden Eagle Luxury Trains',
    
    // 城市名称
    'tianjin': 'Тяньцзинь',
    'qingdao': 'Циндао',
    'shanghai': 'Шанхай',
    'shenzhen': 'Шэньчжэнь',
    'yiwu': 'Иу',
    'urumqi': 'Урумчи',
    'xian': 'Сиань',
    'chengdu': 'Чэнду',
    'khorgos': 'Хоргос',
    'kashi': 'Кашгар',
    'lanzhou': 'Ланьчжоу',
    'wuhan': 'Ухань (ст. Сянлушань)',
    'beijing': 'Пекин',
    'dunhuang': 'Дуньхуан',
    'almaty': 'Алматы',
    'tashkent': 'Ташкент',
    'bishkek': 'Бишкек',
    'dushanbe': 'Душанбе',
    'ashgabat': 'Ашхабад',
    'dostyk': 'Достык',
    'atengli': 'Атенгли'
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