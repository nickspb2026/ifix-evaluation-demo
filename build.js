const fs = require('fs');
const path = require('path');

const root = __dirname;
const src = path.join(root, 'src');
const assets = path.join(root, 'assets');
const read = file => fs.readFileSync(path.join(src, file), 'utf8');
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const { catalog } = require(path.join(src, 'catalog.js'));

const pages = [
  { file: 'index.html', title: 'Скупка iPhone, ремонт и Trade-In в Петербурге', desc: 'Скупка iPhone и цифровой техники, ремонт и Trade-In в двух сервисных центрах iFIX. Оценка по модели и состоянию, бесплатная диагностика.' },
  { file: 'skupka.html', title: 'Скупка техники', desc: 'Выкуп iPhone, смартфонов, планшетов, ноутбуков и фотоаппаратов в Петербурге. Оценка по модели и состоянию, оплата на месте.' },
  { file: 'remont.html', title: 'Ремонт цифровой техники', desc: 'Ремонт смартфонов, планшетов, ноутбуков и техники Apple в iFIX. Бесплатная диагностика, гарантия до 12 месяцев.' },
  { file: 'trade-in.html', title: 'Trade-In', desc: 'Обмен старой техники на новую с доплатой в сервисных центрах iFIX в Петербурге.' },
  { file: 'kontakty.html', title: 'Адреса и контакты', desc: 'Сервисные центры iFIX: Коломяжский пр., 17 и Звенигородская ул., 1 к2. Ежедневно 10:00-21:00 (в демо примерные часы).' }
];

const page = (active, title, desc, body) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} · iFIX</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0f4d3f">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)} · iFIX">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="assets/og.jpg">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230f4d3f'/%3E%3Ctext x='32' y='43' font-family='Helvetica,Arial' font-size='30' font-weight='800' fill='%23ff7a3c' text-anchor='middle'%3EiFIX%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<a class="skip" href="#main">Перейти к содержимому</a>

<header class="topbar">
  <div class="wrap">
    <a class="logo" href="index.html">i<b>FIX</b><small>сервис в Петербурге</small></a>
    <nav class="nav" id="nav" aria-label="Основная навигация">
      ${navLinks(active)}
    </nav>
    <a class="topbar-phone" href="tel:+78129899890">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
      +7 (812) 989-98-90
    </a>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Меню">
      <span></span>
    </button>
  </div>
</header>

<main id="main">
${body}
</main>

${footer()}

${sheet()}

