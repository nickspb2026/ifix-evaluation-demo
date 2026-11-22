(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const phoneDigits = value => value.replace(/\D/g, '');

  /* ---------- Хранение выбора ---------- */
  const state = { model: '', sizes: [], size: '', condition: '', name: '', phone: '' };

  const allModels = phones.map(phone => phone.name);
  const byName = name => phones.find(phone => phone.name === name);

  /* Подбираем модели по запросу, сохраняя исходный порядок (новые сверху). */
  function suggest(query, limit) {
    if (!query.trim()) return [];
    return phones
      .filter(phone => matchModel(phone.name, phone.sizes, query))
      .slice(0, limit);
  }

  function sizeLabel(value) {
    return value >= 1024 ? (value / 1024 === Math.round(value / 1024) ? value / 1024 : (value / 1024).toFixed(1)) + ' ТБ' : value + ' ГБ';
  }

  function findSize(label, sizes) {
    return sizes.find(size => sizeLabel(size) === label) || '';
  }

  /* ---------- Быстрая оценка в первом экране ---------- */
  const heroModel = $('hero-model');
  const heroSuggest = $('hero-suggest');
  const heroSizes = $('hero-sizes');
  const heroMemory = $('hero-memory');
  const heroConditions = $('hero-conditions');

  if (heroConditions) conditions.forEach(([title, note]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'qc-chip';
    button.dataset.value = title;
    button.textContent = title;
    button.title = note;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      state.condition = state.condition === title ? '' : title;
      syncQuick();
    });
    heroConditions.append(button);
  });

  function renderHeroSizes() {
    if (!heroSizes) return;
    heroSizes.replaceChildren();
    const model = byName(state.model);
    heroMemory.classList.toggle('is-visible', Boolean(model));
    if (!model) return;
    model.sizes.forEach(size => {
      const label = sizeLabel(size);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'qc-chip';
      button.dataset.value = label;
      button.textContent = label;
      button.setAttribute('aria-pressed', String(state.size === label));
      button.addEventListener('click', () => {
        state.size = state.size === label ? '' : label;
        syncQuick();
      });
      heroSizes.append(button);
    });
  }

  function syncQuick() {
    if (!heroModel) return;
    heroConditions.querySelectorAll('button').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.value === state.condition)));
    heroSizes.querySelectorAll('button').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.value === state.size)));
    if (state.model) heroModel.value = state.model + (state.size ? ' ' + state.size : '');
    const priceBox = $('hero-price');
    if (priceBox) {
      const selected = state.model
        ? state.model + (state.size && state.size !== 'Не знаю' ? ', ' + state.size : '')
        : '';
      priceBox.textContent = selected ? 'Выбрано: ' + selected + '. Продолжите, чтобы мастер назвал цену.' : '';
      priceBox.hidden = !selected;
    }
    syncCalc();
  }

  function closeSuggest() {
    heroSuggest.replaceChildren();
    heroModel.removeAttribute('aria-activedescendant');
  }

  function renderSuggest() {
    const matches = suggest(heroModel.value, 6);
    heroSuggest.replaceChildren();
    matches.forEach((phone, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'hero-option-' + index;
      button.setAttribute('role', 'option');
      const name = document.createElement('span');
      name.textContent = phone.name;
      const meta = document.createElement('small');
      meta.textContent = phone.sizes.map(sizeLabel).join(' · ');
      button.append(name, meta);
      button.addEventListener('click', () => {
        chooseModel(phone.name);
        closeSuggest();
      });
      heroSuggest.append(button);
    });
  }

  function chooseModel(name) {
    const phone = byName(name);
    if (!phone) return;
    if (state.model !== name) {
      state.model = name;
      state.sizes = phone.sizes;
      state.size = '';
    }
    renderHeroSizes();
    syncQuick();
  }

  heroModel?.addEventListener('input', () => {
    const typed = heroModel.value.trim().toLowerCase();
    const exact = allModels.find(name => name.toLowerCase() === typed);
    renderSuggest();
    if (exact) chooseModel(exact);
  });

  heroModel?.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSuggest();
    const options = [...heroSuggest.querySelectorAll('button')];
    const current = options.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      (current < 0 ? options[0] : options[Math.min(current + 1, options.length - 1)]).focus();
    }
    if (event.key === 'ArrowUp' && (current > 0 || (current === 0 && event.currentTarget === heroModel))) {
      event.preventDefault();
      if (current <= 0) heroModel.focus();
      else options[current - 1].focus();
    }
    if (event.key === 'Enter') {
      const target = current >= 0 ? options[current] : options[0];
      if (target) {
        event.preventDefault();
        target.click();
      }
    }
  });

  heroModel?.addEventListener('blur', () => setTimeout(closeSuggest, 150));

  $('quick')?.addEventListener('submit', event => {
    event.preventDefault();
    const typed = heroModel.value.trim();
    const exact = allModels.find(name => name.toLowerCase() === typed);
    if (exact) chooseModel(exact);
    if (!state.model && typed) {
      const first = suggest(typed, 1)[0];
      if (first) chooseModel(first.name);
    }
    syncCalc();
    const target = state.model ? $('quote') : $('hero-model');
    target.scrollIntoView({ block: 'start' });
    if (state.model) {
      setTimeout(() => (state.size ? $('phone') : $('sizes').querySelector('button'))?.focus({ preventScroll: true }), 450);
    }
  });

  /* ---------- Основной калькулятор ---------- */
  const modelsBox = $('models');
  const emptyBox = $('models-empty');
  const matchBox = $('match');
  const search = $('search');
  const sizesBox = $('sizes');
  const stepSize = $('step-size');
  const conditionsBox = $('conditions');
  const nameInput = $('name');
  const phoneInput = $('phone');
  const errorBox = $('error');

  if (conditionsBox) conditions.forEach(([title, note]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.value = title;
    button.setAttribute('aria-pressed', 'false');
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    const strong = document.createElement('b');
    strong.textContent = title;
    const small = document.createElement('small');
    small.textContent = note;
    text.append(strong, small);
    button.append(dot, text);
    button.addEventListener('click', () => {
      state.condition = state.condition === title ? '' : title;
      syncCalc();
    });
    conditionsBox.append(button);
  });

  function renderModels() {
    if (!modelsBox) return;
    const query = search.value;
    const matches = query.trim() ? phones.filter(phone => matchModel(phone.name, phone.sizes, query)) : phones;
    modelsBox.replaceChildren();
    matches.forEach(phone => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.value = phone.name;
      button.textContent = phone.name;
      button.setAttribute('aria-pressed', String(state.model === phone.name));
      button.addEventListener('click', () => {
        chooseModel(phone.name);
        if (state.model === phone.name && !state.size) $('sizes').querySelector('button')?.focus();
      });
      modelsBox.append(button);
    });
    emptyBox.hidden = matches.length > 0;
    matchBox.hidden = !(query.trim() && matches.length);
    if (query.trim() && matches.length) {
      matchBox.replaceChildren();
      const b = document.createElement('b');
      b.textContent = matches.length === 1 ? 'Нашли модель: ' : 'Подходят ' + matches.length + ' модели: ';
      const span = document.createElement('span');
      span.textContent = matches.length === 1 ? matches[0].name : 'выберите нужную в списке ниже';
      matchBox.append(b, span);
    }
  }

  function renderCalcSizes() {
    if (!stepSize) return;
    const model = byName(state.model);
    stepSize.hidden = !model;
    sizesBox.replaceChildren();
    if (!model) return;
    model.sizes.map(sizeLabel).concat('Не знаю').forEach(label => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'qc-chip';
      button.dataset.value = label;
      button.textContent = label;
      button.setAttribute('aria-pressed', String(state.size === label));
      button.addEventListener('click', () => {
        state.size = label;
        syncCalc();
      });
      sizesBox.append(button);
    });
  }

  function summaryContact() {
    const parts = [];
    if (state.name.trim()) parts.push(state.name.trim());
    if (state.phone.trim()) parts.push(state.phone.trim());
    return parts.join(', ');
  }

  function syncCalc() {
    if (!modelsBox) return;
    $('out-model').textContent = state.model;
    $('out-size').textContent = state.size;
    $('out-condition').textContent = state.condition;
    $('out-contact').textContent = summaryContact();
    modelsBox.querySelectorAll('button').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.value === state.model)));
    conditionsBox.querySelectorAll('button').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.value === state.condition)));
    renderCalcSizes();
  }

  search?.addEventListener('input', () => {
    renderModels();
    const matches = phones.filter(phone => matchModel(phone.name, phone.sizes, search.value));
    if (matches.length === 1 && search.value.trim().length > 3) chooseModel(matches[0].name);
  });

  nameInput?.addEventListener('input', () => {
    state.name = nameInput.value;
    $('out-contact').textContent = summaryContact();
  });

  phoneInput?.addEventListener('input', () => {
    state.phone = phoneInput.value;
    $('out-contact').textContent = summaryContact();
    errorBox.textContent = '';
  });

  function ticketText() {
    return ['Заявка на оценку iFIX',
      'Модель: ' + state.model,
      'Память: ' + state.size,
      'Состояние: ' + state.condition,
      'Контакт: ' + summaryContact()
    ].join('\n');
  }

  function showStatus(title, note) {
    const status = $('status');
    status.replaceChildren();
    const b = document.createElement('b');
    b.textContent = title;
    const span = document.createElement('span');
    span.textContent = note;
    status.append(b, span);
    status.classList.add('is-visible');
  }

  $('submit')?.addEventListener('click', () => {
    if (!state.model) {
      errorBox.textContent = 'Выберите модель телефона.';
      search.focus();
      return;
    }
    if (!state.size) {
      errorBox.textContent = 'Выберите объём памяти или «Не знаю».';
      $('step-size').scrollIntoView({ block: 'center' });
      $('sizes').querySelector('button')?.focus();
      return;
    }
    if (!state.condition) {
      errorBox.textContent = 'Отметьте состояние телефона.';
      conditionsBox.querySelector('button')?.focus();
      return;
    }
    if (phoneDigits(state.phone).length < 10) {
      errorBox.textContent = 'Укажите телефон, чтобы мастер мог перезвонить.';
      phoneInput.focus();
      return;
    }
    errorBox.textContent = '';
    $('ticket').textContent = ticketText();
    $('ticket').classList.add('is-visible');
    $('ticket-head').hidden = false;
    showStatus('Заявка собрана', 'Скопируйте текст и передайте мастеру или назовите данные по телефону.');
  });

  $('copy')?.addEventListener('click', async () => {
    const text = $('ticket').textContent;
    try {
      await navigator.clipboard.writeText(text);
      $('copy').textContent = 'Скопировано';
    } catch (error) {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      $('copy').textContent = 'Скопировано';
    }
    setTimeout(() => ($('copy').textContent = 'Скопировать текст заявки'), 2000);
  });

  $('reset')?.addEventListener('click', () => {
    Object.assign(state, { model: '', sizes: [], size: '', condition: '', name: '', phone: '' });
    heroModel.value = '';
    search.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    $('ticket').textContent = '';
    $('ticket').classList.remove('is-visible');
    $('ticket-head').hidden = true;
    $('status').classList.remove('is-visible');
    errorBox.textContent = '';
    renderModels();
    renderHeroSizes();
    syncQuick();
    window.scrollTo({ top: $('quote').offsetTop - 80, behavior: 'smooth' });
  });

  /* ---------- Заявки на ремонт и Trade-In ---------- */
  const sheet = $('sheet');
  const sheetForm = $('sheet-form');
  const sheetResult = $('sheet-result');
  const sheetError = $('s-error');
  let currentRequest = 'repair';

  const requestCopy = {
    repair: {
      title: 'Заявка на диагностику',
      lead: 'Бесплатная диагностика в сервисном центре iFIX.',
      label: 'Что случилось с устройством?',
      placeholder: 'Например, разбит экран, не держит заряд, залит водой',
      example: 'iPhone 13 Pro, 256 ГБ'
    },
    trade: {
      title: 'Заявка на Trade-In',
      lead: 'Обмен старой техники на новую с доплатой.',
      label: 'Что сдаёте и что хотите получить взамен?',
      placeholder: 'Например, сдаю iPhone 12 128 ГБ, хочу iPhone 16',
      example: 'iPhone 12, 128 ГБ'
    }
  };

  document.querySelectorAll('[data-request]').forEach(button => {
    button.addEventListener('click', () => openSheet(button.dataset.request));
  });

  function openSheet(kind) {
    currentRequest = kind;
    const copy = requestCopy[kind];
    $('sheet-title').textContent = copy.title;
    $('sheet-lead').textContent = copy.lead;
    $('s-detail-label').textContent = copy.label;
    $('s-detail').placeholder = copy.placeholder;
    $('s-model').placeholder = copy.example;
    sheetForm.reset();
    sheetForm.hidden = false;
    sheetResult.hidden = true;
    sheetError.textContent = '';
    sheet.showModal();
    setTimeout(() => $('s-model').focus(), 50);
  }

  $('sheet-close').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', event => {
    if (event.target === sheet) sheet.close();
  });

  sheetForm.addEventListener('submit', event => {
    event.preventDefault();
    if (phoneDigits($('s-phone').value).length < 10) {
      sheetError.textContent = 'Укажите телефон для связи.';
      $('s-phone').focus();
      return;
    }
    const copy = requestCopy[currentRequest];
    const lines = [copy.title + ' iFIX', 'Устройство: ' + getValue('s-model'), 'Детали: ' + getValue('s-detail'), 'Контакт: ' + getValue('s-phone')];
    $('sheet-ticket').textContent = lines.join('\n');
    sheetForm.hidden = true;
    sheetResult.hidden = false;
    $('sheet-copy').focus();
  });

  function getValue(id) {
    return $(id).value.trim() || 'не указано';
  }

  $('s-phone').addEventListener('input', () => (sheetError.textContent = ''));

  $('sheet-edit').addEventListener('click', () => {
    sheetForm.hidden = false;
    sheetResult.hidden = true;
    $('s-model').focus();
  });

  $('sheet-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('sheet-ticket').textContent);
    } catch (error) {
      const area = document.createElement('textarea');
      area.value = $('sheet-ticket').textContent;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    $('sheet-copy').textContent = 'Скопировано';
    setTimeout(() => ($('sheet-copy').textContent = 'Скопировать'), 2000);
  });

  /* ---------- Мобильное меню ---------- */
  const burger = $('burger');
  const nav = $('nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Появление секций ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(element => observer.observe(element));
  } else {
    reveals.forEach(element => element.classList.add('is-in'));
  }

  /* ---------- Предзаполнение из адреса страницы ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get('model') && byName(params.get('model'))) {
    chooseModel(params.get('model'));
    if (search) search.value = params.get('model');
  }
  renderModels();
  syncQuick();
  renderCalcSizes();
})();
