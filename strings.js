const garibaldkaStrings = {
  pl: ['Gracz', 'Magazynek', 'Ręka', 'Kosz', 'Rząd', 'Stos środkowy', 'Pusto', 'Odkryj kartę', 'Zakończ turę', 'Tura gracza', 'Wygrywa gracz', 'Gracz może zgłosić Stop!', 'Przepuść ruch', 'Tylko król w pustym rzędzie', 'Pusty rząd przyjmuje tylko króla. Po wyłączeniu można położyć dowolną kartę.', 'Po pominięciu ruchu na środek przeciwnik może wskazać obowiązkowy ruch i przejąć turę.', 'Zmiany obowiązują od nowej partii.', 'Wybierz wierzchnią kartę, a potem jej cel. W rzędach układaj malejąco na przemian czerwone i czarne. Na środku układaj od asa do króla w tym samym kolorze karcianym. Na magazynek lub kosz przeciwnika możesz dołożyć kartę tego samego koloru o jeden stopień wyższą lub niższą. Wygrywa osoba, która pierwsza opróżni własny magazynek, rękę i kosz.', 'Pełny ekran', 'Wyjdź z pełnego ekranu', 'Partia zapisywana na tym urządzeniu', 'Nie udało się zapisać partii'],
  en: ['Player', 'Reserve', 'Hand', 'Waste', 'Row', 'Foundation', 'Empty', 'Reveal card', 'End turn', 'Turn of player', 'Winner: player', 'Player may call Stop!', 'Allow move', 'Only kings in empty rows', 'Empty rows accept only kings. Turn this off to allow any card.', 'If a foundation move is skipped, the opponent can select the required move and take the turn.', 'Changes apply to the next game.', 'Select an exposed card, then its destination. Build rows down in alternating colours and foundations up from ace to king in suit. You can add a card to the opponent’s reserve or waste if it is one rank higher or lower in the same suit. The first player to empty their reserve, hand and waste wins.', 'Fullscreen', 'Exit fullscreen', 'Game saved on this device', 'Could not save the game']
};
Object.assign(garibaldkaStrings, {
  de: ['Spieler','Reserve','Hand','Ablage','Reihe','Grundstapel','Leer','Karte aufdecken','Zug beenden','Am Zug: Spieler','Gewonnen hat Spieler','Stop! ist möglich','Zug erlauben','Nur Könige in leeren Reihen','Eine leere Reihe nimmt nur Könige auf. Ohne diese Option ist jede Karte erlaubt.','Wird ein Pflichtzug zum Grundstapel übersprungen, kann der Gegner ihn wählen und den Zug übernehmen.','Änderungen gelten ab dem nächsten Spiel.','Wähle eine offene Karte und ihr Ziel. Baue Reihen absteigend mit wechselnden Farben und Grundstapel vom Ass zum König in derselben Kartenfarbe. Auf die Reserve oder Ablage des Gegners darf eine Karte derselben Farbe mit benachbartem Rang. Wer zuerst Reserve, Hand und Ablage leert, gewinnt.','Vollbild','Vollbild verlassen','Spiel auf diesem Gerät gespeichert','Spiel konnte nicht gespeichert werden'],
  es: ['Jugador','Reserva','Mano','Descarte','Fila','Base','Vacío','Revelar carta','Terminar turno','Turno del jugador','Gana el jugador','Se puede cantar Stop!','Permitir jugada','Solo reyes en filas vacías','Solo los reyes pueden ocupar una fila vacía. Desactiva la opción para admitir cualquier carta.','Si se omite una jugada a una base, el rival puede elegir la jugada obligatoria y tomar el turno.','Los cambios se aplican en la próxima partida.','Elige una carta descubierta y su destino. Forma filas descendentes alternando rojo y negro, y bases del as al rey del mismo palo. Puedes añadir a la reserva o descarte rival una carta del mismo palo de valor inmediatamente superior o inferior. Gana quien vacíe su reserva, mano y descarte.','Pantalla completa','Salir de pantalla completa','Partida guardada en este dispositivo','No se pudo guardar la partida'],
  fr: ['Joueur','Réserve','Talon','Défausse','Rangée','Fondation','Vide','Retourner une carte','Terminer le tour','Tour du joueur','Victoire du joueur','Le joueur peut dire Stop !','Accepter le coup','Rois seuls dans les rangées vides','Une rangée vide reçoit seulement un roi. Désactivez cette option pour accepter toute carte.','Si un coup vers une fondation est omis, l’adversaire peut choisir le coup obligatoire et prendre la main.','Les changements s’appliquent à la prochaine partie.','Choisissez une carte visible et sa destination. Construisez les rangées en ordre décroissant en alternant rouge et noir, et les fondations de l’as au roi dans la même enseigne. Sur la réserve ou la défausse adverse, ajoutez une carte de même enseigne et de rang voisin. Le premier à vider sa réserve, son talon et sa défausse gagne.','Plein écran','Quitter le plein écran','Partie enregistrée sur cet appareil','Échec de l’enregistrement'],
  it: ['Giocatore','Riserva','Mazzo','Scarti','Fila','Base','Vuoto','Scopri carta','Termina turno','Turno del giocatore','Vince il giocatore','Si può chiamare Stop!','Consenti mossa','Solo re nelle file vuote','Una fila vuota accetta solo i re. Disattiva per accettare qualsiasi carta.','Se si salta una mossa verso una base, l’avversario può scegliere la mossa obbligatoria e prendere il turno.','Le modifiche valgono dalla prossima partita.','Scegli una carta scoperta e la sua destinazione. Costruisci le file in ordine decrescente alternando rosso e nero e le basi dall’asso al re dello stesso seme. Puoi aggiungere alla riserva o agli scarti avversari una carta dello stesso seme di valore subito superiore o inferiore. Vince chi svuota per primo riserva, mazzo e scarti.','Schermo intero','Esci da schermo intero','Partita salvata su questo dispositivo','Impossibile salvare la partita'],
  uk: ['Гравець','Резерв','Колода','Скид','Ряд','Центральна стопка','Порожньо','Відкрити карту','Завершити хід','Хід гравця','Перемагає гравець','Можна оголосити «Стоп!»','Дозволити хід','Лише королі в порожніх рядах','У порожній ряд можна покласти лише короля. Вимкніть, щоб дозволити будь-яку карту.','Якщо пропущено хід до центру, суперник може вибрати обов’язковий хід і перебрати чергу.','Зміни діють з наступної партії.','Виберіть відкриту карту, а потім місце для неї. У рядах викладайте карти за спаданням, чергуючи червоні й чорні. У центрі складайте карти однієї масті від туза до короля. До резерву або скиду суперника можна додати карту тієї самої масті на один ранг вище або нижче. Перемагає той, хто першим спорожнить резерв, колоду й скид.','На весь екран','Вийти з повноекранного режиму','Гру збережено на цьому пристрої','Не вдалося зберегти гру'],
  ar: ['اللاعب','الاحتياط','الرزمة','المهملات','الصف','الكومة الوسطى','فارغ','اكشف بطاقة','أنه الدور','دور اللاعب','الفائز هو اللاعب','يمكن إعلان «توقف!»','اسمح بالحركة','الملوك فقط في الصفوف الفارغة','يقبل الصف الفارغ ملكًا فقط. عطّل الخيار للسماح بأي بطاقة.','إذا تم تجاوز حركة إلى الوسط، يمكن للخصم اختيار الحركة الإلزامية وتولي الدور.','تسري التغييرات من الجولة التالية.','اختر بطاقة مكشوفة ثم وجهتها. رتب الصفوف تنازليًا بالتناوب بين الأحمر والأسود، وابن الأكوام الوسطى من الآس إلى الملك من النوع نفسه. يمكنك إضافة بطاقة إلى احتياط الخصم أو مهملاته إذا كانت من النوع نفسه وأعلى أو أدنى بدرجة واحدة. يفوز من يفرغ احتياطه ورزمته ومهملاته أولًا.','ملء الشاشة','الخروج من ملء الشاشة','حُفظت اللعبة على هذا الجهاز','تعذر حفظ اللعبة'],
  hi: ['खिलाड़ी','भंडार','गड्डी','त्याग ढेर','पंक्ति','केंद्रीय ढेर','खाली','पत्ता खोलें','बारी समाप्त करें','इस खिलाड़ी की बारी','विजेता खिलाड़ी','स्टॉप! कह सकते हैं','चाल की अनुमति दें','खाली पंक्ति में केवल राजा','खाली पंक्ति में केवल राजा रखें। किसी भी पत्ते की अनुमति के लिए इसे बंद करें।','केंद्रीय ढेर की अनिवार्य चाल छूटे तो विरोधी उसे चुनकर बारी ले सकता है।','बदलाव अगले खेल से लागू होंगे।','खुला पत्ता और फिर उसका स्थान चुनें। पंक्तियों में घटते क्रम में लाल और काले पत्ते बारी-बारी रखें। केंद्रीय ढेर में एक ही सूट के पत्ते इक्के से राजा तक रखें। विरोधी के भंडार या त्याग ढेर पर उसी सूट का एक दर्जा ऊपर या नीचे का पत्ता रख सकते हैं। जो पहले अपने तीनों ढेर खाली करे वह जीतेगा।','पूर्ण स्क्रीन','पूर्ण स्क्रीन से बाहर निकलें','खेल इस डिवाइस पर सहेजा गया','खेल सहेजा नहीं जा सका'],
  'zh-Hans': ['玩家','储备堆','手牌堆','弃牌堆','牌列','中央牌堆','空','翻牌','结束回合','当前玩家','获胜玩家','可喊“停！”','允许此步','空列只放K','空列只接受K。关闭后可放任意可用牌。','若跳过中央牌堆的必走步骤，对手可以选择该步并接手回合。','设置从下一局起生效。','先选一张明牌，再选目标。牌列按红黑交替降序排列，中央牌堆按同花色从A排到K。可将同花色且点数相差一级的牌放到对手的储备堆或弃牌堆。先清空自己的储备堆、手牌堆和弃牌堆者获胜。','全屏','退出全屏','本局已保存在此设备上','无法保存本局']
});
const stallLabels = {
  pl: 'Impas. Żaden gracz nie może wykonać ruchu.', en: 'Stalemate. Neither player has a move.',
  es: 'Tablas. Ningún jugador puede mover.', de: 'Patt. Kein Spieler kann ziehen.',
  'zh-Hans': '僵局。双方都没有可走的步骤。', hi: 'गतिरोध। दोनों खिलाड़ियों के पास कोई चाल नहीं है।',
  fr: 'Blocage. Aucun joueur ne peut jouer.', ar: 'تعادل. لا يستطيع أي لاعب التحرك.',
  it: 'Stallo. Nessun giocatore può muovere.', uk: 'Пат. Жоден гравець не може зробити хід.'
};
const opponentStrings = {
  pl: ['Ty','Komputer','Twój ruch','Ruch komputera','Wygrywasz!','Komputer wygrywa.','Komputer sprawdza obowiązkowy ruch…','Możesz zgłosić „Stop!”'],
  en: ['You','Computer','Your turn','Computer’s turn','You win!','Computer wins.','The computer is checking the required move…','You may call Stop!'],
  es: ['Tú','Computadora','Tu turno','Turno de la computadora','¡Ganas!','Gana la computadora.','La computadora comprueba la jugada obligatoria…','Puedes decir «¡Alto!»'],
  de: ['Du','Computer','Du bist am Zug','Der Computer ist am Zug','Du gewinnst!','Der Computer gewinnt.','Der Computer prüft den Pflichtzug…','Du kannst „Stop!“ sagen.'],
  'zh-Hans': ['你','电脑','轮到你','轮到电脑','你赢了！','电脑获胜。','电脑正在检查必走步骤…','你可以喊“停！”'],
  hi: ['आप','कंप्यूटर','आपकी बारी','कंप्यूटर की बारी','आप जीत गए!','कंप्यूटर जीत गया।','कंप्यूटर अनिवार्य चाल जाँच रहा है…','आप स्टॉप! कह सकते हैं।'],
  fr: ['Vous','Ordinateur','À vous de jouer','Tour de l’ordinateur','Vous gagnez !','L’ordinateur gagne.','L’ordinateur vérifie le coup obligatoire…','Vous pouvez dire « Stop ! »'],
  ar: ['أنت','الحاسوب','دورك','دور الحاسوب','لقد فزت!','فاز الحاسوب.','يتحقق الحاسوب من الحركة الإلزامية…','يمكنك إعلان «توقف!»'],
  it: ['Tu','Computer','Tocca a te','Tocca al computer','Hai vinto!','Vince il computer.','Il computer controlla la mossa obbligatoria…','Puoi dire «Stop!»'],
  uk: ['Ви','Комп’ютер','Ваш хід','Хід комп’ютера','Ви перемогли!','Комп’ютер переміг.','Комп’ютер перевіряє обов’язковий хід…','Ви можете оголосити «Стоп!»']
};