<script>var catalog = ${JSON.stringify(catalog)};</script>
<script>${read('catalog.js').replace("const catalog =", 'var catalogData =').replace(/if \(typeof module[\s\S]*$/m, '')}</script>
<script>${read('app.js')}</script>
</body>
</html>
`;

function navLinks(active) {
  const links = [
    ['index.html', 'Скупка'],
    ['remont.html', 'Ремонт'],
    ['trade-in.html', 'Trade-In'],
    [active === 'index.html' ? '#locations' : 'kontakty.html#addresses', 'Адреса'],
    [active === 'index.html' ? '#faq' : 'index.html#faq', 'Вопросы']
  ];
  return links.map(([href, label]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ');
}

function footer() {
  return `<footer class="footer">
  <div class="wrap">
    <div>
      <a class="logo" href="index.html">i<b>FIX</b></a>
      <p>Сервисный центр в Санкт-Петербурге: скупка iPhone и цифровой техники, ремонт и Trade-In. Два адреса, ежедневная работа.</p>
    </div>
    <div>
      <h4>Разделы</h4>
      <ul>
        <li><a href="index.html">Скупка</a></li>
        <li><a href="remont.html">Ремонт</a></li>
        <li><a href="trade-in.html">Trade-In</a></li>
        <li><a href="kontakty.html">Адреса и контакты</a></li>
      </ul>
    </div>
    <div>
      <h4>Контакты</h4>
      <ul>
        <li><a href="tel:+78129899890">+7 (812) 989-98-90</a></li>
        <li><a href="tel:+79522469890">+7 (952) 246-98-90</a></li>
        <li><a href="mailto:info@ifix-spb.ru">info@ifix-spb.ru</a></li>
        <li>Коломяжский пр., 17</li>
        <li>Звенигородская ул., 1 к2</li>
      </ul>
    </div>
  </div>
  <div class="wrap legal">
    <span>Демонстрационная версия сайта для iFIX</span>
    <span>Телефоны, адреса и услуги совпадают с ifix-spb.ru</span>
    <span>Фото: Apple Newsroom</span>
  </div>
</footer>`;
}

function sheet() {
  return `<dialog class="sheet" id="sheet" aria-labelledby="sheet-title">
  <div class="sheet-body">
    <div class="sheet-head">
      <div>
        <h2 id="sheet-title">Заявка</h2>
        <p id="sheet-lead"></p>
      </div>
      <button class="sheet-close" id="sheet-close" type="button" aria-label="Закрыть">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <form id="sheet-form" novalidate>
      <label class="field-label" style="margin-top:14px">Модель и устройство
        <input id="s-model" type="text" autocomplete="off" maxlength="80" placeholder="iPhone 13 Pro, 256 ГБ">
      </label>
      <label class="field-label" style="margin-top:12px"><span id="s-detail-label">Что случилось с устройством?</span>
        <textarea id="s-detail" rows="3" maxlength="400" placeholder="Опишите неисправность или что хотите поменять"></textarea>
      </label>
      <label class="field-label" style="margin-top:12px">Телефон для связи
        <input id="s-phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="22" placeholder="+7 000 000-00-00" required>
      </label>
      <p class="field-hint">Демонстрационная версия: заявка никуда не отправляется.</p>
      <p class="error" id="s-error" role="alert"></p>
      <button class="btn btn-primary" style="margin-top:14px" type="submit">Собрать заявку</button>
    </form>
    <div class="result" id="sheet-result">
      <p style="color:var(--mute);font-size:15px;margin-top:14px">Готовый текст заявки для мастера:</p>
      <pre class="ticket is-visible" id="sheet-ticket"></pre>
      <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
        <button class="btn btn-light" id="sheet-copy" type="button">Скопировать</button>
        <button class="btn btn-light" id="sheet-edit" type="button">Изменить</button>
      </div>
    </div>
  </div>
</dialog>`;
}

/* ---------- Страницы ---------- */

const modelTable = () => {
  const rows = [];
  for (const [family, entries] of catalog.groups) {
    for (const [name, sizes] of Object.entries(entries)) {
      const label = sizes.map(size => size >= 1024 ? (size / 1024) + ' ТБ' : size + ' ГБ').join(', ');
      rows.push(`<tr><td>${esc(family)}</td><td><strong>${esc(name)}</strong></td><td>${label}</td></tr>`);
    }
  }
  return `<div class="table-wrap"><table class="models-table"><thead><tr><th>Поколение</th><th>Модель</th><th>Объём памяти</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
};

const ctaBand = () => `<section class="section tight">
    <div class="wrap">
      <div class="cta-band reveal">
        <div>
          <h2>Не хотите заполнять форму?</h2>
          <p>Позвоните в сервис, мастер ответит на вопросы и подскажет, когда приехать.</p>
        </div>
        <div class="cta-band-actions">
          <a class="btn btn-primary" href="tel:+78129899890">+7 (812) 989-98-90</a>
          <a class="btn btn-light" href="tel:+79522469890">+7 (952) 246-98-90</a>
        </div>
      </div>
    </div>
  </section>`;

