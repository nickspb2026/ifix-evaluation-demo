/* Данные каталога iFIX: реальные модели Apple (актуально на конец 2026 года),
   объёмы памяти соответствуют официальным вариантам. */
const catalog = {
  groups: [
    ['iPhone 18', {
      'iPhone 18 Pro Max': [256, 512, 1024, 2048],
      'iPhone 18 Pro': [256, 512, 1024, 2048],
      'iPhone 18': [256, 512, 1024],
      'iPhone 17e': [256, 512],
      'iPhone Duo': [256, 512, 1024, 2048]
    }],
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

const GENERIC = new Set(['iphone', 'apple']);

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

const phones = catalog.groups.flatMap(([family, entries]) =>
  Object.entries(entries).map(([name, sizes]) => ({ name, sizes, family })));

/* Объём из запроса («128», «128gb», «1tb») сверяем с реальными вариантами модели. */
function sizeHasToken(sizes, word) {
  const digits = word.replace(/(gb|tb)$/, '');
  if (!/^\d+$/.test(digits)) return false;
  const need = Number(digits);
  if (/tb$/.test(word)) return sizes.includes(need * 1024);
  return sizes.includes(need);
}

/* Все слова запроса должны найтись в названии (отдельными токенами) или среди объёмов модели. */
function matchModel(name, sizes, query) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (!words.length) return true;

  const nameWords = normalize(name).split(' ').filter(Boolean);
  const vocab = new Set(['iphone', 'apple', 'pro', 'max', 'plus', 'mini', 'air', 'e', 'se', 'x', 'xs', 'xr',
    'c', 's'].concat(nameWords));
  if (!words.some(word => vocab.has(word))) return false;

  return words.every(word => {
    const digits = word.replace(/(gb|tb)$/, '');
    if (GENERIC.has(word)) return true;
    if (nameWords.includes(digits)) return true;
    if (/^\d+$/.test(digits)) return sizeHasToken(sizes, word);
    if (nameWords.includes(word)) return true;
    return word.length >= 3 && nameWords.some(token => token.startsWith(word));
  });
}

if (typeof module !== 'undefined') module.exports = { catalog, conditions, phones, normalize, matchModel };