const immediateRuleLabels = {
  pl: 'Zmiana działa od razu.', en: 'Changes apply immediately.',
  es: 'El cambio se aplica de inmediato.', de: 'Die Änderung gilt sofort.',
  'zh-Hans': '更改立即生效。', hi: 'बदलाव तुरंत लागू होता है।',
  fr: 'Le changement prend effet immédiatement.', ar: 'يسري التغيير فورًا.',
  it: 'La modifica ha effetto immediato.', uk: 'Зміна діє відразу.'
};

const historyStrings = {
  pl: ['Cofnij','Przywróć','Pokaż Cofnij i Przywróć','Działa od razu. Cofnij wraca do stanu sprzed Twojego ostatniego ruchu, razem z odpowiedzią komputera. Nowy ruch po cofnięciu usuwa możliwość przywrócenia.'],
  en: ['Undo','Redo','Show Undo and Redo','Applies immediately. Undo takes you back before your last move, including the computer’s response. A new move clears redo.'],
  es: ['Deshacer','Rehacer','Mostrar Deshacer y Rehacer','Se aplica de inmediato. Deshacer revierte tu última jugada y la respuesta de la computadora. Una nueva jugada borra la opción de rehacer.'],
  de: ['Rückgängig','Wiederholen','Rückgängig und Wiederholen anzeigen','Gilt sofort. Rückgängig nimmt deinen letzten Zug samt Antwort des Computers zurück. Ein neuer Zug löscht die Wiederholungsmöglichkeit.'],
  'zh-Hans': ['撤销','重做','显示撤销和重做','立即生效。撤销会退回到你上一步之前，包括电脑的应对。走新一步会清除重做记录。'],
  hi: ['पूर्ववत करें','फिर से करें','पूर्ववत और फिर से करें दिखाएँ','तुरंत लागू होता है। पूर्ववत करने पर आपकी पिछली चाल और कंप्यूटर का जवाब वापस होते हैं। नई चाल से फिर से करने का विकल्प मिट जाता है।'],
  fr: ['Annuler','Rétablir','Afficher Annuler et Rétablir','Effet immédiat. Annuler revient avant votre dernier coup et la réponse de l’ordinateur. Un nouveau coup efface le rétablissement.'],
  ar: ['تراجع','إعادة','إظهار التراجع والإعادة','يسري فورًا. يعيد التراجع اللعب إلى ما قبل حركتك الأخيرة ورد الحاسوب. تمحو الحركة الجديدة سجل الإعادة.'],
  it: ['Annulla','Ripristina','Mostra Annulla e Ripristina','Vale subito. Annulla torna a prima della tua ultima mossa e della risposta del computer. Una nuova mossa cancella il ripristino.'],
  uk: ['Скасувати','Повторити','Показати Скасувати й Повторити','Діє відразу. Скасування повертає стан до вашого останнього ходу й відповіді комп’ютера. Новий хід стирає можливість повторення.']
};

