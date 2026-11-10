(function (root) {
  // Card encoding and pile orientation follow Pasjans. IDs 52–103 are deck two.
  const rank = card => card % 13 + 1;
  const suit = card => Math.floor(card / 13) % 4;
  const color = card => suit(card) % 2 === 1 ? 'red' : 'black';
  const top = pile => pile.at(-1);
  const refs = group => Array.from({ length: 8 }, (_, index) => ({ group, index }));

  function deal({ strict = true, kingsOnly = true, reservePriority = false, lastWinner = null } = {}, random = Math.random) {
    const rows = [];
    const players = [0, 1].map(player => {
      const deck = Array.from({ length: 52 }, (_, index) => player * 52 + index);
      for (let index = deck.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
      }
      const reserve = deck.splice(0, 13);
      rows.push(...deck.splice(0, 4).map(card => [card]));
      return { reserve, stock: deck, waste: [], drawn: [] };
    });
    const state = { rows, goals: Array.from({ length: 8 }, () => []), players,
      turn: lastWinner === null ? Math.floor(random() * 2) : 1 - lastWinner,
      kingsOnly, strict, reservePriority, pending: null, winner: null, stalled: false };
    recordPosition(state);
    return state;
  }

  function pile(state, ref) {
    switch (ref.group) {
      case 'rows':
      case 'goals':
        return state[ref.group][ref.index];
      case 'drawn':
      case 'reserve':
      case 'waste':
        return state.players[ref.index]?.[ref.group];
    }
  }

  function canMove(state, from, to) {
    if (state.players[state.turn].drawn.length && from.group !== 'drawn') return false;
    if (from.group !== 'rows' &&
        !(from.index === state.turn && ['drawn', 'reserve'].includes(from.group))) return false;
    const source = pile(state, from);
    const target = pile(state, to);
    if (!source?.length || !target || source === target) return false;
    const card = top(source);
    const last = top(target);
    switch (to.group) {
      case 'rows':
        return last === undefined
          ? state.kingsOnly === false || rank(card) === 13
          : rank(card) + 1 === rank(last) && color(card) !== color(last);
      case 'goals':
        return last === undefined
          ? rank(card) === 1
          : rank(card) === rank(last) + 1 && suit(card) === suit(last);
      case 'reserve':
      case 'waste':
        return to.index === 1 - state.turn && last !== undefined &&
          suit(card) === suit(last) && Math.abs(rank(card) - rank(last)) === 1;
      default:
        return false;
    }
  }

  function goalMoves(state, sources) {
    return sources.flatMap(from => refs('goals').filter(to => canMove(state, from, to))
      .map(to => ({ type: 'move', from, to })));
  }

  function quickFoundation(state, from) {
    const goals = refs('goals');
    return goals.find(to => to.index % 2 === 0 && canMove(state, from, to)) ??
      goals.find(to => canMove(state, from, to));
  }

  function requiredMoves(state) {
    if (!state.strict) return [];
    const reserve = goalMoves(state, [{ group: 'reserve', index: state.turn }]);
    if (state.reservePriority && reserve.length) return reserve;
    return [...reserve, ...goalMoves(state, [...refs('rows'), { group: 'drawn', index: state.turn }])];
  }

  function sameRef(left, right) {
    return left.group === right?.group && left.index === right.index;
  }

  function visibleReserve(state, index) {
    const reserve = state.players[index].reserve;
    return reserve.slice(-(state.reserveFaceUp?.[index] || 1));
  }

  function recordPosition(state) {
    const key = JSON.stringify([state.turn, state.strict, state.reservePriority ?? false, state.kingsOnly, state.skipHumanTurn ?? false,
      state.rows, state.goals, [0, 1].map(index => visibleReserve(state, index).length), state.players.map(({ reserve, stock, waste, drawn }) => [reserve, stock, waste, drawn])]);
    const visits = state.positionVisits ??= [];
    const count = visits.filter(position => position === key).length + 1;
    visits.push(key);
    if (visits.length > 128) visits.shift();
    if (count === 3) {
      state.repeated = true;
      state.stalled = true;
    }
  }

  function progressCounts(state) {
    return [...state.players.map(cardsRemaining), state.goals.reduce((sum, pile) => sum + pile.length, 0)];
  }

  function trackProgress(state) {
    state.negotiation ??= { baseline: progressCounts(state), quietTurns: 0 };
  }

  function finishProgress(state) {
    trackProgress(state);
    const baseline = progressCounts(state);
    const previous = state.negotiation.baseline;
    if (baseline[0] < previous[0] || baseline[1] < previous[1] || baseline[2] > previous[2]) {
      state.negotiation = { baseline, quietTurns: 0 };
    } else {
      state.negotiation.baseline = baseline;
      state.negotiation.quietTurns++;
    }
  }

  function computerHasReserveMove(state) {
    const view = { ...state, turn: 1 };
    const reserve = { group: 'reserve', index: 1 };
    return [...refs('rows'), ...refs('goals')].some(to => canMove(view, reserve, to));
  }

  function settlementAvailability(state) {
    if (state.turn !== 0 || state.pending || state.winner !== null || state.stalled || state.abandoned) return null;
    const terms = state.negotiation;
    if (!terms || terms.quietTurns < 8) return null;
    if (terms.refusedAt !== undefined) return terms.quietTurns >= terms.refusedAt + 2 ? 'binding' : null;
    return terms.quietTurns >= 10 && !terms.declined && !computerHasReserveMove(state) ? 'computer' : 'player';
  }

  function declineSettlement(state) {
    if (settlementAvailability(state) === 'computer') state.negotiation.declined = true;
  }

  function proposeSettlement(state) {
    const availability = settlementAvailability(state);
    if (!availability) return 'blocked';
    if (availability === 'player' && computerHasReserveMove(state)) {
      state.negotiation.refusedAt = state.negotiation.quietTurns;
      return 'refused';
    }
    state.negotiated = true;
    state.stalled = true;
    return 'settled';
  }

  function finishTurn(state, next) {
    if (next === 0 && state.skipHumanTurn) {
      delete state.skipHumanTurn;
      next = 1;
    }
    state.turn = next;
    finishProgress(state);
    // Only declare an impasse when neither player has a move even after recycling.
    state.stalled = !state.players.some((player, turn) => {
      const view = { ...state, turn };
      const sources = [...refs('rows'), { group: 'reserve', index: turn }];
      const targets = [...refs('rows'), ...refs('goals'),
        { group: 'reserve', index: 1 - turn }, { group: 'waste', index: 1 - turn }];
      if (sources.some(from => targets.some(to => canMove(view, from, to)))) return true;
      // A future discard can expose a different opponent waste card.
      if (state.players[1 - turn].stock.length || state.players[1 - turn].waste.length) {
        targets.pop();
        if (state.players[1 - turn].stock.concat(state.players[1 - turn].waste)
          .some(card => sources.concat({ group: 'drawn', index: turn }).some(from => {
            const candidates = from.group === 'drawn' ? [...player.stock, ...player.waste] : [top(pile(view, from))];
            return candidates.some(candidate => candidate !== undefined &&
              suit(candidate) === suit(card) && Math.abs(rank(candidate) - rank(card)) === 1);
          }))) return true;
      }
      const from = { group: 'drawn', index: turn };
      return [...player.stock, ...player.waste].some(card => {
        const players = state.players.slice();
        players[turn] = { ...player, drawn: [card] };
        return targets.some(to => canMove({ ...view, players }, from, to));
      });
    });
    if (!state.stalled) recordPosition(state);
  }

  function apply(state, action) {
    trackProgress(state);
    const player = state.players[state.turn];
    switch (action.type) {
      case 'move': {
        const { from, to } = action;
        if (from.group === 'reserve' || to.group === 'reserve') {
          const faceUp = state.reserveFaceUp ??= state.players.map(side => Math.min(1, side.reserve.length));
          if (from.group === 'reserve') {
            faceUp[from.index] = pile(state, from).length > 1 ? Math.max(1, faceUp[from.index] - 1) : 0;
          }
          if (to.group === 'reserve') faceUp[to.index] = visibleReserve(state, to.index).length + 1;
        }
        pile(state, to).push(pile(state, from).pop());
        if (action.to.group === 'goals') state.positionVisits = [];
        break;
      }
      case 'draw':
        if (!player.stock.length) player.stock = player.waste.splice(0).reverse();
        player.drawn.push(player.stock.pop());
        break;
      case 'end':
        if (player.drawn.length) player.waste.push(player.drawn.pop());
        break;
    }
    if (Object.values(player).every(cards => !cards.length)) state.winner = state.turn;
    if (action.type === 'end' && state.winner === null) finishTurn(state, 1 - state.turn);
  }

  function missedRequiredMoves(state, action) {
    const required = requiredMoves(state);
    return required.some(move => sameRef(move.from, action.from) && sameRef(move.to, action.to))
      ? [] : required;
  }

  function setReservePriority(state, enabled) {
    state.reservePriority = enabled;
    if (state.pending) state.pending.required = missedRequiredMoves(state, state.pending.action);
  }

  function play(state, action, review = false) {
    if (state.winner !== null || state.stalled || state.abandoned || state.pending) return 'blocked';
    const player = state.players[state.turn];
    const canDraw = !player.drawn.length && (player.stock.length || player.waste.length);
    const legal = action.type === 'move' ? canMove(state, action.from, action.to)
      : action.type === 'draw' ? canDraw
      : action.type === 'end' && (player.drawn.length || !canDraw);
    if (!legal) return 'invalid';
    const missed = missedRequiredMoves(state, action);
    if (review || missed.length) {
      state.pending = { action, required: missed };
      return 'challenge';
    }
    apply(state, action);
    return 'played';
  }

  function resolveChallenge(state, challenger, correctionIndex = null) {
    if (!state.pending || challenger !== 1 - state.turn) return false;
    const { action, required } = state.pending;
    const correction = required[correctionIndex];
    if (correctionIndex !== null && !correction) return false;
    state.pending = null;
    apply(state, correction ?? action);
    if (correction && state.winner === null) {
      // The unplayed card from hand stays on top of the draw pile for the next turn.
      const player = state.players[state.turn];
      if (player.drawn.length) player.stock.push(player.drawn.pop());
      finishTurn(state, challenger);
    }
    return true;
  }

  function preferredFoundationIndex(state, moves) {
    if (!moves.length) return -1;
    const { from, to } = moves[0];
    if (state.goals[to.index].length) return 0;
    const card = top(pile(state, from));
    function score(index) {
      const neighbor = state.goals[index ^ 1][0];
      if (neighbor === undefined) return Math.floor(index / 2) % 2 === suit(card) % 2 ? 2 : 1;
      if (suit(neighbor) === suit(card)) return 4;
      return 0;
    }
    return moves.reduce((best, move, index) =>
      sameRef(from, move.from) && score(move.to.index) > score(moves[best].to.index) ? index : best, 0);
  }

  function consolidationPlan(state, level) {
    const rows = refs('rows');
    for (const from of rows) {
      const source = pile(state, from);
      if (source.length !== 1) continue;
      const to = rows.find(target => pile(state, target).length && canMove(state, from, target));
      if (to) return [{ type: 'move', from, to }];
    }
    if (level === 'medium') return [];
    const sources = level === 'expert'
      ? [...rows].sort((a, b) => pile(state, b).length - pile(state, a).length) : rows;
    for (const from of sources) {
      const source = pile(state, from);
      if (source.length < 2) continue;
      for (const to of rows) {
        const target = pile(state, to);
        if (sameRef(from, to) || !target.length ||
            rank(source[0]) + 1 !== rank(top(target)) || color(source[0]) === color(top(target))) continue;
        const plan = findRowTransfer(state, rows, source, to);
        if (plan) return plan;
      }
    }
    return [];
  }

  function findRowTransfer(state, refs, source, target) {
    const moving = new Set(source);
    const destination = [...pile(state, target), ...source].join(',');
    const signature = rows => rows.map(row => row.join(',')).join('|');
    const queue = [{ rows: state.rows, moves: [] }];
    const seen = new Set([signature(state.rows)]);
    for (let cursor = 0; cursor < queue.length && cursor < 600; cursor++) {
      const { rows, moves } = queue[cursor];
      if (rows[target.index].join(',') === destination) return moves;
      if (moves.length >= 10) continue;
      const view = { ...state, rows };
      const firstEmpty = rows.findIndex(row => !row.length);
      for (const from of refs) {
        if (!moving.has(top(rows[from.index]))) continue;
        for (const to of refs) {
          if ((!rows[to.index].length && to.index !== firstEmpty) || !canMove(view, from, to)) continue;
          const next = rows.slice();
          next[from.index] = rows[from.index].slice(0, -1);
          next[to.index] = [...rows[to.index], top(rows[from.index])];
          const key = signature(next);
          if (seen.has(key)) continue;
          seen.add(key);
          queue.push({ rows: next, moves: [...moves, { type: 'move', from, to }] });
        }
      }
    }
  }

  function ordinaryMove(state, sources, level, includeWaste = true, overlookRow = () => false) {
    const targets = [...refs('rows').filter(to => state.rows[to.index].length),
      ...refs('rows').filter(to => !state.rows[to.index].length),
      ...(includeWaste ? [{ group: 'waste', index: 1 - state.turn }] : []),
      { group: 'reserve', index: 1 - state.turn }];
    let moves = sources.flatMap(from => targets.filter(to => canMove(state, from, to))
      .map(to => ({ type: 'move', from, to })));
    if (moves.some(move => move.to.group === 'rows') && overlookRow()) {
      moves = moves.filter(move => move.to.group !== 'rows');
    }
    if (level !== 'expert' || !moves.length) return moves[0];
    return moves.reduce((best, move) => expertMoveScore(state, move) > expertMoveScore(state, best) ? move : best);
  }

  function expertMoveScore(state, { from, to }) {
    const opponent = state.players[1 - state.turn];
    const card = top(pile(state, from));
    const risk = [top(opponent.reserve), top(opponent.waste)].filter(other => other !== undefined &&
      suit(other) === suit(card) && Math.abs(rank(other) - rank(card)) === 1).length;
    if (to.group === 'waste') return 6 - 2 * risk;
    if (to.group === 'reserve') return 5 - 2 * risk;
    return (pile(state, to).length ? 4 : 0) + (from.group === 'reserve' ? 2 : 0);
  }

  function tableauWasteScore(state, from, level) {
    const source = pile(state, from);
    const card = top(source);
    const revealed = source.at(-2);
    const opponent = state.players[1 - state.turn];
    const goals = state.goals.map(top).filter(value => value !== undefined && suit(value) === suit(card));
    const nearFoundation = goals.some(value => rank(value) === rank(card) - 2);
    const unlocksFoundation = revealed !== undefined && state.goals.some(goal => {
      const last = top(goal);
      return last === undefined ? rank(revealed) === 1
        : suit(revealed) === suit(last) && rank(revealed) === rank(last) + 1;
    });
    let score = 3 + (source.length === 1 ? 1 : 0) + (unlocksFoundation ? 3 : 0);
    if (nearFoundation) score -= opponent.stock.length ? 1 : 5;
    if (level === 'expert' && revealed !== undefined) {
      // The newly exposed card may be usable against the computer next turn.
      const counterTargets = [top(state.players[state.turn].reserve), top(state.players[state.turn].waste)];
      if (counterTargets.some(value => value !== undefined && suit(value) === suit(revealed) &&
          Math.abs(rank(value) - rank(revealed)) === 1)) score -= 3;
    }
    return score;
  }

  function tableauWasteMove(state, level) {
    const to = { group: 'waste', index: 1 - state.turn };
    const sources = refs('rows').filter(from => canMove(state, from, to));
    if (!sources.length) return;
    if (level === 'easy' || level === 'medium') return { type: 'move', from: sources[0], to };
    const from = sources.reduce((best, candidate) =>
      tableauWasteScore(state, candidate, level) > tableauWasteScore(state, best, level) ? candidate : best);
    const score = tableauWasteScore(state, from, level);
    if (score > 0) return { type: 'move', from, to, score };
  }

  function computerAction(state, continuation = [], overlook = false, level = 'high', overlookWaste = () => false, overlookRow = () => false) {
    const required = requiredMoves(state);
    const reserve = { group: 'reserve', index: state.turn };
    const drawn = { group: 'drawn', index: state.turn };
    if (required.length) {
      const missed = overlook && ordinaryMove(state, [reserve, drawn, ...refs('rows')], level, false);
      return missed || required[preferredFoundationIndex(state, required)];
    }
    const foundations = goalMoves(state, [reserve, drawn, ...refs('rows')]);
    if (foundations.length) return foundations[preferredFoundationIndex(state, foundations)];

    if (continuation.length && canMove(state, continuation[0].from, continuation[0].to)) {
      const [first, ...next] = continuation;
      return next.length ? { ...first, continuation: next } : first;
    }

    const ordinary = ordinaryMove(state, [reserve, drawn], level, true, overlookRow);
    if (state.players[state.turn].drawn.length) return ordinary ?? { type: 'end' };
    if (ordinary && level !== 'expert') return ordinary;
    const attack = tableauWasteMove(state, level);
    if (attack && (!ordinary || attack.score > expertMoveScore(state, ordinary)) && !overlookWaste()) {
      return { type: attack.type, from: attack.from, to: attack.to };
    }
    if (ordinary) return ordinary;
    const plan = level === 'easy' ? [] : consolidationPlan(state, level);
    if (plan.length) {
      const [first, ...next] = plan;
      return next.length ? { ...first, continuation: next } : first;
    }
    const player = state.players[state.turn];
    return { type: !player.drawn.length && (player.stock.length || player.waste.length) ? 'draw' : 'end' };
  }

  function cardsRemaining(player) {
    return player.reserve.length + player.stock.length + player.drawn.length + player.waste.length;
  }

  function resultWinner(state) {
    if (state.winner !== null || !state.stalled) return state.winner;
    const [human, computer] = state.players.map(cardsRemaining);
    return human === computer ? null : human < computer ? 0 : 1;
  }

  function setKingsOnly(state, enabled) {
    state.kingsOnly = enabled;
    const action = state.pending?.action;
    if (action?.type === 'move' && !canMove(state, action.from, action.to)) state.pending = null;
  }

  function setStrict(state, enabled, keepReview = false) {
    state.strict = enabled;
    if (!enabled && state.pending && !keepReview) return resolveChallenge(state, 1 - state.turn);
  }

  const engine = { rank, suit, color, deal, canMove, requiredMoves, play, resolveChallenge, computerAction, preferredFoundationIndex, setKingsOnly, setStrict, quickFoundation, cardsRemaining, resultWinner, settlementAvailability, proposeSettlement, declineSettlement, visibleReserve, setReservePriority };
  if (typeof module === 'object') module.exports = engine;
  else root.GaribaldkaEngine = engine;
})(globalThis);
