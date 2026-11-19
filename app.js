(() => {
  let backupRecoveryFailed = false;
  try { GaribaldkaBackup.recover(localStorage); } catch { backupRecoveryFailed = true; }
  const engine = GaribaldkaEngine;
  const i18n = DominoI18n;
  const get = id => document.getElementById(id);
  const gameNames = {
    pl: 'Garibaldka', en: 'Russian Bank', fr: 'Crapette', de: 'Streitpatience',
    es: 'Crapé', it: 'Crapette', ar: 'طنج', uk: 'Гарібальдка',
    'zh-Hans': '双人接龙', hi: 'दो खिलाड़ियों का सॉलिटेयर'
  };
  const resultsKey = 'garibaldka.results.v1';
  const gameKey = 'garibaldka.game.v1';
  const gardenLabels = {
    pl: 'Ogród', en: 'Garden', es: 'Jardín',
    de: 'Garten', 'zh-Hans': '花园', hi: 'बगीचा',
    fr: 'Jardin', ar: 'الحديقة', it: 'Giardino',
    uk: 'Сад'
  };
  const classicLabels = {
    pl: 'Klasyczny', en: 'Classic', es: 'Clásico', de: 'Klassisch', 'zh-Hans': '经典',
    hi: 'क्लासिक', fr: 'Classique', ar: 'كلاسيكي', it: 'Classico', uk: 'Класичний'
  };
  const tropicsLabels = {
    pl: 'Tropiki', en: 'Tropics', es: 'Trópicos', de: 'Tropen', 'zh-Hans': '热带',
    hi: 'उष्णकटिबंध', fr: 'Tropiques', ar: 'المناطق الاستوائية', it: 'Tropici', uk: 'Тропіки'
  };
  const beachLabels = {
    pl: 'Plaża', en: 'Beach', es: 'Playa', de: 'Strand', 'zh-Hans': '海滩',
    hi: 'समुद्र तट', fr: 'Plage', ar: 'الشاطئ', it: 'Spiaggia', uk: 'Пляж'
  };
  const copperLabels = {
    pl: 'Miedź i patyna', en: 'Copper & Patina', es: 'Cobre y pátina', de: 'Kupfer und Patina',
    'zh-Hans': '铜与铜绿', hi: 'तांबा और पटीना', fr: 'Cuivre et patine', ar: 'النحاس والزنجار',
    it: 'Rame e patina', uk: 'Мідь і патина'
  };
  const customThemeLabels = { garden: gardenLabels, classic: classicLabels, tropics: tropicsLabels, beach: beachLabels, copper: copperLabels };
  const prefsKey = 'garibaldka.preferences.v1';
  const winsKey = 'garibaldka.achievements.v1';
  const themes = { classic: 'Classic', garden: 'Garden', tropics: 'Tropics', beach: 'Beach', porcelain: 'Porcelain', ink: 'Ink & paper', sage: 'Sage', studio: 'Studio',
    forma: 'Forma', energy: 'Energy', tangerine: 'Tangerine', ukraine: 'Ukraine',
    copper: 'Copper & Patina', 'night-sky': 'Navy', 'starry-sky': 'Night sky', 'orange-grove': 'Orange Grove' };
  const featuredThemes = ['classic', 'garden', 'tropics', 'beach'];
  const rewards = { copper: 3, 'orange-grove': 3, 'starry-sky': 10 };
  const params = new URLSearchParams(location.search);
  const gallery = get('theme-gallery');
  const galleryCopy = {
    pl: ['Więcej motywów…', 'Za osiągnięcia', 'Zamknij', 'Pomarańczowy gaj', 'wygranych', 'Zablokowany', 'Aktywny'],
    en: ['More themes…', 'Achievement themes', 'Close', 'Orange Grove', 'wins', 'Locked', 'Active'],
    de: ['Weitere Designs…', 'Belohnungsdesigns', 'Schließen', 'Orangenhain', 'Siege', 'Gesperrt', 'Aktiv'],
    es: ['Más temas…', 'Temas por logros', 'Cerrar', 'Naranjal', 'victorias', 'Bloqueado', 'Activo'],
    fr: ['Plus de thèmes…', 'Thèmes de récompense', 'Fermer', 'Orangeraie', 'victoires', 'Verrouillé', 'Actif'],
    it: ['Altri temi…', 'Temi premio', 'Chiudi', 'Aranceto', 'vittorie', 'Bloccato', 'Attivo'],
    uk: ['Більше тем…', 'Теми за досягнення', 'Закрити', 'Апельсиновий гай', 'перемог', 'Заблоковано', 'Активна'],
    ar: ['المزيد من السمات…', 'سمات الإنجازات', 'إغلاق', 'بستان البرتقال', 'انتصارات', 'مقفل', 'نشط'],
    hi: ['और थीम…', 'उपलब्धि की थीम', 'बंद करें', 'संतरे का बाग', 'जीत', 'बंद', 'सक्रिय'],
    'zh-Hans': ['更多主题…', '成就主题', '关闭', '橙园', '胜场', '未解锁', '当前']
  };
  const galleryLabels = () => galleryCopy[prefs.language] ?? galleryCopy.en;
  function themeName(value) {
    if (value === 'night-sky') {
      const navy = { pl: 'Granat', de: 'Marineblau', es: 'Azul marino', fr: 'Bleu marine',
        it: 'Blu navy', uk: 'Темно-синій', ar: 'أزرق داكن', hi: 'गहरा नीला', 'zh-Hans': '藏青色' };
      return navy[prefs.language] ?? 'Navy';
    }
    if (value === 'orange-grove') return galleryLabels()[3];
    const labels = customThemeLabels[value];
    return labels ? labels[prefs.language] ?? labels.en : tr(themes[value]);
  }
  function applyTheme(value) {
    prefs.theme = value;
    prefs.contrast = false;
    save();
    render();
  }
  function openGallery() {
    const [title, achievementsTitle, close, , winsLabel, lockedLabel, activeLabel] = galleryLabels();
    get('gallery-title').textContent = title;
    get('gallery-rewards-title').textContent = achievementsTitle;
    get('gallery-close').textContent = close;
    const ordinary = get('gallery-ordinary');
    const achievement = get('gallery-rewards');
    ordinary.replaceChildren();
    achievement.replaceChildren();
    const galleryThemes = Object.keys(themes)
      .sort((left, right) => (rewards[left] ?? 0) - (rewards[right] ?? 0));
    for (const value of galleryThemes) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = locked(value);
      if (prefs.theme === value) button.setAttribute('aria-current', 'true');
      const thumbnail = document.createElement('span');
      thumbnail.className = 'theme-thumbnail';
      thumbnail.dataset.themePreview = value;
      thumbnail.setAttribute('aria-hidden', 'true');
      const frame = document.createElement('iframe');
      frame.src = '?' + new URLSearchParams({ miniatura: value, jezyk: prefs.language });
      frame.title = themeName(value);
      frame.setAttribute('scrolling', 'no');
      frame.tabIndex = -1;
      frame.loading = 'lazy';
      frame.inert = true;
      frame.setAttribute('sandbox', 'allow-scripts');
      thumbnail.append(frame);
      button.append(thumbnail);
      const name = document.createElement('strong');
      name.textContent = themeName(value);
      button.append(name);
      if (rewards[value] || prefs.theme === value) {
        const details = document.createElement('small');
        const threshold = rewards[value];
        details.textContent = threshold
          ? Math.min(wins, threshold) + '/' + threshold + ' ' + winsLabel
          : activeLabel;
        if (button.disabled) details.textContent += ' · ' + lockedLabel;
        button.append(details);
      }
      button.onclick = () => {
        gallery.close();
        applyTheme(value);
      };
      item.append(button);
      (rewards[value] ? achievement : ordinary).append(item);
    }
    gallery.showModal();
    scheduleComputer();
  }
  const requestedThumbnail = params.get('miniatura');
  const thumbnailTheme = Object.hasOwn(themes, requestedThumbnail) ? requestedThumbnail : null;
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  const prefs = { language: 'pl', theme: 'classic', contrast: false, large: false,
    strict: true, reservePriority: false, stopWindow: "unlimited", difficulty: "medium", falseStopPenalty: false, kingsOnly: true, showUndo: false, showCounts: false, showMoveLog: false, showTargets: false, lockDrawn: true, distinguishDecks: true, animationSpeed: "normal", ...(thumbnailTheme ? null : read(prefsKey)) };
  if (thumbnailTheme) {
    document.documentElement.classList.add('theme-thumbnail-page');
    document.body.classList.add('table-only');
    prefs.theme = thumbnailTheme;
    prefs.language = i18n.languages.includes(params.get('jezyk')) ? params.get('jezyk') : 'pl';
  } else if (!prefs.themeGallery) {
    if (prefs.theme === 'tangerine-grove') prefs.theme = 'orange-grove';
    if (prefs.theme === 'night-sky') prefs.theme = 'starry-sky';
    prefs.themeGallery = true;
  }
  let wins = thumbnailTheme ? 0 : read(winsKey) ?? 0;
  const savedGame = thumbnailTheme ? null : read(gameKey);
  let previewSeed = 731;
  const previewRandom = () => {
    previewSeed = (Math.imul(previewSeed, 1664525) + 1013904223) >>> 0;
    return previewSeed / 4294967296;
  };
  let state = savedGame?.state ?? savedGame ?? engine.deal(prefs, thumbnailTheme ? previewRandom : Math.random);
  const activeRules = Object.fromEntries(['strict','kingsOnly','reservePriority'].map(k=>[k,state[k] ?? prefs[k]]));
  const history = savedGame?.history ?? [];
  const future = savedGame?.future ?? [];
  let lastWinner = savedGame?.lastWinner ?? null;
  const results = thumbnailTheme ? {} : read(resultsKey) ?? {};
  let started = savedGame?.started ?? Boolean(savedGame && (
    history.length || future.length || state.moveLog?.length || state.pending ||
    state.goals.some(pile => pile.length) || state.players.some(player =>
      player.drawn.length || player.waste.length || player.stock.length !== 35 || player.reserve.length !== 13)));
  let pendingResult = savedGame?.pendingResult ?? null;
  let gameId = savedGame?.gameId ?? (thumbnailTheme ? null : crypto.randomUUID());
  let rewarded = savedGame?.rewarded ?? (engine.resultWinner(state) === 0);
  let selected;
  let lastCardClick;
  let saved = !backupRecoveryFailed;
  let computerTimer;
  let computerFlight;
  let stopReady = false;
  let orientationLocked = false;
  const speedFactors = { slow: 1.6, normal: 1, fast: 0.6 };
  const motionTime = ms => ms * (speedFactors[prefs.animationSpeed] ?? 1);
  const overlooksOpportunity = () => Math.random() < ({ easy: .25, medium: .10 }[prefs.difficulty] ?? 0);
  const overlooksRow = () => Math.random() < ({ easy: .08, medium: .03 }[prefs.difficulty] ?? 0);
  const human = 0;
  const computer = 1;
  const finished = () => state.winner !== null || state.stalled || state.abandoned;
  const waitingForStopAcknowledgment = () => state.stopBy === computer &&
    (state.turn === computer || state.pending?.required.length > 0) && !finished();
  const pendingCorrectionIndex = () => engine.preferredFoundationIndex(state, state.pending.required);
  const humanCanPlay = () => state.turn === human && !state.pending && !finished();
  const messages = () => opponentStrings[prefs.language] ?? opponentStrings.en;
  const ref = (group, index) => ({ group, index });
  const key = pile => pile.group + pile.index;
  const label = index => (garibaldkaStrings[prefs.language] ?? garibaldkaStrings.en)[index];
  const tr = text => i18n.text(text, prefs.language);
  const suits = ['♠', '♥', '♣', '♦'];
  const face = card => ['A','2','3','4','5','6','7','8','9','10','J','Q','K'][engine.rank(card) - 1] +
    suits[engine.suit(card)];
  let unlockedThemes = thumbnailTheme ? [] : read('garibaldka.unlocks.v1') ?? [];
  const locked = theme => !unlockedThemes.includes(theme) && wins < (rewards[theme] ?? 0);

  function save() {
    if (thumbnailTheme) return;
    try {
      if (backupRecoveryFailed) throw Error('Recovery required');
      localStorage.setItem('garibaldka.unlocks.v1', JSON.stringify(earnedThemes()));
      localStorage.setItem(gameKey, JSON.stringify({ state, history, future, rewarded, lastWinner, gameId, started, pendingResult }));
      localStorage.setItem(prefsKey, JSON.stringify(prefs));
      localStorage.setItem(winsKey, JSON.stringify(wins));
      saved = true;
    } catch { saved = false; }
  }

  function recordResult(outcome, reason = 'natural') {
    if (thumbnailTheme) return;
    if (backupRecoveryFailed) return false;
    Object.assign(results, read(resultsKey));
    if (Object.hasOwn(results, gameId)) return true;
    const entry = { outcome, reason, endedAt: Date.now() };
    try {
      localStorage.setItem(resultsKey, JSON.stringify({ ...results, [gameId]: entry }));
      results[gameId] = entry;
      return true;
    } catch { saved = false; return false; }
  }

  function update(run, { computerMove, selectDrawn = false, record = false } = {}) {
    stopReady = false;
    lastCardClick = undefined;
    const previouslyFinished = finished();
    const oldWinner = engine.resultWinner(state);
    const wasWaitingForStop = waitingForStopAcknowledgment();
    const previous = record ? structuredClone(state) : null;
    const result = run();
    const winner = engine.resultWinner(state);
    if (record && (result === 'played' || result === 'challenge')) {
      delete state.stopBy;
      delete state.falseStop;
    }
    if (previous && result !== 'invalid' && result !== 'blocked' && result !== false) {
      history.push(previous);
      if (history.length > 40) history.shift();
      future.length = 0;
    }
    selected = selectDrawn && (result === 'played' || result === true) ? ref('drawn', human) : undefined;
    if (!rewarded && oldWinner === null && winner === human) {
      wins++;
      rewarded = true;
    }
    if (!previouslyFinished && finished() && !state.abandoned) {
      pendingResult = winner === human ? 'win' : winner === computer ? 'loss' : 'draw';
    }
    save();
    if (saved && pendingResult && recordResult(pendingResult)) {
      pendingResult = null;
      save();
    }
    render();
    if (oldWinner === null && winner === human) GameVictory(true, winnerLabel());
    if (computerMove) showComputerMove(computerMove);
    if (!wasWaitingForStop && waitingForStopAcknowledgment()) get('acknowledge-stop').focus({ preventScroll: true });
    scheduleComputer();
  }

  function applyAction(action, run = () => engine.play(state, action), stopBy, falseStop = false) {
    const player = state.turn;
    const card = action.type === 'move' ? pileCards(action.from).at(-1)
      : state.players[player].drawn.at(-1);
    const result = run();
    if (result === 'challenge') started = true;
    if (result === 'played' || result === true) {
      started = true;
      const entries = state.moveLog ??= [];
      if (stopBy === human) state.stopBy = stopBy;
      entries.push({ ...action, player, stopBy, falseStop, card: action.type === 'draw'
        ? state.players[player].drawn.at(-1) : card });
      if (entries.length > 40) entries.shift();
    }
    return result;
  }

  function cardAt(id) {
    return document.querySelector('[data-focus="' + id + '"]');
  }

  function playComputerMove(action, run, stopBy) {
    const move = action.type === 'move';
    const drawn = state.players[computer].drawn.length;
    const from = move ? key(action.from) : action.type === 'end' && drawn ? 'drawn' + computer : null;
    const to = move ? key(action.to) : action.type === 'draw' ? 'drawn' + computer
      : drawn ? 'waste' + computer : null;
    const source = from && cardAt(from)?.getBoundingClientRect();
    const extendsRow = move && action.to.group === 'rows' && pileCards(action.to).length > 0;
    const previousTarget = source && to && !extendsRow ? cardAt(to)?.cloneNode(true) : null;
    update(() => applyAction(action, run, stopBy), {
      computerMove: { from: source, to, previousTarget }
    });
  }

  function placeCardOverlay(card, bounds) {
    card.classList.add('computer-move-flight');
    card.removeAttribute('data-focus');
    card.setAttribute('aria-hidden', 'true');
    card.inert = true;
    Object.assign(card.style, { left: bounds.left + 'px', top: bounds.top + 'px',
      width: bounds.width + 'px', height: bounds.height + 'px' });
    document.body.append(card);
  }

  function showComputerMove({ from, to, previousTarget }) {
    const target = to && cardAt(to);
    if (!target) return;
    target.classList.add('computer-move-target');
    setTimeout(() => target.classList.remove('computer-move-target'), motionTime(520));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !target.animate) return;
    if (!from) {
      target.animate([{ transform: 'scaleX(.15)' }, { transform: 'scaleX(1)' }],
        { duration: motionTime(240), easing: 'ease-out' });
      return;
    }

    const end = target.getBoundingClientRect();
    const card = target.cloneNode(true);
    card.classList.remove('computer-move-target');
    target.classList.add('awaiting-computer-card');
    if (previousTarget) {
      previousTarget.classList.add('computer-move-target');
      placeCardOverlay(previousTarget, end);
    }
    placeCardOverlay(card, end);
    const flight = computerFlight = card.animate([
      { transform: `translate(${from.left - end.left}px, ${from.top - end.top}px)` },
      { transform: 'translate(0, 0)' }
    ], { duration: motionTime(360), easing: 'ease-in-out' });
    const finish = () => {
      card.remove();
      previousTarget?.remove();
      target.classList.remove('awaiting-computer-card');
      if (computerFlight === flight) computerFlight = undefined;
    };
    flight.finished.then(finish, finish);
  }

  const opensStopWindow = action => action?.type === 'move' && ['rows', 'reserve'].includes(action.to.group);

  const waitsForContinue = () => prefs.stopWindow === 'unlimited';
  const canChallengeComputerMove = action => state.strict && opensStopWindow(action);
  const reviewsComputerMove = action => canChallengeComputerMove(action) ||
    (waitsForContinue() && (action?.type === 'move' ||
      (action?.type === 'end' && state.players[computer].drawn.length > 0)));

  function acceptComputerMove() {
    if (state.turn !== computer || !state.pending) return;
    update(() => applyAction(state.pending.action, () => engine.resolveChallenge(state, human)));
  }

  function callStop() {
    if (!stopReady || state.turn !== computer || !canChallengeComputerMove(state.pending?.action)) return;
    if (!state.pending.required.length) {
      update(() => {
        if (prefs.falseStopPenalty) state.skipHumanTurn = true;
        state.falseStop = prefs.falseStopPenalty ? 'penalty' : 'valid';
        return applyAction(state.pending.action, () => engine.resolveChallenge(state, human), undefined, true);
      }, { record: true });
      return;
    }
    const index = engine.preferredFoundationIndex(state, state.pending.required);
    update(() => applyAction(state.pending.required[index],
      () => engine.resolveChallenge(state, human, index), human), { record: true });
  }

  function scheduleComputer() {
    clearTimeout(computerTimer);
    stopReady = false;
    if (thumbnailTheme || gallery.open || get('settings').open || get('statistics').open || finished() || waitingForStopAcknowledgment() || get('confirm-game').open) return;
    if (state.pending) {
      if (state.turn === human) {
        computerTimer = setTimeout(() => {
          if (overlooksOpportunity()) {
            const { action } = state.pending;
            update(() => applyAction(action, () => engine.resolveChallenge(state, computer)),
              { selectDrawn: action.type === 'draw' });
            return;
          }
          update(() => { state.stopBy = computer; });
        }, motionTime(650));
      } else if (!reviewsComputerMove(state.pending.action)) {
        computerTimer = setTimeout(acceptComputerMove, 0);
      } else {
        const openWindow = () => {
          stopReady = true;
          const stop = cardAt('stop');
          if (stop) stop.disabled = !canChallengeComputerMove(state.pending.action);
          const proceed = cardAt('allow');
          if (proceed) proceed.disabled = false;
          if (!waitsForContinue()) computerTimer = setTimeout(acceptComputerMove, Number(prefs.stopWindow));
        };
        if (computerFlight) computerTimer = setTimeout(openWindow, motionTime(360));
        else openWindow();
      }
      return;
    }
    if (state.turn === computer) {
      computerTimer = setTimeout(() => {
        const { continuation, ...action } = engine.computerAction(
          state, state.computerContinuation, overlooksOpportunity(), prefs.difficulty, overlooksOpportunity, overlooksRow);
        playComputerMove(action, () => {
          state.computerContinuation = continuation;
          return engine.play(state, action, reviewsComputerMove(action));
        });
      }, motionTime(550));
    }
  }

  function button(text, run, id) {
    const node = document.createElement('button');
    node.textContent = text;
    node.onclick = run;
    node.dataset.focus = id;
    return node;
  }

  function pileCards(pile) {
    return ['rows','goals'].includes(pile.group)
      ? state[pile.group][pile.index] : state.players[pile.index][pile.group];
  }

  function restoreFoundationOrder() {
    const order = state.goalOrder;
    if (!order) return;
    state.goals = order.map(index => state.goals[index]);
    if (state.pending) {
      for (const { to } of [state.pending.action, ...state.pending.required]) {
        if (to?.group === 'goals') to.index = order.indexOf(to.index);
      }
    }
    delete state.goalOrder;
    delete state.goalSuits;
  }

  function canDiscard(pile) {
    return pile.group === 'waste' && pile.index === human && selected?.group === 'drawn';
  }

  function applyStopPreference() {
    const keepReview = state.turn === computer && waitsForContinue();
    if (!activeRules.strict && state.pending && !keepReview) {
      if (state.turn === human && state.stopBy === computer) delete state.stopBy;
      return applyAction(state.pending.action, () => engine.setStrict(state, false));
    }
    engine.setStrict(state, activeRules.strict, keepReview);
    engine.setReservePriority(state, activeRules.reservePriority);
    if (state.pending && state.turn === human && !state.pending.required.length) {
      if (state.stopBy === computer) delete state.stopBy;
      return applyAction(state.pending.action, () => engine.resolveChallenge(state, computer));
    }
  }

  function stepHistory(from, to) {
    if (!prefs.showUndo || !from.length) return;
    GameVictory(false);
    update(() => {
      to.push(state);
      state = from.pop();
      engine.setKingsOnly(state, activeRules.kingsOnly);
      applyStopPreference();
    }, { selectDrawn: false });
    if (humanCanPlay() && state.players[human].drawn.length) {
      selected = ref('drawn', human);
      render();
    }
  }

  function choose(pile, pointerClick) {
    if (!humanCanPlay()) return;
    const time = performance.now();
    const id = key(pile);
    const doubleClick = pointerClick && lastCardClick?.id === id && time - lastCardClick.time < 450;
    lastCardClick = pointerClick && !doubleClick ? { id, time } : undefined;
    const lockedToDrawn = prefs.lockDrawn && selected?.group === 'drawn';
    if (doubleClick && (!lockedToDrawn || key(selected) === id)) {
      const to = engine.quickFoundation(state, pile);
      if (to) {
        update(() => applyAction({ type: 'move', from: pile, to }), { record: true });
        return;
      }
    }
    if (canDiscard(pile)) {
      update(() => applyAction({ type: 'end' }), { record: true });
      return;
    }
    if (selected && engine.canMove(state, selected, pile)) {
      update(() => applyAction({ type: 'move', from: selected, to: pile }), { record: true });
      return;
    }
    if (state.players[human].drawn.length && (pile.group !== 'drawn' || prefs.lockDrawn)) return;
    const own = pile.index === state.turn && ['reserve','drawn'].includes(pile.group);
    selected = (own || pile.group === 'rows') && pileCards(pile).length &&
      (!selected || key(selected) !== key(pile)) ? pile : undefined;
    render();
  }

  function cardNode(card, name, pile, count = 0) {
    const pending = state.turn === computer ? state.pending?.action : null;
    const attempt = pending?.type === 'end' && state.players[computer].drawn.length
      ? { type: 'move', from: ref('drawn', computer), to: ref('waste', computer) } : pending;
    const preview = pile && attempt?.type === 'move' && key(pile) === key(attempt.to);
    const source = pile && attempt?.type === 'move' && key(pile) === key(attempt.from);
    if (preview) card = pileCards(attempt.from).at(-1);
    if (source) {
      card = pile.group === 'reserve' ? engine.visibleReserve(state, pile.index).at(-2) : undefined;
      count--;
    }
    const node = pile ? button('', event => choose(pile, event.detail > 0), key(pile)) : document.createElement('span');
    node.className = 'playing-card';
    node.classList.toggle('stop-preview', Boolean(preview));
    node.classList.toggle('stop-preview-source', Boolean(source));
    node.classList.toggle('stacked', count > 1);
    if (card === undefined) {
      node.textContent = '·';
      node.classList.add('empty');

    } else {
      for (const [className, text] of [['card-rank', face(card).slice(0, -1)], ['card-suit', face(card).slice(-1)]]) {
        const part = document.createElement('span');
        part.className = className;
        part.textContent = text;
        node.append(part);
      }
      node.classList.toggle('red', engine.color(card) === 'red');
    }
    if (pile) {
      const active = selected && key(selected) === key(pile);
      node.setAttribute('aria-pressed', Boolean(active));
      node.setAttribute('aria-label', name + ' · ' + (card === undefined ? label(6) : face(card)));
      node.classList.toggle('selected', Boolean(active));
      node.classList.toggle('legal', prefs.showTargets && Boolean(canDiscard(pile) || (selected && engine.canMove(state, selected, pile))));
      node.disabled = !humanCanPlay();
    }
    return node;
  }

  function board() {
    const pending = state.turn === computer ? state.pending?.action : null;
    const incomingRow = pending?.type === 'move' && pending.to.group === 'rows' ? pending.to.index : -1;
    const makeRows = (start, side) => {
      const column = document.createElement('div');
      column.className = 'card-rows ' + side;
      for (let index = start; index < start + 4; index++) {
        const pile = ref('rows', index);
        const cards = pileCards(pile);
        const row = document.createElement('div');
        row.className = 'card-row';
        const coveredCards = index === incomingRow ? cards : cards.slice(0, -1);
        row.style.setProperty('--covered-count', Math.max(1, coveredCards.length));
        for (const card of coveredCards) {
          const covered = cardNode(card);
          covered.classList.add('covered');
          row.append(covered);
        }
        row.append(cardNode(cards.at(-1), label(4) + ' ' + (index + 1), pile));
        column.append(row);
      }
      return column;
    };
    const goals = document.createElement('div');
    goals.className = 'goals';
    state.goals.forEach((cards, index) =>
      goals.append(cardNode(cards.at(-1), label(5) + ' ' + (index + 1), ref('goals', index))));
    get('tableau').replaceChildren(makeRows(0, 'left-rows'), goals, makeRows(4, 'right-rows'));
  }

  function personal(target, index, acknowledge) {
    const player = state.players[index];
    const active = state.turn === index;
    const blocked = !humanCanPlay();
    const title = document.createElement('h2');
    title.textContent = messages()[index];
    target.classList.toggle('current-side', active && !finished() && !state.pending);
    title.classList.toggle('active-player', active);
    target.replaceChildren(title);
    for (const [group, text] of [['reserve', 1], ['stock', 2], ['waste', 3]]) {
      const wrap = document.createElement('div');
      const caption = document.createElement('span');
      const count = player[group].length + (group === 'stock' ? player.drawn.length : 0);
      caption.textContent = label(text) + (prefs.showCounts ? ' · ' + count : '');
      let node;
      let reserveFaces;
      if (group === 'stock' && !player.drawn.length) {
        const nextCard = player.stock.at(-1);
        node = button('·', () => update(() => applyAction({ type: 'draw' }), { selectDrawn: true, record: true }), 'draw' + index);
        node.className = 'playing-card stock-card' + (nextCard !== undefined ? ' has-stock' : '');
        node.classList.toggle('second-deck-back', prefs.distinguishDecks && nextCard >= 52);
        node.disabled = !active || blocked || (nextCard === undefined && !player.waste.length);
        node.setAttribute('aria-label', label(7) + ' · ' + caption.textContent);
      } else {
        const actual = group === 'stock' ? 'drawn' : group;
        node = cardNode(player[actual].at(-1), caption.textContent, ref(actual, index), count);
        const previewSource = node.classList.contains('stop-preview-source');
        const visible = actual === 'reserve' ? engine.visibleReserve(state, index) : [];
        if (actual === 'drawn' || (actual === 'reserve' && previewSource && visible.length < 2)) {
          const nextCard = actual === 'drawn' ? player.stock.at(-1) : player.reserve.at(-2);
          node.classList.toggle('second-deck-back', prefs.distinguishDecks && nextCard >= 52);
          if (previewSource && nextCard !== undefined) {
            node.classList.remove('empty', 'stacked');
            node.classList.add('stock-card', 'has-stock');
            node.setAttribute('aria-label', caption.textContent);
          }
        }
        const coveredFaces = node.classList.contains('stop-preview') ? visible : visible.slice(0, previewSource ? -2 : -1);
        if (coveredFaces.length) {
          reserveFaces = document.createElement('div');
          reserveFaces.className = 'reserve-faces';
          for (const card of coveredFaces) reserveFaces.append(cardNode(card));
        }
      }
      wrap.append(node, caption);
      if (reserveFaces) wrap.append(reserveFaces);
      target.append(wrap);
    }
    const actions = document.createElement('div');
    actions.className = 'personal-actions';
    if (active && index === human) {
      const end = button(label(8), () => update(() => applyAction({ type: 'end' }), { record: true }), 'end');
      end.disabled = blocked || (!player.drawn.length && Boolean(player.stock.length || player.waste.length));
      actions.append(end);
    }
    const review = index === human && !finished() && state.turn === computer ? state.pending?.action : null;
    if (review && reviewsComputerMove(review)) {
      const proceed = button(continueStopLabels[prefs.language] ?? continueStopLabels.en, acceptComputerMove, 'allow');
      proceed.disabled = !stopReady;
      actions.append(proceed);
    }
    if (acknowledge && !acknowledge.hidden) actions.append(acknowledge);
    if (actions.childElementCount) target.append(actions);
    if (acknowledge?.hidden) target.append(acknowledge);
  }

  function challenge() {
    const area = get('challenge');
    area.replaceChildren();
    if (finished()) return;
    const action = state.turn === computer ? state.pending?.action : null;
    if (state.strict && (!action || canChallengeComputerMove(action))) {
      const stop = button('Stop!', callStop, 'stop');
      stop.className = 'primary stop-call';
      stop.disabled = !stopReady || !canChallengeComputerMove(action);
      area.append(stop);
    }
  }

  function renderMoveLog() {
    const [counts, countsNote, showLog, logNote, title] = panelStrings[prefs.language] ?? panelStrings.en;
    for (const [id, text] of [['showCounts-label', counts], ['showCounts-note', countsNote],
      ['showMoveLog-label', showLog], ['showMoveLog-note', logNote], ['move-log-title', title]]) {
      get(id).textContent = text;
    }
    get('move-log').hidden = !prefs.showMoveLog;
    if (!prefs.showMoveLog) return;
    const pileName = ({ group, index }) => group === 'rows' ? label(4) + ' ' + (index + 1)
      : group === 'goals' ? label(5) + ' ' + (index + 1)
      : label({ reserve: 1, drawn: 2, waste: 3 }[group]) + ' (' + messages()[index] + ')';
    const entries = [...(state.moveLog ?? [])].reverse();
    get('move-log-empty').hidden = entries.length > 0;
    get('move-log-empty').textContent = label(6);
    get('move-log-list').replaceChildren(...entries.map(entry => {
      const item = document.createElement('li');
      const card = entry.card === undefined ? '' : face(entry.card);
      const action = entry.type === 'move' ? pileName(entry.from) + ' → ' + pileName(entry.to)
        : entry.type === 'draw' ? label(7) : card ? label(2) + ' → ' + label(3) : label(8);
      if (entry.falseStop) item.append((difficultyStrings[prefs.language] ?? difficultyStrings.en)[8] + ' · ');
      if (entry.stopBy !== undefined) {
        const heading = document.createElement('strong');
        heading.textContent = (stopStrings[prefs.language] ?? stopStrings.en)[entry.stopBy] + ' · ';
        item.append(heading);
      }
      item.append([messages()[entry.player], card, action].filter(Boolean).join(' · '));
      return item;
    }));
  }

  const winnerLabel = () => messages()[engine.resultWinner(state) === human ? 4 : 5];

  const endingLabels = () => endingStrings[prefs.language] ?? endingStrings.en;
  const settlementLabels = () => settlementStrings[prefs.language] ?? settlementStrings.en;
  const remainingCounts = () => state.players.map((player, index) =>
    messages()[index] + ' ' + engine.cardsRemaining(player)).join(' / ');

  function clashLabel() {
    const winner = engine.resultWinner(state);
    const result = winner === null ? (drawResultLabels[prefs.language] ?? drawResultLabels.en) : winnerLabel();
    const reason = state.negotiated ? settlementLabels()[5] : state.repeated
      ? endingLabels()[4] : stallLabels[prefs.language] ?? stallLabels.en;
    return reason + ' ' + result + ' · ' + remainingCounts();
  }
  function toolbarButton(control, icon, text) {
    if (!control.querySelector('.toolbar-label')) {
      const symbol = document.createElement('span');
      symbol.className = 'toolbar-icon';
      symbol.setAttribute('aria-hidden', 'true');
      symbol.textContent = icon;
      const label = document.createElement('span');
      label.className = 'toolbar-label';
      control.replaceChildren(symbol, label);
      control.translate = false;
    }
    control.querySelector('.toolbar-label').textContent = text;
    control.setAttribute('aria-label', text);
    control.title = text;
  }

  function fitToolbar() {
    const toolbar = document.querySelector('.game-toolbar');
    toolbar.classList.remove('toolbar-compact', 'toolbar-icons', 'toolbar-new-icon', 'toolbar-overflow');
    const style = getComputedStyle(toolbar);
    const available = toolbar.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const required = () => Math.ceil(get('new-game').getBoundingClientRect().width +
      toolbar.querySelector('.game-tools').getBoundingClientRect().width + 8);
    if (required() > available) toolbar.classList.add('toolbar-compact');
    if (required() > available) toolbar.classList.add('toolbar-icons');
    if (required() > available) toolbar.classList.add('toolbar-new-icon');
    if (required() > available) toolbar.classList.add('toolbar-overflow');
  }


  const backupSchema = {game:'garibaldka',languages:i18n.languages,options:{},validProgress:GaribaldkaBackup.validProgress};
  for(const name of ['strict','reservePriority','falseStopPenalty','kingsOnly','showUndo','showCounts','showMoveLog','showTargets','lockDrawn','distinguishDecks'])backupSchema.options[name]=v=>typeof v==='boolean';
  backupSchema.options.stopWindow=v=>['unlimited','2000','4000','7000'].includes(v);
  backupSchema.options.difficulty=v=>['easy','medium','high','expert'].includes(v);
  backupSchema.options.animationSpeed=v=>['slow','normal','fast'].includes(v);
  function earnedThemes(){return GaribaldkaBackup.rewardIds.filter(id=>unlockedThemes.includes(id)||wins>=(rewards[id]??0));}
  const currentProgress=()=>({wins,records:{...results,...read(resultsKey)},unlockedThemes:earnedThemes()});
  let backupStatus='',backupCandidate;
  const backupCopy=()=>progressTransferStrings[prefs.language]??progressTransferStrings.en;
  function renderBackup(){const c=backupCopy();get('preferences-file-heading').textContent=c[0];get('export-preferences').textContent=c[1];get('import-preferences').textContent=c[2];get('preferences-file-scope').textContent=c[3];get('preferences-status').textContent=backupStatus;get('retry-preferences').hidden=true;}
  function backupError(code){const indexes={invalid:8,game:9,version:10,read:11,write:12,export:13};backupStatus=(preferencesTransferStrings[prefs.language]??preferencesTransferStrings.en)[indexes[code]??8];renderBackup();}
  get('export-preferences').onclick=()=>{try{const text=GamesChestBackup.stringify(prefs,currentProgress(),backupSchema);const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='garibaldka-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{backupError('export');}};
  get('import-preferences').onclick=()=>get('preferences-file').click();
  get('preferences-file').onchange=async()=>{const input=get('preferences-file'),file=input.files[0];input.value='';if(!file)return;try{if(file.size>GamesChestBackup.maxBytes)throw Error('invalid');let text;try{text=await file.text();}catch{throw Object.assign(Error(),{code:'read'});}backupCandidate=GamesChestBackup.parse(text,backupSchema);const c=backupCopy(),merged=GaribaldkaBackup.merge(currentProgress(),backupCandidate.progress);get('progress-import-title').textContent=c[5];get('progress-import-description').textContent=c[6];get('progress-import-stats').textContent=c[12]+': '+c[9]+' '+wins+' / '+merged.wins+' · '+c[10]+' '+Object.values(results).filter(r=>r.outcome==='loss').length+' / '+Object.values(merged.records).filter(r=>r.outcome==='loss').length+' · '+c[11]+' '+earnedThemes().length+' / '+merged.unlockedThemes.length;get('progress-import-note').textContent=c[14];get('cancel-progress').textContent=c[7];get('restore-progress').textContent=c[8];get('progress-import-error').hidden=true;get('confirm-progress').showModal();}catch(e){backupCandidate=undefined;backupError(e.code??'invalid');}};
  get('restore-progress').onclick=()=>{if(!backupCandidate)return;try{
    if(backupRecoveryFailed){GaribaldkaBackup.recover(localStorage);backupRecoveryFailed=false;}
    const merged=GaribaldkaBackup.merge(currentProgress(),backupCandidate.progress);
    const imported=GamesChestPreferences.resolveTheme(backupCandidate.preferences,prefs.theme,id=>Object.hasOwn(themes,id),id=>merged.unlockedThemes.includes(id)||!rewards[id]);
    const nextPrefs={...prefs,...imported.preferences};
    GaribaldkaBackup.commit(localStorage,{[prefsKey]:JSON.stringify(nextPrefs),[winsKey]:JSON.stringify(merged.wins),[resultsKey]:JSON.stringify(merged.records),'garibaldka.unlocks.v1':JSON.stringify(merged.unlockedThemes)});
    Object.assign(prefs,nextPrefs);Object.assign(results,merged.records);wins=merged.wins;unlockedThemes=merged.unlockedThemes;
    for(const name of Object.keys(backupSchema.options)){const control=get(name);if(control.type==='checkbox')control.checked=prefs[name];else control.value=prefs[name];}
    get('language').value=prefs.language;get('large').checked=prefs.large;
    backupStatus=backupCopy()[4]+(imported.skipped?' '+(preferencesTransferStrings[prefs.language]??preferencesTransferStrings.en)[imported.skipped==='locked'?6:7]:'');
    backupCandidate=undefined;get('confirm-progress').close();render();
  }catch{backupRecoveryFailed=Boolean(localStorage.getItem('garibaldka.backup-transaction.v1'));get('progress-import-error').textContent=(preferencesTransferStrings[prefs.language]??preferencesTransferStrings.en)[12];get('progress-import-error').hidden=false;}};
  get('confirm-progress').addEventListener('close',()=>{backupCandidate=undefined;get('import-preferences').focus();});

  function renderSettings() {
    renderBackup();
    const copy = settingsDialogStrings[prefs.language] ?? settingsDialogStrings.en;
    get('settings-title').textContent = tr('Settings');
    get('settings-dismiss').setAttribute('aria-label', tr('Close'));
    get('settings-autosave').textContent = copy.autosave;
    const error = get('settings-save-error');
    if (error.hidden && !saved && get('settings').open) {
      get('settings').querySelector('.settings-body').scrollTop = 0;
    }
    error.hidden = saved;
    get('settings-save-error-text').textContent = copy.error;
    get('settings-save-retry').textContent = copy.retry;
    for (const timing of get('settings').querySelectorAll('[data-setting-applies]')) {
      timing.textContent = copy.now;
    }
    for (const button of get('settings').querySelectorAll('.setting-info')) {
      const label = get(button.getAttribute('aria-labelledby'));
      button.removeAttribute('aria-labelledby');
      button.dataset.optionLabel ??= label?.id;
      button.setAttribute('aria-label', copy.about + get(button.dataset.optionLabel).textContent);
    }
  }

  function render() {
    if (!thumbnailTheme) {
      const next = Object.keys(rewards).filter(locked).sort((a, b) => rewards[a] - rewards[b])[0];
      GaribaldkaProgress.paintBar(prefs.language, wins, next && { name: themeName(next), threshold: rewards[next] });
    }
    const groups = settingsGroupStrings[prefs.language] ?? settingsGroupStrings.en;
    for (const [group, title] of Object.entries(groups)) get('settings-group-' + group).textContent = title;
    computerFlight?.cancel();
    const [deckLabel, deckNote] = deckBackStrings[prefs.language] ?? deckBackStrings.en;
    get('distinguishDecks-label').textContent = deckLabel;
    get('distinguishDecks-note').textContent = deckNote;
    if (prefs.lockDrawn && humanCanPlay() && state.players[human].drawn.length) {
      selected = ref('drawn', human);
    }
    const [lockLabel, lockNote] = lockDrawnStrings[prefs.language] ?? lockDrawnStrings.en;
    get('lockDrawn-label').textContent = lockLabel;
    get('lockDrawn-note').textContent = lockNote;
    const [undo, redo, historyLabel, historyNote] = historyStrings[prefs.language] ?? historyStrings.en;
    get('showUndo-label').textContent = historyLabel;
    get('showUndo-note').textContent = historyNote;
    for (const [id, text, entries] of [['undo', undo, history], ['redo', redo, future]]) {
      const control = get(id);
      toolbarButton(control, id === 'undo' ? '↶' : '↷', text);
      control.hidden = !prefs.showUndo;
      control.disabled = !prefs.showUndo || !entries.length;
    }
    const [speedLabel, speedNote, ...speedNames] = animationStrings[prefs.language] ?? animationStrings.en;
    get('animationSpeed-label').textContent = speedLabel;
    get('animationSpeed-note').textContent = speedNote;
    [...get('animationSpeed').options].forEach((option, index) => { option.textContent = speedNames[index]; });
    const [targetsLabel, targetsNote] = targetStrings[prefs.language] ?? targetStrings.en;
    get('showTargets-label').textContent = targetsLabel;
    get('showTargets-note').textContent = targetsNote;
    const levels = difficultyStrings[prefs.language] ?? difficultyStrings.en;
    for (const [id, index] of [['difficulty-label',0], ['difficulty-note',1],
      ['falseStopPenalty-label',6], ['falseStopPenalty-note',7]]) get(id).textContent = levels[index];
    [...get('difficulty').options].forEach((option, index) => { option.textContent = levels[index + 2]; });
    const stopLabels = stopStrings[prefs.language] ?? stopStrings.en;
    get('stopWindow-label').textContent = stopLabels[2];
    const [unlimitedLabel, unlimitedNote] = unlimitedStopStrings[prefs.language] ?? unlimitedStopStrings.en;
    get('stopWindow-unlimited').textContent = unlimitedLabel;
    get('stopWindow-note').textContent = levels[11] + ' ' + unlimitedNote;
    const acknowledge = get('acknowledge-stop');
    acknowledge.hidden = !waitingForStopAcknowledgment();
    acknowledge.textContent = continueStopLabels[prefs.language] ?? continueStopLabels.en;
    const notice = get('stop-notice');
    notice.hidden = finished() || (state.stopBy === undefined && !state.falseStop);
    const stopText = state.falseStop ? levels[state.falseStop === 'penalty' ? 10 : 9] : stopLabels[state.stopBy] ?? '';
    if (notice.textContent !== stopText) notice.textContent = stopText;
    const oldFocus = document.activeElement?.dataset.focus;
    const garden = prefs.theme === 'garden' && !prefs.contrast;
    const grove = prefs.theme === 'orange-grove' && !prefs.contrast;
    document.documentElement.dataset.theme = prefs.contrast ? 'contrast' : garden ? 'sage' : grove ? 'tangerine' : prefs.theme === 'starry-sky' ? 'night-sky' : prefs.theme;
    document.documentElement.dataset.scenicReward = prefs.contrast ? '' : prefs.theme;
    document.documentElement.classList.toggle('garden-theme', garden);
    document.documentElement.classList.toggle('tangerine-grove-theme', grove);
    document.body.classList.toggle('large', prefs.large);
    get('contrast').textContent = prefs.language === 'pl' ? '◐ Kontrast' : tr('◐ Contrast');
    get('contrast').setAttribute('aria-label', tr('High contrast'));
    get('contrast').setAttribute('aria-pressed', prefs.contrast);
    get('large-label').textContent = 'A+';
    get('large').setAttribute('aria-label', tr('Larger text'));
    get('language-label').textContent = tr('Language');
    get('theme-label').textContent = tr('Appearance');
    const visibleThemes = featuredThemes.includes(prefs.theme) ? featuredThemes : [...featuredThemes, prefs.theme];
    const menuThemes = [...visibleThemes.map(value => new Option(themeName(value), value)),
      new Option(galleryLabels()[0], 'more')];
    if (themeSelect.options.length !== menuThemes.length || menuThemes.some((option, index) =>
      option.value !== themeSelect.options[index].value || option.text !== themeSelect.options[index].text)) {
      themeSelect.replaceChildren(...menuThemes);
    }
    themeSelect.value = prefs.theme;
    for (const [id, index] of Object.entries({'kingsOnly-label':13,'kingsOnly-note':14,
      'strict-note':15})) get(id).textContent = label(index);
    GaribaldkaHelp.render(prefs.language, get('help-content'));
    get('strict-label').textContent = 'Stop!';
    const [priorityLabel, priorityNote] = reservePriorityStrings[prefs.language] ?? reservePriorityStrings.en;
    get('reservePriority-label').textContent = priorityLabel;
    get('reservePriority-note').textContent = priorityNote;
    get('reservePriority').disabled = !prefs.strict;
    get('strict-note').textContent += ' ' + immediateRuleLabels[prefs.language];
    get('kingsOnly-note').textContent += ' ' + immediateRuleLabels[prefs.language];

    const full = document.body.classList.contains('table-only');
    get('rotate-hint').textContent = rotateHintStrings[prefs.language] ?? rotateHintStrings.en;
    get('fullscreen').setAttribute('aria-pressed', full);
    get('fullscreen').setAttribute('aria-label', label(full ? 19 : 18));
    get('fullscreen').querySelector('.fullscreen-label').textContent = label(full ? 19 : 18);
    const gameName = gameNames[prefs.language] ?? gameNames.en;
    document.title = get('game-name').textContent = gameName;
    const helpLabel = prefs.language === 'pl' ? 'Jak grać?' : tr('How to play');
    toolbarButton(get('help-button'), '?', helpLabel);
    toolbarButton(get('new-game'), '+', prefs.language === 'pl' ? 'Nowa gra' : tr('New game'));
    get('help-title').textContent = helpLabel + ' · ' + gameName;
    board();
    personal(get('opponent'), 1);
    personal(get('supply'), 0, acknowledge);
    if (waitingForStopAcknowledgment() && state.turn === human) {
      const correction = state.pending.required[pendingCorrectionIndex()];
      cardAt(key(correction.from))?.classList.add('stop-required-card');
    }
    challenge();
    renderMoveLog();
    const status = get('status');
    const settlement = engine.settlementAvailability(state);
    const proposal = get('propose-settlement');
    proposal.hidden = !settlement;
    proposal.textContent = settlementLabels()[settlement === 'computer' ? 1 : 0];
    const terms = state.negotiation;
    const refused = !finished() && terms?.refusedAt !== undefined && terms.quietTurns < terms.refusedAt + 2;
    get('settlement-notice').hidden = !refused;
    get('settlement-notice').textContent = settlementLabels()[4];
    const text = state.abandoned ? endingLabels()[3] + ' · ' + remainingCounts() : state.stalled ? clashLabel() : state.winner !== null ? winnerLabel()
      : state.pending ? messages()[state.turn === human && !waitingForStopAcknowledgment() ? 6 : 3] : messages()[state.turn + 2];
    if (status.textContent !== text) status.textContent = text;
    get('save-note').textContent = label(saved ? 20 : 21);
    i18n.apply(document.body, prefs.language);
    fitToolbar();
    renderSettings();
    if (oldFocus) {
      const nextId = oldFocus === 'draw' + human && selected?.group === 'drawn' ? key(selected) : oldFocus;
      const next = cardAt(nextId);
      const fallback = document.querySelector('#supply [data-focus="allow"]:enabled, #challenge button:enabled');
      (next && !next.disabled ? next : fallback ?? get('status')).focus();
    }
  }

  i18n.addLanguages(get('language'));
  const themeSelect = get('theme');
  themeSelect.translate = false;
  if (!thumbnailTheme && (locked(prefs.theme) || !Object.hasOwn(themes, prefs.theme))) prefs.theme = 'classic';
  themeSelect.onchange = () => {
    const value = themeSelect.value;
    if (value === 'more') {
      themeSelect.value = prefs.theme;
      openGallery();
    } else if (Object.hasOwn(themes, value) && !locked(value)) {
      applyTheme(value);
    }
  };
  gallery.addEventListener('close', () => {
    get('gallery-ordinary').replaceChildren();
    get('gallery-rewards').replaceChildren();
    themeSelect.focus();
    scheduleComputer();
  });
  for (const name of ['language','large','strict','kingsOnly','showUndo','showCounts','showMoveLog','animationSpeed','showTargets','lockDrawn','distinguishDecks','stopWindow','difficulty','falseStopPenalty','reservePriority']) {
    const node = get(name);
    const checkbox = node.type === 'checkbox';
    if (checkbox) node.checked = prefs[name];
    else node.value = prefs[name];
    node.onchange = () => {
      prefs[name] = checkbox ? node.checked : node.value;
      if (Object.hasOwn(activeRules,name)) activeRules[name]=prefs[name];
      if (name === 'animationSpeed' || name === 'stopWindow') scheduleComputer();
      if (name === 'strict' || name === 'reservePriority') {
        update(applyStopPreference);
        return;
      }
      if (name === 'kingsOnly') {
        update(() => {
          const wasWaiting = waitingForStopAcknowledgment() && state.turn === human;
          engine.setKingsOnly(state, activeRules.kingsOnly);
          if (wasWaiting && !state.pending) delete state.stopBy;
        });
        return;
      }
      save();
      render();
    };
  }
  get('status').tabIndex = -1;
  get('acknowledge-stop').onclick = () => {
    if (!waitingForStopAcknowledgment()) return;
    if (state.turn === human && state.pending) {
      const index = pendingCorrectionIndex();
      playComputerMove(state.pending.required[index], () => {
        delete state.stopBy;
        return engine.resolveChallenge(state, computer, index);
      }, computer);
    } else {
      update(() => { delete state.stopBy; });
    }
    get('status').focus({ preventScroll: true });
  };
  get('undo').onclick = () => stepHistory(history, future);
  get('redo').onclick = () => stepHistory(future, history);
  const statistics = get('statistics');
  get('my-progress').onclick = () => {
    Object.assign(results, read(resultsKey));
    GaribaldkaProgress.paintStats(prefs.language, Object.values(results).sort((a, b) => a.endedAt - b.endedAt));
    statistics.showModal();
    scheduleComputer();
  };
  statistics.addEventListener('close', scheduleComputer);

  function startNewGame() {
    if (pendingResult && !recordResult(pendingResult)) {
      render();
      return;
    }
    if (started && !finished() && !recordResult('loss', 'replaced')) {
      render();
      return;
    }
    for(const name of Object.keys(activeRules)) activeRules[name]=prefs[name];
    started = false;
    pendingResult = null;
    gameId = crypto.randomUUID();
    GameVictory(false);
    history.length = 0;
    future.length = 0;
    rewarded = false;
    lastWinner = engine.resultWinner(state) ?? lastWinner;
    update(() => { state = engine.deal({ ...prefs, lastWinner }); });
  }

  const replacementWarning = {
    pl: 'Rozpocząć nową partię? Obecna partia zostanie zaliczona jako przegrana.',
    en: 'Start a new game? The current game will count as a loss.',
    es: '¿Empezar una partida nueva? La partida actual contará como derrota.',
    de: 'Ein neues Spiel beginnen? Das laufende Spiel zählt als Niederlage.',
    'zh-Hans': '开始新游戏？当前对局将计为失败。',
    hi: 'नया खेल शुरू करें? मौजूदा खेल हार के रूप में गिना जाएगा।',
    fr: 'Commencer une nouvelle partie ? La partie en cours comptera comme une défaite.',
    ar: 'هل تريد بدء مباراة جديدة؟ ستُحتسب المباراة الحالية خسارة.',
    it: 'Iniziare una nuova partita? La partita attuale conterà come sconfitta.',
    uk: 'Почати нову партію? Поточну партію буде зараховано як поразку.'
  };
  const confirmation = get('confirm-game');
  function confirmGameAction(action) {
    const labels = endingLabels();
    const settlement = action === 'settle' ? engine.settlementAvailability(state) : null;
    const texts = settlementLabels();
    get('confirm-game-title').textContent = settlement ? texts[settlement === 'computer' ? 1 : 0] : tr('New game');
    get('confirm-game-message').textContent = settlement ? texts[2] + ' · ' + remainingCounts() : (replacementWarning[prefs.language] ?? replacementWarning.en);
    get('confirm-game-cancel').textContent = labels[2];
    get('confirm-game-accept').textContent = settlement ? texts[3] : tr('New game');
    confirmation.dataset.action = action;
    confirmation.returnValue = '';
    confirmation.showModal();
    scheduleComputer();
  }

  get('propose-settlement').onclick = () => confirmGameAction('settle');
  get('new-game').onclick = () => finished() || !started ? startNewGame() : confirmGameAction('new');
  confirmation.onclose = () => {
    const action = confirmation.dataset.action;
    delete confirmation.dataset.action;
    if (!action) return;
    if (confirmation.returnValue !== 'accept') {
      if (action === 'settle' && engine.settlementAvailability(state) === 'computer') {
        update(() => engine.declineSettlement(state));
      } else {
        scheduleComputer();
      }
    } else if (action === 'settle') {
      update(() => engine.proposeSettlement(state), { record: true });
      get('status').focus({ preventScroll: true });
    } else {
      startNewGame();
    }
  };
  get('contrast').onclick = () => { prefs.contrast = !prefs.contrast; save(); render(); };
  get('help-button').onclick = () => get('help').showModal();
  get('settings-button').onclick = () => {
    renderSettings();
    get('settings').showModal();
    scheduleComputer();
  };
  get('settings').addEventListener('close', () => {
    get('settings-button').focus({ preventScroll: true });
    scheduleComputer();
  });
  get('settings-save-retry').onclick = () => {
    save();
    render();
  };
  for (const info of document.querySelectorAll('.setting-info')) {
    info.onclick = () => {
      const note = get(info.getAttribute('aria-controls'));
      note.hidden = !note.hidden;
      info.setAttribute('aria-expanded', !note.hidden);
    };
  }
  function unlockOrientation() {
    if (!orientationLocked) return;
    orientationLocked = false;
    screen.orientation.unlock();
  }

  get('fullscreen').onclick = async () => {
    const open = document.body.classList.toggle('table-only');
    render();
    try {
      if (!open) {
        unlockOrientation();
        if (document.fullscreenElement) await document.exitFullscreen();
        return;
      }
      await document.documentElement.requestFullscreen?.();
      const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) <= 600;
      if (phone && document.body.classList.contains('table-only') && screen.orientation?.lock) {
        await screen.orientation.lock('landscape');
        orientationLocked = true;
        if (!document.body.classList.contains('table-only')) unlockOrientation();
      }
    } catch { /* The expanded table and the rotate hint also work without native fullscreen. */ }
  };
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove('table-only');
      unlockOrientation();
    }
    render();
  });
  new ResizeObserver(fitToolbar).observe(document.querySelector('.game-toolbar'));
  restoreFoundationOrder();
  if (!savedGame) engine.setKingsOnly(state, activeRules.kingsOnly);
  if (thumbnailTheme) render();
  else if (savedGame) update(() => {});
  else update(applyStopPreference);
})();