const panelStrings = {
  pl: ['Pokaż liczniki kart','Pokazuje liczbę kart w magazynku, ręce i koszu obu graczy. Działa od razu.','Pokaż historię ruchów','Pokazuje do 40 ostatnich ruchów obu graczy, od najnowszego. Działa od razu.','Historia ruchów'],
  en: ['Show card counts','Shows card counts in both players’ reserves, hands and waste piles. Applies immediately.','Show move history','Shows up to 40 moves by either player, newest first. Applies immediately.','Move history'],
  es: ['Mostrar recuentos','Muestra cuántas cartas hay en la reserva, la mano y el descarte de ambos jugadores. Se aplica de inmediato.','Mostrar historial de jugadas','Muestra hasta 40 jugadas de ambos jugadores, de la más reciente a la más antigua. Se aplica de inmediato.','Historial de jugadas'],
  de: ['Kartenzahlen anzeigen','Zeigt die Kartenanzahl in Reserve, Hand und Ablage beider Spieler. Gilt sofort.','Zugverlauf anzeigen','Zeigt bis zu 40 Züge beider Spieler, den neuesten zuerst. Gilt sofort.','Zugverlauf'],
  'zh-Hans': ['显示牌数','显示双方储备堆、手牌堆和弃牌堆的牌数。立即生效。','显示走牌记录','显示双方最近最多40步，从最新一步开始。立即生效。','走牌记录'],
  hi: ['पत्तों की संख्या दिखाएँ','दोनों खिलाड़ियों के भंडार, गड्डी और त्याग ढेर में पत्तों की संख्या दिखाता है। तुरंत लागू होता है।','चालों का इतिहास दिखाएँ','दोनों खिलाड़ियों की अधिकतम 40 हाल की चालें दिखाता है। तुरंत लागू होता है।','चालों का इतिहास'],
  fr: ['Afficher le nombre de cartes','Affiche le nombre de cartes dans la réserve, le talon et la défausse des deux joueurs. Effet immédiat.','Afficher l’historique des coups','Affiche jusqu’à 40 coups des deux joueurs, les plus récents en premier. Effet immédiat.','Historique des coups'],
  ar: ['إظهار عدد البطاقات','يعرض عدد البطاقات في الاحتياط والرزمة والمهملات لكلا اللاعبين. يسري فورًا.','إظهار سجل الحركات','يعرض ما يصل إلى 40 حركة للاعبين، بدءًا بالأحدث. يسري فورًا.','سجل الحركات'],
  it: ['Mostra il numero di carte','Mostra quante carte ci sono nella riserva, nel mazzo e negli scarti di entrambi i giocatori. Vale subito.','Mostra la cronologia delle mosse','Mostra fino a 40 mosse di entrambi i giocatori, dalla più recente. Vale subito.','Cronologia delle mosse'],
  uk: ['Показувати кількість карт','Показує кількість карт у резерві, колоді та скиді обох гравців. Діє відразу.','Показувати історію ходів','Показує до 40 ходів обох гравців, починаючи з найновішого. Діє відразу.','Історія ходів']
};