const locationsBlock = () => `<section class="section" id="locations">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="kicker">Адреса</p>
        <h2>Куда привезти устройство</h2>
        <p>Часы работы в демо показываем как пример: ежедневно 10:00-21:00, уточним у собственника. Наличные и оплата на карту на месте.</p>
      </div>
      <div class="locations">
        <article class="location-card reveal">
          <div class="lc-body">
            <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Пионерская</h3>
            <p>Санкт-Петербург, Коломяжский проспект, 17<br>ТК «Карусель», 2 этаж, у эскалатора</p>
            <div class="lc-meta"><span class="badge">Ежедневно 10:00-21:00</span><span class="badge">Метро Пионерская</span></div>
            <div class="lc-actions">
              <a class="btn btn-light" href="https://yandex.ru/maps/?text=Санкт-Петербург%2C%20Коломяжский%20проспект%2C%2017">Маршрут</a>
              <a class="btn btn-light" href="tel:+78129899890">Позвонить</a>
            </div>
          </div>
        </article>
        <article class="location-card reveal">
          <div class="lc-body">
            <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>Звенигородская</h3>
            <p>Санкт-Петербург, Звенигородская улица, 1 к2<br>ТК «Звенигородский», 2 этаж</p>
            <div class="lc-meta"><span class="badge">Ежедневно 10:00-21:00</span><span class="badge">Метро Звенигородская</span></div>
            <div class="lc-actions">
              <a class="btn btn-light" href="https://yandex.ru/maps/?text=Санкт-Петербург%2C%20Звенигородская%20улица%2C%201%20к2">Маршрут</a>
              <a class="btn btn-light" href="tel:+79522469890">Мобильный</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>`;

