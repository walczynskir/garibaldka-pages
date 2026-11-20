const GaribaldkaProgress = (() => {
  const copy = {
    pl: ['Moje postępy','Ukończone','Wygrane','Przegrane','Skuteczność','Najlepsza seria wygranych','Porzucone','Ostatnie wyniki','Brak zapisanych wyników','Wygrana','Przegrana','Remis','Porzucenie','Następna nagroda','Zamknij'],
    en: ['My progress','Completed','Wins','Losses','Win rate','Best winning streak','Abandoned','Recent results','No recorded results','Win','Loss','Draw','Abandoned','Next reward','Close'],
    es: ['Mi progreso','Completadas','Victorias','Derrotas','Tasa de victorias','Mejor racha de victorias','Abandonadas','Resultados recientes','Sin resultados registrados','Victoria','Derrota','Empate','Abandono','Próxima recompensa','Cerrar'],
    de: ['Meine Fortschritte','Abgeschlossen','Siege','Niederlagen','Siegquote','Beste Siegesserie','Aufgegeben','Letzte Ergebnisse','Keine gespeicherten Ergebnisse','Sieg','Niederlage','Unentschieden','Aufgabe','Nächste Belohnung','Schließen'],
    'zh-Hans': ['我的进度','已完成','胜场','负场','胜率','最长连胜','已放弃','近期结果','暂无记录','胜利','失败','平局','放弃','下一项奖励','关闭'],
    hi: ['मेरी प्रगति','पूरे खेल','जीत','हार','जीत की दर','सबसे लंबी जीत की लड़ी','छोड़े गए','हाल के नतीजे','कोई नतीजा दर्ज नहीं है','जीत','हार','बराबरी','छोड़ा गया','अगला इनाम','बंद करें'],
    fr: ['Mes progrès','Terminées','Victoires','Défaites','Taux de victoire','Meilleure série de victoires','Abandonnées','Derniers résultats','Aucun résultat enregistré','Victoire','Défaite','Égalité','Abandon','Prochaine récompense','Fermer'],
    ar: ['تقدمي','المكتملة','الفوز','الخسارة','نسبة الفوز','أطول سلسلة انتصارات','المتروكة','آخر النتائج','لا توجد نتائج مسجلة','فوز','خسارة','تعادل','ترك المباراة','المكافأة التالية','إغلاق'],
    it: ['I miei progressi','Completate','Vittorie','Sconfitte','Percentuale di vittorie','Miglior serie di vittorie','Abbandonate','Ultimi risultati','Nessun risultato registrato','Vittoria','Sconfitta','Pareggio','Abbandono','Prossimo premio','Chiudi'],
    uk: ['Мій поступ','Завершені','Перемоги','Поразки','Частка перемог','Найдовша серія перемог','Покинуті','Останні результати','Немає збережених результатів','Перемога','Поразка','Нічия','Покинута гра','Наступна нагорода','Закрити']
  };
  const outcomeLabels = { win: 9, loss: 10, draw: 11, abandoned: 12 };
  const get = id => document.getElementById(id);

  function paintBar(language, wins, next) {
    const labels = copy[language] ?? copy.en;
    const number = new Intl.NumberFormat(language);
    get('progress-name').textContent = labels[0];
    get('progress-wins').textContent = number.format(wins);
    const description = [labels[0], labels[2] + ' ' + number.format(wins)];
    const reward = get('progress-reward');
    reward.hidden = !next;
    if (next) {
      const fraction = number.format(next.count) + '/' + number.format(next.threshold);
      reward.lastElementChild.textContent = fraction;
      description.push(labels[13] + ' ' + next.name + ' ' + fraction);
      reward.title = labels[13] + ' · ' + next.name;
    }
    get('my-progress').setAttribute('aria-label', description.join(' · '));
  }

  function paintStats(language, results) {
    const labels = copy[language] ?? copy.en;
    const counts = { win: 0, loss: 0, draw: 0, abandoned: 0 };
    let streak = 0;
    let best = 0;
    for (const { outcome } of results) {
      counts[outcome]++;
      streak = outcome === 'win' ? streak + 1 : 0;
      best = Math.max(best, streak);
    }
    const decided = counts.win + counts.loss;
    const number = new Intl.NumberFormat(language);
    const rate = new Intl.NumberFormat(language, { style: 'percent', maximumFractionDigits: 1 });
    const values = [decided + counts.draw, counts.win, counts.loss,
      decided ? rate.format(counts.win / decided) : '—', best, counts.abandoned];
    get('statistics-title').textContent = labels[0];
    get('statistics-close').setAttribute('aria-label', labels[14]);
    const metrics = get('statistics-metrics');
    metrics.replaceChildren(...values.map((value, index) => {
      const pair = document.createElement('div');
      pair.className = 'progress-stat';
      const term = document.createElement('dt');
      term.textContent = labels[index + 1];
      const detail = document.createElement('dd');
      detail.textContent = typeof value === 'number' ? number.format(value) : value;
      pair.append(term, detail);
      return pair;
    }));
    get('statistics-recent-title').textContent = labels[7];
    const empty = get('statistics-empty');
    empty.hidden = results.length > 0;
    empty.textContent = labels[8];
    const date = new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' });
    get('statistics-recent').replaceChildren(...results.slice(-8).reverse().map(({ outcome, endedAt }) => {
      const item = document.createElement('li');
      const result = document.createElement('strong');
      result.textContent = labels[outcomeLabels[outcome]];
      const time = document.createElement('time');
      time.dateTime = new Date(endedAt).toISOString();
      time.textContent = date.format(endedAt);
      item.append(result, time);
      return item;
    }));
  }

  return { paintBar, paintStats };
})();