const animationStrings = {
  pl: ['Szybkość animacji','Zmienia tempo ruchów komputera. Działa od razu.','Wolna','Normalna','Szybka'],
  en: ['Animation speed','Changes the pace of the computer’s moves. Applies immediately.','Slow','Normal','Fast'],
  es: ['Velocidad de animación','Cambia el ritmo de las jugadas de la computadora. Se aplica de inmediato.','Lenta','Normal','Rápida'],
  de: ['Animationsgeschwindigkeit','Ändert das Tempo der Computerzüge. Gilt sofort.','Langsam','Normal','Schnell'],
  'zh-Hans': ['动画速度','调整电脑走牌的速度。立即生效。','慢速','正常','快速'],
  hi: ['एनीमेशन की गति','कंप्यूटर की चालों की गति बदलती है। तुरंत लागू होता है।','धीमी','सामान्य','तेज़'],
  fr: ['Vitesse des animations','Règle le rythme des coups de l’ordinateur. Effet immédiat.','Lente','Normale','Rapide'],
  ar: ['سرعة الحركة','تغيّر وتيرة حركات الحاسوب. تسري فورًا.','بطيئة','عادية','سريعة'],
  it: ['Velocità di animazione','Regola il ritmo delle mosse del computer. Vale subito.','Lenta','Normale','Veloce'],
  uk: ['Швидкість анімації','Змінює темп ходів комп’ютера. Діє відразу.','Повільна','Звичайна','Швидка']
};

const targetStrings = {
  pl: ['Podświetl dostępne miejsca','Wskazuje, gdzie można położyć wybraną kartę. Działa od razu.'],
  en: ['Highlight valid destinations','Shows where you can place the selected card. Applies immediately.'],
  es: ['Resaltar destinos válidos','Muestra dónde puedes colocar la carta seleccionada. Se aplica de inmediato.'],
  de: ['Gültige Ziele hervorheben','Zeigt, wo die ausgewählte Karte abgelegt werden kann. Gilt sofort.'],
  'zh-Hans': ['突出显示可放置位置','显示所选牌可放置的位置。立即生效。'],
  hi: ['मान्य स्थान हाइलाइट करें','दिखाता है कि चुना हुआ पत्ता कहाँ रख सकते हैं। तुरंत लागू होता है।'],
  fr: ['Surligner les destinations valides','Indique où placer la carte sélectionnée. Effet immédiat.'],
  ar: ['تمييز الوجهات المتاحة','يوضح أين يمكنك وضع البطاقة المحددة. يسري فورًا.'],
  it: ['Evidenzia le destinazioni valide','Mostra dove puoi posare la carta selezionata. Vale subito.'],
  uk: ['Підсвічувати доступні місця','Показує, куди можна покласти вибрану карту. Діє відразу.']
};

const lockDrawnStrings = {
  pl: ['Utrzymuj zaznaczenie odkrytej karty','Karta z Ręki pozostaje zaznaczona, aż ją zagrasz lub odłożysz do Kosza. Działa od razu.'],
  en: ['Keep the revealed card selected','The revealed card stays selected until you play or discard it. Applies immediately.'],
  es: ['Mantener seleccionada la carta revelada','La carta revelada sigue seleccionada hasta que la juegues o la descartes. Se aplica de inmediato.'],
  de: ['Aufgedeckte Karte ausgewählt lassen','Die aufgedeckte Karte bleibt ausgewählt, bis du sie spielst oder ablegst. Gilt sofort.'],
  'zh-Hans': ['保持翻开的牌处于选中状态','翻开的牌会保持选中，直到打出或弃掉。立即生效。'],
  hi: ['खुले पत्ते को चुना रहने दें','खुला पत्ता तब तक चुना रहता है जब तक आप उसे खेलें या त्यागें। तुरंत लागू होता है।'],
  fr: ['Garder la carte retournée sélectionnée','La carte retournée reste sélectionnée jusqu’à ce que vous la jouiez ou la défaussiez. Effet immédiat.'],
  ar: ['إبقاء البطاقة المكشوفة محددة','تبقى البطاقة المكشوفة محددة حتى تلعبها أو تتخلص منها. يسري فورًا.'],
  it: ['Mantieni selezionata la carta scoperta','La carta scoperta resta selezionata finché non la giochi o la scarti. Vale subito.'],
  uk: ['Залишати відкриту карту вибраною','Відкрита карта лишається вибраною, доки ви її не зіграєте або не скинете. Діє відразу.']
};

