/* Данные каталога iFIX: реальные модели Apple (актуально на конец 2026 года),
   объёмы памяти соответствуют официальным вариантам. */
const catalog = {
  groups: [
    ['iPhone 17', {
      'iPhone 17 Pro Max': [256, 512, 1024, 2048],
      'iPhone 17 Pro': [256, 512, 1024],
      'iPhone 17': [256, 512],
      'iPhone Air': [256, 512, 1024]
    }],
    ['iPhone 16', {
      'iPhone 16 Pro Max': [256, 512, 1024],
      'iPhone 16 Pro': [128, 256, 512, 1024],
      'iPhone 16 Plus': [128, 256, 512],
      'iPhone 16': [128, 256, 512],
      'iPhone 16e': [128, 256, 512]
    }],
    ['iPhone 15', {
      'iPhone 15 Pro Max': [256, 512, 1024],
      'iPhone 15 Pro': [128, 256, 512, 1024],
      'iPhone 15 Plus': [128, 256, 512],
      'iPhone 15': [128, 256, 512]
    }],
    ['iPhone 14', {
      'iPhone 14 Pro Max': [128, 256, 512, 1024],
      'iPhone 14 Pro': [128, 256, 512, 1024],
      'iPhone 14 Plus': [128, 256, 512],
      'iPhone 14': [128, 256, 512]
    }],
    ['iPhone 13', {
      'iPhone 13 Pro Max': [128, 256, 512, 1024],
      'iPhone 13 Pro': [128, 256, 512, 1024],
      'iPhone 13': [128, 256, 512],
      'iPhone 13 mini': [128, 256, 512]
    }],
    ['iPhone 12', {
      'iPhone 12 Pro Max': [128, 256, 512],
      'iPhone 12 Pro': [128, 256, 512],
      'iPhone 12': [64, 128, 256],
      'iPhone 12 mini': [64, 128, 256]
    }],
    ['iPhone 11', {
      'iPhone 11 Pro Max': [64, 256, 512],
      'iPhone 11 Pro': [64, 256, 512],
      'iPhone 11': [64, 128, 256]
    }],
    ['iPhone X, 8 и 7', {
      'iPhone XR': [64, 128, 256],
      'iPhone XS Max': [64, 256, 512],
      'iPhone XS': [64, 256, 512],
      'iPhone X': [64, 256],
      'iPhone 8 Plus': [64, 128, 256],
      'iPhone 8': [64, 128, 256],
      'iPhone 7 Plus': [32, 128, 256],
      'iPhone 7': [32, 128, 256]
    }],
    ['iPhone 6 и старше', {
      'iPhone 6s Plus': [16, 32, 64, 128],
      'iPhone 6s': [16, 32, 64, 128],
      'iPhone 6 Plus': [16, 64, 128],
      'iPhone 6': [16, 32, 64, 128],
      'iPhone SE (1-го поколения)': [16, 32, 64, 128],
      'iPhone 5s': [16, 32, 64],
      'iPhone 5c': [8, 16, 32],
      'iPhone 5': [16, 32, 64]
    }]
  ]
};

const conditions = [
  ['Как новый', 'Работает, без заметных следов использования'],
  ['Бывший в употреблении', 'Царапины на корпусе или экране'],
  ['Требует ремонта', 'Разбит дисплей или телефон не включается']
];

/* Приводим запрос к устойчивому виду: латиница/кириллица, объём памяти, тире. */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/айфон/g, 'iphone')
    .replace(/про/g, 'pro')
    .replace(/плюс/g, 'plus')
    .replace(/мини/g, 'mini')
    .replace(/макс/g, 'max')
    .replace(/(\d)\s?(тб|tb)/g, '$1tb')
    .replace(/(\d)\s?(гб|gb)/g, '$1gb')
    .replace(/(\d+)(tb|gb)/g, ' $1$2 ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Отдельное слово запроса «256» ищем и в объёме 256 ГБ / 256 ТБ. */
function wordMatches(word, haystack) {
  if (haystack.includes(word)) return true;
  return /^\d+$/.test(word) && new RegExp(word + '(gb|tb)').test(haystack);
}

/* Все слова запроса должны найтись в названии или в объёмах памяти модели. */
function matchModel(name, sizes, query) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(name + ' ' + sizes.map(size => size >= 1024 ? '1tb' : size + 'gb').join(' '));
  return words.every(word => wordMatches(word, haystack));
}

const phones = catalog.groups.flatMap(([family, entries]) =>
  Object.entries(entries).map(([name, sizes]) => ({ name, sizes, family })));

if (typeof module !== 'undefined') module.exports = { catalog, conditions, phones, normalize, matchModel };