const faqBlock = (items) => `<section class="section alt" id="faq">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="kicker">Вопросы</p>
        <h2>Что чаще всего спрашивают</h2>
      </div>
      <div class="faq reveal">
        ${items.map(([q, a], index) => `<details${index === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const indexBody = fs.readFileSync(path.join(src, 'index.html'), 'utf8')
  .match(/<main id="main">([\s\S]*)<\/main>/)[1]
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .trim();

const skupkaBody = fs.readFileSync(path.join(src, 'index.html'), 'utf8')
  .match(/<main id="main">([\s\S]*)<\/main>/)[1]
  .trim();


const remontBody = `
  <section class="hero hero-page">
    <div class="wrap">
      <div>
        <p class="eyebrow"><i></i>Ремонт в iFIX</p>
        <h1>Ремонт смартфонов, планшетов и ноутбуков</h1>
        <p class="hero-lead">Бесплатная диагностика, оригинальные запчасти или их качественные аналоги, гарантия до 12 месяцев. Большинство ремонтов делаем в день обращения.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" data-request="repair">Заказать диагностику</button>
          <a class="btn btn-ghost" href="tel:+78129899890" style="color:#fff">Позвонить</a>
        </div>
      </div>
      <img class="hero-photo" src="assets/bench.jpg" alt="Смартфон на рабочем столе сервисной мастерской" width="900" height="600">
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="kicker">Что чиним</p>
        <h2>Частые неисправности</h2>
        <p>Если поломки нет в списке, опишите её в заявке: мастер ответит, берёмся ли за такой случай.</p>
      </div>
      <div class="services">
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg></div>
          <h3>Дисплеи</h3>
          <p>Замена экранов смартфонов и планшетов, матриц ноутбуков. Подбираем вариант по бюджету.</p>
        </article>
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M12 9v6M9 12h6"/></svg></div>
          <h3>Питание и зарядка</h3>
          <p>Аккумуляторы, разъёмы зарядки, цепи питания. Проверяем, почему устройство не держит заряд.</p>
        </article>
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/></svg></div>
          <h3>Последствия залития</h3>
          <p>Чистка платы, восстановление контактов, замена микрочипов. Чем раньше принести, тем выше шанс.</p>
        </article>
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h2M7 14h6M15 10h2"/></svg></div>
          <h3>Корпус и клавиатура</h3>
          <p>Замена клавиатур ноутбуков, корпусов, чистка системы охлаждения и замена термопасты.</p>
        </article>
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8a4 4 0 0 1 0 8"/></svg></div>
          <h3>Камеры и динамики</h3>
          <p>Модули камер, динамики, разговорные микрофоны и вибромоторы.</p>
        </article>
        <article class="service-card reveal">
          <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg></div>
          <h3>Платы и BGA</h3>
          <p>Сложная пайка, восстановление после неаккуратного ремонта, работа с микросхемами.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      <div class="how reveal">
        <img src="assets/bench.jpg" alt="Рабочее место мастера" loading="lazy" width="900" height="600">
        <div>
          <p class="kicker">Как проходит ремонт</p>
          <h2 style="font-size:clamp(26px,3.2vw,38px);letter-spacing:-.035em;font-weight:720">От диагностики до гарантии</h2>
          <ol class="steps-list" style="margin-top:18px">
            <li><div><b>Описываете проблему</b><span>По телефону или в заявке на сайте. Можно сразу назвать модель.</span></div></li>
            <li><div><b>Приносите устройство</b><span>Диагностика бесплатная. Мастер называет причину и стоимость до начала работ.</span></div></li>
            <li><div><b>Согласуете ремонт</b><span>Если ремонт нецелесообразен, честно скажем и предложим варианты, включая выкуп на запчасти.</span></div></li>
            <li><div><b>Забираете с гарантией</b><span>На работы и комплектующие даём гарантию до 12 месяцев.</span></div></li>
          </ol>
          <button class="btn btn-primary" style="margin-top:18px" type="button" data-request="repair">Заказать диагностику</button>
        </div>
      </div>
    </div>
  </section>
${locationsBlock()}
${faqBlock([
  ['Ремонт платный, если мастер отказался?', 'Диагностика бесплатная. Если после осмотра вы решите не ремонтировать, платить за диагностику не нужно.'],
  ['Сколько занимает ремонт?', 'Большинство работ выполняем в день обращения. Сложные случаи, например плата после залития, требуют больше времени, и мастер заранее согласует сроки.'],
  ['Даёте ли гарантию?', 'Да, до 12 месяцев на работы и комплектующие. Гарантийный случай принимаем без спора, если поломка не связана с новыми повреждениями.'],
  ['Ремонтируете технику Apple?', 'Да: iPhone, iPad, MacBook и Apple Watch. Также работаем с Samsung, Xiaomi, Honor и другими брендами.']
])}
${ctaBand()}`;

const tradeBody = `
  <section class="hero hero-page">
    <div class="wrap">
      <div>
        <p class="eyebrow"><i></i>Trade-In в iFIX</p>
        <h1>Обмен техники с доплатой</h1>
        <p class="hero-lead">Сдайте старое устройство и засчитайте его стоимость в покупку нового или восстановленного. Принимаем телефоны, планшеты, ноутбуки, фототехнику и аксессуары.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" type="button" data-request="trade">Подготовить обмен</button>
          <a class="btn btn-ghost" href="tel:+78129899890" style="color:#fff">Позвонить</a>
        </div>
      </div>
      <img class="hero-photo" src="assets/phone-2.jpg" alt="Смартфон на столе мастерской" width="360" height="360">
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="kicker">Как это работает</p>
        <h2>Три шага к обмену</h2>
      </div>
      <ol class="steps-list reveal" style="max-width:820px">
        <li><div><b>Приносите устройство</b><span>Телефон, планшет, ноутбук, фотоаппарат или аксессуар. Устройство может быть нерабочим.</span></div></li>
        <li><div><b>Получаете оценку</b><span>Мастер проводит бесплатную диагностику и называет стоимость сданного устройства и размер скидки.</span></div></li>
        <li><div><b>Выбираете новое</b><span>Стоимость старого засчитывается в покупку. Доплачиваете только разницу.</span></div></li>
      </ol>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      <div class="section-head reveal">
        <p class="kicker">Что принимаем</p>
        <h2>Техника любых брендов</h2>
        <p>Apple, Samsung, Xiaomi, Honor, ASUS, HP, Lenovo и другие. Состояние не имеет значения: рабочие и нерабочие устройства.</p>
      </div>
      <div class="reasons">
        <div class="reason reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 5.5h2"/></svg><b>Смартфоны и планшеты</b><span>Любые бренды, включая нерабочие.</span></div>
        <div class="reason reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M2 19h20"/></svg><b>Ноутбуки и моноблоки</b><span>Рабочие и с неисправностями.</span></div>
        <div class="reason reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg><b>Фото- и видеотехника</b><span>Камеры, объективы, аксессуары.</span></div>
        <div class="reason reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="16" cy="12" r="2"/><path d="M6 10h4"/></svg><b>Приставки и часы</b><span>Игровые приставки, смарт-часы.</span></div>
      </div>
      <button class="btn btn-primary" style="margin-top:26px" type="button" data-request="trade">Подготовить обмен</button>
    </div>
  </section>
${locationsBlock()}
${ctaBand()}`;

const contaktyBody = `
  <section class="section" style="padding-top:44px">
    <div class="wrap">
      <div class="section-head">
        <p class="kicker">Контакты</p>
        <h1 style="font-size:clamp(30px,4vw,46px);letter-spacing:-.04em;font-weight:730;line-height:1.08">Два сервисных центра iFIX</h1>
        <p>Часы работы в демо примерные, ежедневно 10:00-21:00. Оплата наличными и на карту, бесплатная диагностика, гарантия до 12 месяцев на ремонт.</p>
      </div>
      <div class="locations">
        <article class="location-card reveal">
          <div class="lc-body">
            <h3>Пионерская</h3>
            <p>Санкт-Петербург, Коломяжский проспект, 17<br>ТК «Карусель», 2 этаж, у эскалатора</p>
            <div class="lc-meta"><span class="badge">Ежедневно 10:00-21:00</span><span class="badge">Метро Пионерская</span></div>
            <div class="lc-actions">
              <a class="btn btn-light" href="https://yandex.ru/maps/?text=Санкт-Петербург%2C%20Коломяжский%20проспект%2C%2017">Открыть на карте</a>
              <a class="btn btn-light" href="tel:+78129899890">+7 (812) 989-98-90</a>
            </div>
          </div>
        </article>
        <article class="location-card reveal">
          <div class="lc-body">
            <h3>Звенигородская</h3>
            <p>Санкт-Петербург, Звенигородская улица, 1 к2<br>ТК «Звенигородский», 2 этаж</p>
            <div class="lc-meta"><span class="badge">Ежедневно 10:00-21:00</span><span class="badge">Метро Звенигородская</span></div>
            <div class="lc-actions">
              <a class="btn btn-light" href="https://yandex.ru/maps/?text=Санкт-Петербург%2C%20Звенигородская%20улица%2C%201%20к2">Открыть на карте</a>
              <a class="btn btn-light" href="tel:+79522469890">+7 (952) 246-98-90</a>
            </div>
          </div>
        </article>
      </div>
      <div class="reasons" style="margin-top:26px">
        <div class="reason reveal"><b>Телефон</b><span><a href="tel:+78129899890">+7 (812) 989-98-90</a></span></div>
        <div class="reason reveal"><b>Мобильный</b><span><a href="tel:+79522469890">+7 (952) 246-98-90</a></span></div>
        <div class="reason reveal"><b>Почта</b><span><a href="mailto:info@ifix-spb.ru">info@ifix-spb.ru</a></span></div>
        <div class="reason reveal"><b>Связаться сейчас</b><span><a href="tel:+78129899890">Позвонить в сервис</a></span></div>
      </div>
    </div>
  </section>
${ctaBand()}`;

fs.writeFileSync(path.join(root, 'index.html'), page('index.html', pages[0].title, pages[0].desc, indexBody), 'utf8');
fs.writeFileSync(path.join(root, 'skupka.html'), page('index.html', pages[1].title, pages[1].desc, skupkaBody), 'utf8');
fs.writeFileSync(path.join(root, 'remont.html'), page('remont.html', pages[2].title, pages[2].desc, remontBody), 'utf8');
fs.writeFileSync(path.join(root, 'trade-in.html'), page('trade-in.html', pages[3].title, pages[3].desc, tradeBody), 'utf8');
fs.writeFileSync(path.join(root, 'kontakty.html'), page('kontakty.html', pages[4].title, pages[4].desc, contaktyBody), 'utf8');

console.log('built', fs.readdirSync(root).join(' '));