const deckBackStrings = {
  pl: ['Rozróżniaj rewersy talii','Rewers wskazuje, z której talii pochodzi karta, także po odwróceniu Kosza. Działa od razu.'],
  en: ['Distinguish deck backs','Each card keeps its original deck back when the waste pile is recycled. Applies immediately.'],
  es: ['Distinguir los dorsos','Cada carta conserva el dorso de su baraja al reciclar el descarte. Se aplica de inmediato.'],
  de: ['Kartenrücken unterscheiden','Beim Umdrehen der Ablage behält jede Karte den Rücken ihres ursprünglichen Decks. Gilt sofort.'],
  'zh-Hans': ['区分牌背','弃牌堆翻回后，每张牌仍保留原牌组的牌背。立即生效。'],
  hi: ['गड्डियों के पिछले भाग अलग दिखाएँ','त्याग ढेर पलटने पर भी हर पत्ते का पिछला भाग उसकी मूल गड्डी का रहता है। तुरंत लागू होता है।'],
  fr: ['Distinguer les dos des cartes','Chaque carte conserve le dos de son jeu d’origine quand la défausse est retournée. Effet immédiat.'],
  ar: ['تمييز ظهور الرزم','تحتفظ كل بطاقة بظهر رزمتها الأصلية عند قلب كومة المهملات. يسري فورًا.'],
  it: ['Distingui il dorso dei mazzi','Ogni carta conserva il dorso del mazzo originale quando si riciclano gli scarti. Vale subito.'],
  uk: ['Розрізняти сорочки колод','Кожна карта зберігає сорочку початкової колоди після перевертання скиду. Діє відразу.']
};

const stopStrings = {
  pl: ['Zgłaszasz „Stop!”','Komputer zgłasza „Stop!”','Czas na reakcję „Stop!”','Po ruchu komputera pomijającym obowiązkowy ruch masz tyle czasu na „Stop!”. Działa od razu.'],
  en: ['You call Stop!','The computer calls Stop!','Stop! response time','When the computer skips a compulsory move, this is how long you have to call Stop! Applies immediately.'],
  es: ['Dices «¡Alto!»','La computadora dice «¡Alto!»','Tiempo para decir «¡Alto!»','Si la computadora omite una jugada obligatoria, tienes este tiempo para decir «¡Alto!». Se aplica de inmediato.'],
  de: ['Du rufst „Stop!“','Der Computer ruft „Stop!“','Reaktionszeit für „Stop!“','Überspringt der Computer einen Pflichtzug, bleibt dir diese Zeit für „Stop!“. Gilt sofort.'],
  'zh-Hans': ['你喊了“停！”','电脑喊了“停！”','喊停反应时间','电脑跳过必走步骤时，你可在此时间内喊停。立即生效。'],
  hi: ['आपने स्टॉप! कहा','कंप्यूटर ने स्टॉप! कहा','स्टॉप! कहने का समय','कंप्यूटर के अनिवार्य चाल छोड़ने पर स्टॉप! कहने के लिए इतना समय मिलता है। तुरंत लागू होता है।'],
  fr: ['Vous dites « Stop ! »','L’ordinateur dit « Stop ! »','Délai pour dire « Stop ! »','Si l’ordinateur omet un coup obligatoire, vous avez ce délai pour dire « Stop ! ». Effet immédiat.'],
  ar: ['أعلنت «توقف!»','أعلن الحاسوب «توقف!»','مهلة إعلان «توقف!»','إذا تجاوز الحاسوب حركة إلزامية، فهذه مهلة إعلان «توقف!». يسري فورًا.'],
  it: ['Chiami «Stop!»','Il computer chiama «Stop!»','Tempo per chiamare «Stop!»','Se il computer salta una mossa obbligatoria, hai questo tempo per chiamare «Stop!». Vale subito.'],
  uk: ['Ви оголошуєте «Стоп!»','Комп’ютер оголошує «Стоп!»','Час на реакцію «Стоп!»','Якщо комп’ютер пропускає обов’язковий хід, стільки часу ви маєте на «Стоп!». Діє відразу.']
};

const continueStopLabels = {
  pl: 'Kontynuuj', en: 'Continue', es: 'Continuar', de: 'Weiter',
  'zh-Hans': '继续', hi: 'जारी रखें', fr: 'Continuer', ar: 'متابعة',
  it: 'Continua', uk: 'Продовжити'
};

