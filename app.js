(() => {
  const engine = GaribaldkaEngine;
  const i18n = DominoI18n;
  const get = id => document.getElementById(id);
  const gameKey = 'garibaldka.game.v1';
  const prefsKey = 'garibaldka.preferences.v1';
  const winsKey = 'garibaldka.achievements.v1';
  const themes = { porcelain: 'Porcelain', ink: 'Ink & paper', sage: 'Sage', studio: 'Studio',
    forma: 'Forma', energy: 'Energy', tangerine: 'Tangerine', ukraine: 'Ukraine',
    copper: 'Copper', 'night-sky': 'Night sky' };
  const rewards = { copper: 3, 'night-sky': 10 };
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }
  const prefs = { language: 'pl', theme: 'porcelain', contrast: false, large: false,
    strict: true, stopWindow: "4000", difficulty: "medium", falseStopPenalty: false, kingsOnly: true, showUndo: false, showCounts: false, showMoveLog: false, showTargets: false, lockDrawn: true, distinguishDecks: true, animationSpeed: "normal", ...read(prefsKey) };
  let wins = read(winsKey) ?? 0;
  const savedGame = read(gameKey);
  let state = savedGame?.state ?? savedGame ?? engine.deal(prefs);
  const history = savedGame?.history ?? [];
  const future = savedGame?.future ?? [];
  let lastWinner = savedGame?.lastWinner ?? null;
  let rewarded = savedGame?.rewarded ?? (engine.resultWinner(state) === 0);
  let selected;
  let lastCardClick;
  let saved = true;
  let computerTimer;
  let computerFlight;
  let stopReady = false;
  const speedFactors = { slow: 1.6, normal: 1, fast: 0.6 };
  const motionTime = ms => ms * (speedFactors[prefs.animationSpeed] ?? 1);
  const overlooksOpportunity = () => Math.random() < ({ easy: .25, medium: .10 }[prefs.difficulty] ?? 0);
  const human = 0;
  const computer = 1;
  const finished = () => state.winner !== null || state.stalled || state.abandoned;
  const waitingForStopAcknowledgment = () => state.stopBy === computer &&
    state.turn === computer && !finished();
  const humanCanPlay = () => state.turn === human && !state.pending && !finished();
  const messages = () => opponentStrings[prefs.language] ?? opponentStrings.en;
  const ref = (group, index) => ({ group, index });
  const key = pile => pile.group + pile.index;
  const label = index => (garibaldkaStrings[prefs.language] ?? garibaldkaStrings.en)[index];
  const tr = text => i18n.text(text, prefs.language);
  const suits = ['♠', '♥', '♣', '♦'];
  const face = card => ['A','2','3','4','5','6','7','8','9','10','J','Q','K'][engine.rank(card) - 1] +
    suits[engine.suit(card)];
  const locked = theme => wins < (rewards[theme] ?? 0);

  function save() {
    try {
      localStorage.setItem(gameKey, JSON.stringify({ state, history, future, rewarded, lastWinner }));
      localStorage.setItem(prefsKey, JSON.stringify(prefs));
      localStorage.setItem(winsKey, JSON.stringify(wins));
      saved = true;
    } catch { saved = false; }
  }

  function update(run, { computerMove, selectDrawn = false, record = false } = {}) {
    stopReady = false;
    lastCardClick = undefined;
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
    save();
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
    if (result === 'played' || result === true) {
      const entries = state.moveLog ??= [];
      if (stopBy !== undefined) state.stopBy = stopBy;
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

  function acceptComputerMove() {
    if (state.turn !== computer || !state.pending) return;
    update(() => applyAction(state.pending.action, () => engine.resolveChallenge(state, human)));
  }

  function callStop() {
    if (!stopReady || state.turn !== computer || !state.pending) return;
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
    if (finished() || waitingForStopAcknowledgment() || get('confirm-game').open) return;
    if (state.pending) {
      if (state.turn === human) {
        computerTimer = setTimeout(() => {
          if (overlooksOpportunity()) {
            const { action } = state.pending;
            update(() => applyAction(action, () => engine.resolveChallenge(state, computer)),
              { selectDrawn: action.type === 'draw' });
            return;
          }
          const index = engine.preferredFoundationIndex(state, state.pending.required);
          playComputerMove(state.pending.required[index], () => engine.resolveChallenge(state, computer, index), computer);
        }, motionTime(650));
      } else if (!opensStopWindow(state.pending.action)) {
        computerTimer = setTimeout(acceptComputerMove, 0);
      } else {
        const openWindow = () => {
          stopReady = true;
          cardAt('stop').disabled = false;
          computerTimer = setTimeout(acceptComputerMove, Number(prefs.stopWindow));
        };
        if (computerFlight) computerTimer = setTimeout(openWindow, motionTime(360));
        else openWindow();
      }
      return;
    }
    if (state.turn === computer) {
      computerTimer = setTimeout(() => {
        const { continuation, ...action } = engine.computerAction(
          state, state.computerContinuation, overlooksOpportunity(), prefs.difficulty, overlooksOpportunity);
        playComputerMove(action, () => {
          state.computerContinuation = continuation;
          return engine.play(state, action, state.strict && opensStopWindow(action));
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
    if (!prefs.strict && state.pending) {
      return applyAction(state.pending.action, () => engine.setStrict(state, false));
    }
    engine.setStrict(state, prefs.strict);
  }

  function stepHistory(from, to) {
    if (!prefs.showUndo || !from.length) return;
    GameVictory(false);
    update(() => {
      to.push(state);
      state = from.pop();
      engine.setKingsOnly(state, prefs.kingsOnly);
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
    if (prefs.lockDrawn && selected?.group === 'drawn') return;
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
      card = undefined;
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

  function personal(target, index) {
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
        if (actual === 'drawn' || (actual === 'reserve' && previewSource)) {
          const nextCard = actual === 'drawn' ? player.stock.at(-1) : player.reserve.at(-2);
          node.classList.toggle('second-deck-back', prefs.distinguishDecks && nextCard >= 52);
          if (previewSource && nextCard !== undefined) {
            node.classList.remove('empty', 'stacked');
            node.classList.add('stock-card', 'has-stock');
            node.setAttribute('aria-label', caption.textContent);
          }
        }
      }
      wrap.append(node, caption);
      target.append(wrap);
    }
    if (active && index === human) {
      const end = button(label(8), () => update(() => applyAction({ type: 'end' }), { record: true }), 'end');
      end.disabled = blocked || (!player.drawn.length && Boolean(player.stock.length || player.waste.length));
      const actions = document.createElement('div');
      actions.className = 'personal-actions';
      actions.append(end);
      target.append(actions);
    }
  }

  function challenge() {
    const area = get('challenge');
    area.replaceChildren();
    if (!state.strict || finished()) return;
    const canCall = state.turn === computer && opensStopWindow(state.pending?.action);
    const stop = button('Stop!', callStop, 'stop');
    stop.className = 'primary stop-call';
    stop.disabled = !canCall || !stopReady;
    area.append(stop);
    if (canCall) area.append(button(continueStopLabels[prefs.language] ?? continueStopLabels.en, acceptComputerMove, 'allow'));
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
  function render() {
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
      control.textContent = text;
      control.hidden = !prefs.showUndo;
      control.disabled = !entries.length;
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
    get('stopWindow-note').textContent = levels[11];
    const acknowledge = get('acknowledge-stop');
    acknowledge.hidden = !waitingForStopAcknowledgment();
    acknowledge.textContent = continueStopLabels[prefs.language] ?? continueStopLabels.en;
    const notice = get('stop-notice');
    notice.hidden = finished() || (state.stopBy === undefined && !state.falseStop);
    const stopText = state.falseStop ? levels[state.falseStop === 'penalty' ? 10 : 9] : stopLabels[state.stopBy] ?? '';
    if (notice.textContent !== stopText) notice.textContent = stopText;
    const oldFocus = document.activeElement?.dataset.focus;
    document.documentElement.dataset.theme = prefs.contrast ? 'contrast' : prefs.theme;
    document.body.classList.toggle('large', prefs.large);
    get('contrast').textContent = '◐ ' + tr('High contrast');
    get('contrast').setAttribute('aria-pressed', prefs.contrast);
    get('large-label').textContent = 'A+';
    get('large').setAttribute('aria-label', tr('Larger text'));
    get('language-label').textContent = tr('Language');
    get('theme-label').textContent = tr('Appearance');
    for (const option of get('theme').options) {
      option.disabled = locked(option.value);
      option.textContent = tr(themes[option.value]) + (option.disabled ? ' · ' + wins + '/' + rewards[option.value] : '');
    }
    get('theme').value = prefs.theme;
    for (const [id, index] of Object.entries({'kingsOnly-label':13,'kingsOnly-note':14,
      'strict-note':15,'rules':17})) get(id).textContent = label(index);
    get('strict-label').textContent = 'Stop!';
    get('strict-note').textContent += ' ' + immediateRuleLabels[prefs.language];
    get('kingsOnly-note').textContent += ' ' + immediateRuleLabels[prefs.language];
    get('sequence-help').textContent = [state.strict ? label(15) : '', state.kingsOnly ? label(14) : ''].filter(Boolean).join(' ');
    const full = document.body.classList.contains('table-only');
    get('fullscreen').setAttribute('aria-pressed', full);
    get('fullscreen').setAttribute('aria-label', label(full ? 19 : 18));
    get('fullscreen').querySelector('.fullscreen-label').textContent = label(full ? 19 : 18);
    get('help-button').textContent = get('help-title').textContent = prefs.language === 'pl' ? 'Jak grać?' : tr('How to play');
    get('tableau').closest('.game').classList.toggle('computer-turn', state.turn === computer && !finished());
    board();
    personal(get('opponent'), 1);
    personal(get('supply'), 0);
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
      : state.pending ? messages()[state.turn === human ? 6 : 3] : messages()[state.turn + 2];
    if (status.textContent !== text) status.textContent = text;
    get('save-note').textContent = label(saved ? 20 : 21);
    i18n.apply(document.body, prefs.language);
    if (oldFocus) {
      const nextId = oldFocus === 'draw' + human && selected?.group === 'drawn' ? key(selected) : oldFocus;
      const next = cardAt(nextId);
      (next && !next.disabled ? next : get('challenge').querySelector('button:not(:disabled)') ?? get('status')).focus();
    }
  }

  i18n.addLanguages(get('language'));
  for (const name of Object.keys(themes)) get('theme').add(new Option(themes[name], name));
  if (locked(prefs.theme) || !Object.hasOwn(themes, prefs.theme)) prefs.theme = 'porcelain';
  for (const name of ['language','theme','large','strict','kingsOnly','showUndo','showCounts','showMoveLog','animationSpeed','showTargets','lockDrawn','distinguishDecks','stopWindow','difficulty','falseStopPenalty']) {
    const node = get(name);
    const checkbox = node.type === 'checkbox';
    if (checkbox) node.checked = prefs[name];
    else node.value = prefs[name];
    node.onchange = () => {
      prefs[name] = checkbox ? node.checked : node.value;
      if (name === 'theme') prefs.contrast = false;
      if (name === 'animationSpeed' || name === 'stopWindow') scheduleComputer();
      if (name === 'strict') {
        update(applyStopPreference);
        return;
      }
      if (name === 'kingsOnly') {
        update(() => engine.setKingsOnly(state, prefs.kingsOnly));
        return;
      }
      save();
      render();
    };
  }
  get('status').tabIndex = -1;
  get('acknowledge-stop').onclick = () => {
    if (!waitingForStopAcknowledgment()) return;
    update(() => { delete state.stopBy; });
    get('status').focus({ preventScroll: true });
  };
  get('undo').onclick = () => stepHistory(history, future);
  get('redo').onclick = () => stepHistory(future, history);
  function startNewGame() {
    GameVictory(false);
    history.length = 0;
    future.length = 0;
    rewarded = false;
    lastWinner = engine.resultWinner(state) ?? lastWinner;
    update(() => { state = engine.deal({ ...prefs, lastWinner }); });
  }

  const confirmation = get('confirm-game');
  function confirmGameAction(action) {
    const labels = endingLabels();
    const settlement = action === 'settle' ? engine.settlementAvailability(state) : null;
    const texts = settlementLabels();
    get('confirm-game-title').textContent = settlement ? texts[settlement === 'computer' ? 1 : 0] : tr('New game');
    get('confirm-game-message').textContent = settlement ? texts[2] + ' · ' + remainingCounts() : tr('Start a new game?');
    get('confirm-game-cancel').textContent = labels[2];
    get('confirm-game-accept').textContent = settlement ? texts[3] : tr('New game');
    confirmation.dataset.action = action;
    confirmation.returnValue = '';
    confirmation.showModal();
    scheduleComputer();
  }

  get('propose-settlement').onclick = () => confirmGameAction('settle');
  get('new-game').onclick = () => finished() ? startNewGame() : confirmGameAction('new');
  confirmation.onclose = () => {
    if (confirmation.returnValue !== 'accept') {
      if (confirmation.dataset.action === 'settle' && engine.settlementAvailability(state) === 'computer') {
        update(() => engine.declineSettlement(state));
      } else {
        scheduleComputer();
      }
    } else if (confirmation.dataset.action === 'settle') {
      update(() => engine.proposeSettlement(state), { record: true });
      get('status').focus({ preventScroll: true });
    } else {
      startNewGame();
    }
  };
  get('contrast').onclick = () => { prefs.contrast = !prefs.contrast; save(); render(); };
  for (const dialog of ['help','settings']) get(dialog + '-button').onclick = () => get(dialog).showModal();
  for (const info of document.querySelectorAll('.setting-info')) {
    info.onclick = () => {
      const note = get(info.getAttribute('aria-controls'));
      note.hidden = !note.hidden;
      info.setAttribute('aria-expanded', !note.hidden);
    };
  }
  get('fullscreen').onclick = async () => {
    const open = document.body.classList.toggle('table-only');
    render();
    try {
      if (open) await document.documentElement.requestFullscreen();
      else if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* The expanded table also works without native fullscreen. */ }
  };
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) document.body.classList.remove('table-only');
    render();
  });
  restoreFoundationOrder();
  engine.setKingsOnly(state, prefs.kingsOnly);
  update(applyStopPreference);
})();