const difficultyStrings = {
  pl: ['Poziom trudności','Poziom zmienia taktykę komputera. Łatwy i Średni pomijają obowiązkowy ruch w 25% i 10% sytuacji, gdy mają inne zagranie. Zmiana działa od razu.','Łatwy','Średni','Wysoki','Ekspert','Kara za błędne „Stop!”','Błędne zgłoszenie powoduje utratę najbliższej tury. Działa od razu.','Błędne „Stop!”','Ruch prawidłowy.','Ruch prawidłowy. Tracisz najbliższą turę.','Po zagraniu karty przez komputer do rzędu lub Magazynku możesz zgłosić „Stop!” w tym czasie. Działa od razu.'],
  en: ['Difficulty','Difficulty changes computer tactics. Easy and Medium skip compulsory moves 25% and 10% of the time when another move is available. Applies immediately.','Easy','Medium','High','Expert','Penalty for a false Stop!','A false call skips your next turn. Applies immediately.','False Stop!','The move was legal.','The move was legal. You lose your next turn.','After each computer move to a row or reserve, you have this long to call Stop! Applies immediately.'],
  es: ['Dificultad','Cambia la táctica. Fácil y Medio omiten jugadas obligatorias un 25 % y un 10 % cuando hay otra opción. Se aplica de inmediato.','Fácil','Medio','Alto','Experto','Penalización por un falso «¡Alto!»','Pierdes el próximo turno. Se aplica de inmediato.','Falso «¡Alto!»','Jugada válida.','Jugada válida. Pierdes el próximo turno.','Tiempo para decir «¡Alto!» tras cada carta que la computadora coloca en una fila o reserva. Se aplica de inmediato.'],
  de: ['Schwierigkeit','Ändert die Taktik. Leicht und Mittel übersehen Pflichtzüge bei einer Alternative in 25 % bzw. 10 % der Fälle. Gilt sofort.','Leicht','Mittel','Hoch','Experte','Strafe für falsches „Stop!“','Du verlierst deinen nächsten Zug. Gilt sofort.','Falsches „Stop!“','Der Zug war gültig.','Der Zug war gültig. Du verlierst deinen nächsten Zug.','So lange kannst du nach jeder Computerkarte in einer Reihe oder Reserve „Stop!“ rufen. Gilt sofort.'],
  'zh-Hans': ['难度','改变电脑策略。有其他走法时，简单和中等分别有25%和10%的概率跳过必走步骤。立即生效。','简单','中等','困难','专家','误喊停的惩罚','误喊停会失去下一回合。立即生效。','误喊停','此步合法。','此步合法。你失去下一回合。','电脑每向牌列或储备堆放一张牌后，你可在此时间内喊停。立即生效。'],
  hi: ['कठिनाई','कंप्यूटर की रणनीति बदलती है। दूसरा विकल्प होने पर आसान और मध्यम स्तर में अनिवार्य चाल छूटने की संभावना 25% और 10% है। तुरंत लागू होता है।','आसान','मध्यम','कठिन','विशेषज्ञ','गलत स्टॉप! की सज़ा','गलत स्टॉप! पर अगली बारी छूटती है। तुरंत लागू होता है।','गलत स्टॉप!','चाल सही थी।','चाल सही थी। आपकी अगली बारी छूटेगी।','कंप्यूटर के पंक्ति या भंडार में पत्ता रखने के बाद स्टॉप! कहने का समय। तुरंत लागू होता है।'],
  fr: ['Difficulté','Change la tactique. Facile et Moyen omettent un coup obligatoire dans 25 % et 10 % des cas si un autre coup existe. Effet immédiat.','Facile','Moyen','Élevé','Expert','Pénalité pour un « Stop ! » injustifié','Vous perdez votre prochain tour. Effet immédiat.','« Stop ! » injustifié','Le coup était valide.','Le coup était valide. Vous perdez votre prochain tour.','Délai pour dire « Stop ! » après chaque carte posée par l’ordinateur dans une rangée ou une réserve. Effet immédiat.'],
  ar: ['الصعوبة','تغيّر أسلوب الحاسوب. عند توفر حركة بديلة، يتجاوز المستوى السهل والمتوسط الحركة الإلزامية بنسبة 25٪ و10٪. تسري فورًا.','سهل','متوسط','عالٍ','خبير','عقوبة إعلان توقف بالخطأ','تفقد دورك التالي. تسري فورًا.','إعلان توقف بالخطأ','الحركة صحيحة.','الحركة صحيحة. تفقد دورك التالي.','مهلة إعلان التوقف بعد كل بطاقة يضعها الحاسوب في صف أو احتياط. تسري فورًا.'],
  it: ['Difficoltà','Cambia la tattica. Facile e Medio saltano una mossa obbligatoria nel 25% e 10% dei casi se esiste un’alternativa. Vale subito.','Facile','Medio','Alto','Esperto','Penalità per uno Stop! errato','Perdi il prossimo turno. Vale subito.','Stop! errato','La mossa era valida.','La mossa era valida. Perdi il prossimo turno.','Tempo per chiamare Stop! dopo ogni carta posata dal computer in una fila o riserva. Vale subito.'],
  uk: ['Складність','Змінює тактику. Легкий і середній рівні пропускають обов’язковий хід у 25% і 10% випадків, коли є інший хід. Діє відразу.','Легкий','Середній','Високий','Експерт','Штраф за помилковий «Стоп!»','Ви пропускаєте наступний хід. Діє відразу.','Помилковий «Стоп!»','Хід був правильним.','Хід був правильним. Ви пропускаєте наступний хід.','Час на «Стоп!» після кожної карти, яку комп’ютер викладає в ряд або резерв. Діє відразу.']
};

const drawResultLabels = {
  pl: 'Remis.', en: 'Draw.', es: 'Empate.', de: 'Unentschieden.',
  'zh-Hans': '平局。', hi: 'बराबरी।', fr: 'Match nul.', ar: 'تعادل.',
  it: 'Pareggio.', uk: 'Нічия.'
};

const endingStrings = {
  pl: ['Zakończ partię','Zakończyć tę partię? Zostanie zapisana jako przerwana, bez zwycięzcy.','Graj dalej','Partia przerwana.','Impas po trzykrotnym powtórzeniu pozycji.'],
  en: ['End game','End this game? It will be saved as abandoned, with no winner.','Keep playing','Game abandoned.','Stalemate after the position repeated three times.'],
  es: ['Terminar partida','¿Terminar esta partida? Se guardará como abandonada, sin ganador.','Seguir jugando','Partida abandonada.','Tablas por triple repetición de la posición.'],
  de: ['Spiel beenden','Dieses Spiel beenden? Es wird ohne Sieger als abgebrochen gespeichert.','Weiterspielen','Spiel abgebrochen.','Patt nach dreimaliger Stellungswiederholung.'],
  'zh-Hans': ['结束游戏','结束本局吗？本局将记为中止，无胜者。','继续游戏','本局已中止。','同一局面出现三次，陷入僵局。'],
  hi: ['खेल समाप्त करें','क्या खेल समाप्त करें? इसे बिना विजेता के अधूरा सहेजा जाएगा।','खेलते रहें','खेल बीच में समाप्त हुआ।','एक ही स्थिति तीन बार आने से गतिरोध।'],
  fr: ['Terminer la partie','Terminer cette partie ? Elle sera enregistrée comme abandonnée, sans vainqueur.','Continuer à jouer','Partie abandonnée.','Blocage après trois répétitions de la position.'],
  ar: ['إنهاء اللعبة','هل تريد إنهاء هذه اللعبة؟ ستُحفظ كلعبة متروكة بلا فائز.','متابعة اللعب','أُنهيت اللعبة بلا فائز.','جمود بعد تكرار الوضع ثلاث مرات.'],
  it: ['Termina partita','Terminare questa partita? Sarà salvata come abbandonata, senza vincitore.','Continua a giocare','Partita abbandonata.','Stallo dopo tre ripetizioni della posizione.'],
  uk: ['Завершити партію','Завершити цю партію? Її буде збережено як перервану, без переможця.','Грати далі','Партію перервано.','Пат після триразового повторення позиції.']
};

const settlementStrings = {
  pl: ['Zaproponuj rozstrzygnięcie','Komputer proponuje rozstrzygnięcie','Wygrywa strona z mniejszą łączną liczbą kart. Równa liczba oznacza remis.','Rozstrzygnij partię','Komputer chce grać dalej. Możesz ponowić propozycję po dwóch turach bez postępu.','Partia rozstrzygnięta według liczby kart.'],
  en: ['Propose a settlement','The computer proposes a settlement','The side with fewer cards wins. Equal counts mean a draw.','Settle game','The computer wants to keep playing. You can propose again after two turns without progress.','Game settled by card count.'],
  es: ['Proponer un desenlace','La computadora propone un desenlace','Gana quien tenga menos cartas. Si tienen las mismas, hay empate.','Resolver partida','La computadora quiere seguir. Puedes proponerlo tras dos turnos sin progreso.','Partida resuelta por número de cartas.'],
  de: ['Entscheidung vorschlagen','Der Computer schlägt eine Entscheidung vor','Wer weniger Karten hat, gewinnt. Bei Gleichstand gibt es ein Unentschieden.','Spiel entscheiden','Der Computer möchte weiterspielen. Nach zwei Zügen ohne Fortschritt kannst du erneut vorschlagen.','Das Spiel wurde nach Kartenanzahl entschieden.'],
  'zh-Hans': ['提议结算','电脑提议结算','剩余牌较少的一方获胜。牌数相同则平局。','结算本局','电脑想继续。两回合没有进展后可以再次提议。','本局按剩余牌数结算。'],
  hi: ['नतीजा तय करने का प्रस्ताव','कंप्यूटर नतीजा तय करने का प्रस्ताव देता है','जिसके पास कम पत्ते हैं वह जीतता है। बराबर संख्या पर खेल बराबर है।','नतीजा तय करें','कंप्यूटर खेलना जारी रखना चाहता है। दो बारियों तक प्रगति न हो तो फिर प्रस्ताव दें।','बचे पत्तों की संख्या से नतीजा तय हुआ।'],
  fr: ['Proposer de départager','L’ordinateur propose de départager','Le camp avec le moins de cartes gagne. À égalité, la partie est nulle.','Départager la partie','L’ordinateur veut continuer. Vous pouvez renouveler la proposition après deux tours sans progrès.','Partie départagée au nombre de cartes.'],
  ar: ['اقترح حسم اللعبة','يقترح الحاسوب حسم اللعبة','يفوز من لديه بطاقات أقل. تساوي العدد يعني التعادل.','احسم اللعبة','يريد الحاسوب المتابعة. يمكنك إعادة الاقتراح بعد دورين بلا تقدم.','حُسمت اللعبة بعدد البطاقات.'],
  it: ['Proponi di decidere la partita','Il computer propone di decidere la partita','Vince chi ha meno carte. A parità è un pareggio.','Decidi la partita','Il computer vuole continuare. Puoi riproporlo dopo due turni senza progressi.','Partita decisa in base alle carte rimaste.'],
  uk: ['Запропонувати розв’язку','Комп’ютер пропонує розв’язку','Перемагає той, у кого менше карт. Однакова кількість означає нічию.','Визначити результат','Комп’ютер хоче грати далі. Після двох ходів без прогресу можна запропонувати знову.','Результат визначено за кількістю карт.']
};

const settingsGroupStrings = {
  pl: { play: 'Rozgrywka', stop: 'Stop!', controls: 'Sterowanie i podpowiedzi', display: 'Wygląd i informacje' },
  en: { play: 'Gameplay', stop: 'Stop!', controls: 'Controls and hints', display: 'Display and information' },
  es: { play: 'Partida', stop: '¡Alto!', controls: 'Controles y ayudas', display: 'Aspecto e información' },
  de: { play: 'Spiel', stop: 'Stop!', controls: 'Steuerung und Hinweise', display: 'Anzeige und Informationen' },
  'zh-Hans': { play: '游戏规则', stop: '停！', controls: '操作和提示', display: '显示和信息' },
  hi: { play: 'खेल', stop: 'स्टॉप!', controls: 'नियंत्रण और संकेत', display: 'दिखावट और जानकारी' },
  fr: { play: 'Partie', stop: 'Stop !', controls: 'Commandes et aides', display: 'Affichage et informations' },
  ar: { play: 'اللعب', stop: 'توقف!', controls: 'التحكم والتلميحات', display: 'العرض والمعلومات' },
  it: { play: 'Partita', stop: 'Stop!', controls: 'Comandi e suggerimenti', display: 'Aspetto e informazioni' },
  uk: { play: 'Гра', stop: 'Стоп!', controls: 'Керування й підказки', display: 'Вигляд та інформація' }
};

const reservePriorityStrings = {
  pl: ['Pierwszeństwo Magazynku','Przy włączonym „Stop!” karta z Magazynku ma pierwszeństwo, jeśli pasuje na środek. Po wyłączeniu wybierasz dowolne dostępne zagranie na środek. Działa od razu.'],
  en: ['Reserve priority','With Stop! on, play a reserve card to the center first when it fits. Turn this off to choose any available foundation move. Applies immediately.'],
  es: ['Prioridad de la reserva','Con «¡Alto!» activado, juega primero desde la reserva si la carta encaja en una base. Desactívalo para elegir cualquier jugada a una base. Se aplica de inmediato.'],
  de: ['Vorrang der Reserve','Mit „Stop!“ hat eine passende Reservekarte Vorrang. Ohne diese Option sind alle möglichen Züge zur Mitte gleichberechtigt. Gilt sofort.'],
  'zh-Hans': ['储备堆优先','启用“停！”时，能放到中央的储备牌优先。关闭后可任选合法的中央走法。立即生效。'],
  hi: ['भंडार को प्राथमिकता','स्टॉप! चालू होने पर केंद्र में रख सकने वाला भंडार का पत्ता पहले खेलें। इसे बंद करके केंद्र की कोई भी मान्य चाल चुनें। तुरंत लागू होता है।'],
  fr: ['Priorité à la réserve','Avec « Stop ! », jouez d’abord la carte de réserve si elle peut aller au centre. Désactivez cette option pour choisir librement le coup vers le centre. Effet immédiat.'],
  ar: ['أولوية الاحتياط','عند تفعيل «توقف!» تُلعب بطاقة الاحتياط أولًا إذا كانت تناسب الوسط. عطّل الخيار لاختيار أي حركة متاحة إلى الوسط. يسري فورًا.'],
  it: ['Priorità alla riserva','Con Stop! attivo, gioca prima dalla riserva se la carta entra in una base. Disattiva per scegliere qualsiasi mossa verso una base. Vale subito.'],
  uk: ['Пріоритет резерву','З активним «Стоп!» першою зіграйте карту резерву, якщо вона підходить до центру. Вимкніть, щоб вибирати будь-який доступний хід до центру. Діє відразу.']
};

const unlimitedStopStrings = {
  pl: ['Bez limitu — czekaj na Kontynuuj','Bez limitu komputer czeka na „Kontynuuj” po każdej położonej karcie, także na środku i w Koszu.'],
  en: ['No limit — wait for Continue','With no limit, the computer waits for Continue after every card it places, including on a foundation or waste pile.'],
  es: ['Sin límite — esperar a Continuar','Sin límite, la computadora espera a que pulses Continuar tras colocar cada carta, incluso en una base o descarte.'],
  de: ['Ohne Zeitlimit — auf Weiter warten','Ohne Zeitlimit wartet der Computer nach jeder gelegten Karte auf Weiter, auch auf Grundstapeln und Ablagen.'],
  'zh-Hans': ['不限时 — 等待继续','不限时时，电脑每放一张牌后都等待你点击继续，包括放到中央或弃牌堆。'],
  hi: ['कोई सीमा नहीं — जारी रखें की प्रतीक्षा','बिना सीमा के कंप्यूटर हर पत्ता रखने के बाद जारी रखें की प्रतीक्षा करता है, केंद्र या त्याग ढेर पर भी।'],
  fr: ['Sans limite — attendre Continuer','Sans limite, l’ordinateur attend Continuer après chaque carte posée, y compris sur une fondation ou une défausse.'],
  ar: ['بلا حد — انتظر المتابعة','بلا حد، ينتظر الحاسوب زر المتابعة بعد وضع كل بطاقة، حتى في الوسط أو المهملات.'],
  it: ['Senza limite — attendi Continua','Senza limite, il computer aspetta Continua dopo ogni carta posata, anche su una base o sugli scarti.'],
  uk: ['Без обмежень — чекати на «Продовжити»','Без обмежень комп’ютер чекає на «Продовжити» після кожної викладеної карти, зокрема в центр або скид.']
};

const drawnFirstStrings = {
  pl: 'Po odkryciu karty z Ręki najpierw ją zagraj albo odłóż do własnego Kosza, by zakończyć turę.',
  en: 'After revealing a card from your hand, play it first or discard it to end your turn.',
  es: 'Al revelar una carta de la mano, juégala primero o descártala para terminar el turno.',
  de: 'Spiele eine aufgedeckte Handkarte zuerst oder lege sie ab, um deinen Zug zu beenden.',
  'zh-Hans': '翻开手牌后，必须先打出这张牌，或将其弃置以结束回合。',
  hi: 'गड्डी से पत्ता खोलने के बाद पहले वही पत्ता खेलें या उसे त्यागकर अपनी बारी समाप्त करें।',
  fr: 'Après avoir retourné une carte du talon, jouez-la en premier ou défaussez-la pour terminer votre tour.',
  ar: 'بعد كشف بطاقة من الرزمة، العبها أولًا أو ضعها في المهملات لإنهاء دورك.',
  it: 'Dopo aver scoperto una carta dal mazzo, giocala per prima o scartala per terminare il turno.',
  uk: 'Відкривши карту з колоди, зіграйте її першою або відкладіть у скид, щоб завершити хід.'
};

const rotateHintStrings = {
  pl: 'Obróć telefon, aby zobaczyć szerszy stół.',
  en: 'Rotate your phone to see a wider table.',
  es: 'Gira el teléfono para ver una mesa más ancha.',
  de: 'Drehe dein Handy, um mehr vom Tisch zu sehen.',
  'zh-Hans': '旋转手机以查看更多桌面空间。',
  hi: 'चौड़ी मेज़ देखने के लिए फ़ोन घुमाएँ।',
  fr: 'Tournez votre téléphone pour élargir la table.',
  ar: 'أدر هاتفك لعرض طاولة أعرض.',
  it: 'Ruota il telefono per vedere un tavolo più ampio.',
  uk: 'Поверніть телефон, щоб побачити ширший стіл.'
};
