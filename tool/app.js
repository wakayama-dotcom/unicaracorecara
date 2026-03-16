(function () {
  'use strict';

  const AREAS = ['収入', '働き方', '職場環境', '仕事内容', 'スキル', '生活'];

  const IMPROVEMENT_PLACEHOLDERS = {
    '収入':    '例：月収を○万円 → ○万円に上げる　／　副業で月○万円を稼ぐ　／　年収○○○万円を目標にする',
    '働き方':  '例：フルリモート勤務に変える　／　月の残業を○時間 → 0時間にする　／　週4日勤務にする',
    '職場環境': '例：評価制度が公平な職場に移る　／　尊重し合えるチームで働く　／　上司との関係を改善する',
    '仕事内容': '例：企画・提案の仕事を50%以上にする　／　○○の専門職になる　／　マネジメントから外れる',
    'スキル':  '例：○○の資格を取る　／　副業で案件を○件獲得し実績を作る　／　○○ができるレベルになる',
    '生活':    '例：毎日○時に退勤できる　／　家族と夕食を週○日一緒に食べる　／　休日に仕事を持ち込まない'
  };

  const REASON_PLACEHOLDERS = {
    '収入':    '例：昇給がほぼなく、5年で年収がほとんど変わっていない',
    '働き方':  '例：月40時間の残業があり、帰宅後に自分の時間がほとんどない',
    '職場環境': '例：上司との関係が良くなく、毎朝会社に行くのが憂鬱',
    '仕事内容': '例：ルーティン業務ばかりで、自分の裁量やアイデアを出せない',
    'スキル':  '例：今の仕事だけでは市場価値が上がっている実感がない',
    '生活':    '例：残業で家族との夕食をほとんど一緒に食べられていない'
  };

  // 選択肢ごと×領域ごとの具体的な根拠テキスト（ユーザーの改善テキストを使用）
  const AREA_OPTION_TEXTS = {
    '収入': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を目指す場合、' : '収入目標に向けて、') +
          '転職で年収レンジ自体を引き上げつつ、副業で収入を積み上げる両輪戦略が最も確実です。転職と副業を同時に設計することで、どちらか一方だけより早く理想に近づけます。まず転職の年収ターゲットを決め、不足分を副業で補う金額を試算するところから始めましょう。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」を実現するには、' : '収入アップには、') +
          '転職市場での年収交渉が直接的なアプローチです。業界・職種・企業規模の見直しが収入レンジを変える最大の変数です。転職エージェントへの登録で自分の市場価値を確認し、希望年収を明確にして選考に臨みましょう。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」のうち、' : '収入アップのため、') +
          '現職を続けながら副業で積み上げる方法です。スキルを活かした副業（コンサル・受託・教える等）で不足分をカバーする計画が立てやすいです。まず週5〜10時間でできる形から始め、単価と稼働時間を徐々に伸ばしましょう。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : '収入改善に向けて、') +
          'まず現職での改善余地を確認しましょう。昇給交渉・等級の見直し・インセンティブ制度の活用・残業代の正確な把握など、転職前に試せることが意外とあります。評価者に「何をすれば昇給できるか」を直接確認することが最初の一歩です。';
      }
    },
    '働き方': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を実現するには、' : '働き方を変えるには、') +
          '転職先の働き方条件（リモート・フレックス・残業実態）を選考軸に入れつつ、副業で時間・場所の自由度を高める組み合わせが有効です。本業の環境を変えた上で、副業でさらに自律的な働き方を設計できます。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」を転職条件に入れることが、' : '転職の条件に働き方を入れることが、') +
          '最短の改善ルートです。求人票だけでなく、面接で実態（残業平均・リモート頻度・有休取得率）を必ず確認しましょう。現職と比較できる数字をもって判断することが大切です。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」と並行して、' : '働き方の自由度を上げるために、') +
          '副業で自分の裁量で動ける時間を持つことが有効です。副業の稼働時間・場所・仕事内容を自分で設計できるため、理想の働き方を小さく試す場にもなります。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : '働き方の改善に向けて、') +
          '現職でリモート勤務・フレックス・残業削減を上司や人事に交渉することから始めましょう。制度があるのに周知されていないケースも多く、申請するだけで変わることがあります。';
      }
    },
    '職場環境': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を目指すなら、' : '職場環境を変えるには、') +
          '転職で環境を一新しつつ、副業で全く別のコミュニティ・評価環境に触れることで、比較軸が生まれ次の選択がしやすくなります。現職の人間関係をリセットする最も確実な方法が転職です。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」を実現するには、' : '職場環境の改善には、') +
          '転職で職場そのものを変えることが最も直接的です。面接での逆質問（チームの雰囲気・評価制度・離職率・マネジメントスタイル）で実態を見極めることが、ミスマッチを防ぐ鍵です。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」と並行して、' : '現職の環境とは別に、') +
          '副業で自分が快適に働けるコミュニティや人間関係に触れることで、「こういう環境がいい」という基準が具体的になります。次の転職先選びの判断軸にもなります。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : '職場環境の改善に向けて、') +
          '異動希望・上司への直接相談・社内コミュニティへの参加など、環境を変えずに関係性を変えるアプローチから試しましょう。問題の原因が特定の人物や部署にある場合は、異動申請が有効なケースがあります。';
      }
    },
    '仕事内容': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を目指す場合、' : '仕事内容を変えるには、') +
          '転職で職種・業務内容を刷新しつつ、副業で自分の裁量でやりたい仕事に挑戦する組み合わせが有効です。本業で経験を積み、副業で実践するサイクルが成長と市場価値を加速させます。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」を条件に加えた転職が、' : '仕事内容の転換には、') +
          '直接的なアプローチです。職種・業界・役割・裁量の大きさを整理し、やりたい仕事に近い求人を軸に選考を進めましょう。職種変更を伴う場合は、現職での実績を棚卸しして強みを整理することが重要です。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」に挑戦するために、' : '仕事内容の多様化のために、') +
          '副業で本業とは別の仕事に挑戦する方法です。スモールスタートでやりたい仕事を試せるため、リスクを抑えながら適性・需要・単価を確認できます。副業の実績が転職時のアピールにもなります。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : '仕事内容の見直しに向けて、') +
          '社内で担当範囲の変更・新プロジェクトへの参加・役割交渉を試みましょう。希望する業務内容を上司に伝え、機会を作ることから始めることで、転職前に試せることが見えてきます。';
      }
    },
    'スキル': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を達成するには、' : 'スキルを伸ばすには、') +
          '転職で実務経験を積める環境に移りつつ、副業でそのスキルを外部で試す組み合わせが市場価値を最も高めます。インプット（転職先での実務）とアウトプット（副業での実践）の両輪が成長を加速します。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」のために、' : 'スキルアップのために、') +
          '転職で成長できる環境・役割・職種を選ぶことが重要です。スキルが伸びる職場かどうか、入社前にチームの業務難易度・育成方針・挑戦できる案件の有無を確認しましょう。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : 'スキルの実践のために、') +
          '副業でスキルに対して報酬をもらう経験が市場価値を飛躍的に高めます。まず1件、無理のない範囲で受けてみることが最初の一歩です。副業の実績がポートフォリオになり、転職でも有利になります。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : 'スキル向上に向けて、') +
          '社内研修・異動・担当範囲の拡大など、現職のまま経験できることを整理しましょう。社内でどんな学習機会があるか（勉強会・資格補助・OJT）を確認することが出発点です。';
      }
    },
    '生活': {
      1: function(imp) {
        return (imp ? '「' + imp + '」を実現するには、' : '理想の生活を実現するには、') +
          '転職で働き方・勤務地・拘束時間を変えつつ、副業で収入の柔軟性を持つ組み合わせが、生活設計の自由度を最も高めます。収入と時間の両方を手に入れる戦略です。';
      },
      2: function(imp) {
        return (imp ? '「' + imp + '」を実現するには、' : '理想の生活を実現するには、') +
          '転職で勤務地・労働時間・働き方を変えることが直接的なアプローチです。家族との時間・健康・生活リズムを転職条件の優先軸として、妥協しない姿勢で求人を選びましょう。';
      },
      3: function(imp) {
        return (imp ? '「' + imp + '」のために、' : '生活の質を高めるために、') +
          '副業で収入に余白を作ることで、生活の選択肢が広がります。収入の柱を増やすことで現職への依存度が下がり、無理に残業する必要がなくなる等、生活設計の自由度が上がります。';
      },
      4: function(imp) {
        return (imp ? '「' + imp + '」に向けて、' : '生活改善に向けて、') +
          'まず現職での働き方を見直しましょう。有給取得促進・残業削減交渉・在宅勤務の活用など、転職なしで生活の質を上げられることがあります。小さな変化から始めることが重要です。';
      }
    }
  };

  const OPTIONS = [
    { id: 1, name: '① 転職＋副業' },
    { id: 2, name: '② 転職' },
    { id: 3, name: '③ 副業' },
    { id: 4, name: '④ 現状の見直し' }
  ];

  const OPTION_META = {
    1: { reach: '収入・スキル・働き方など広く', risk: '高（環境変化＋時間・体力）', time: '数ヶ月〜1年', next: '転職軸の整理＋副業形態・時間の検討' },
    2: { reach: '収入・働き方・職場環境・仕事内容など', risk: '高（環境が変わる）', time: '数ヶ月〜1年', next: '判断軸の整理 → 求人検討' },
    3: { reach: '収入・スキル・生活など', risk: '中（時間・体力）', time: '数ヶ月〜', next: '副業形態・時間の検討' },
    4: { reach: '職場環境・働き方・仕事内容など', risk: '低（現状維持の延長）', time: '継続的', next: '現職で交渉・調整できることの洗い出し' }
  };

  let state = {
    step: 1,
    ideals: {},        // area -> string（理想の記述）
    scores: {},        // area -> number 1-10
    reasons: {},       // area -> string（点数をつけた理由）
    improvements: {},  // area -> string（具体的な改善内容）
    priorityOrder: []  // area[]（優先順位順、全6領域）
  };

  function getEl(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // ─── Step 1: 理想の状態を記述 ──────────────────────────────────────────

  const IDEAL_PLACEHOLDERS = {
    '収入':    '例：月収60万円で、家族が安心して暮らせる収入がある',
    '働き方':  '例：週4日リモート、残業なしで子育てと両立できている',
    '職場環境': '例：互いに尊重し合え、成長を応援してくれるチームにいる',
    '仕事内容': '例：自分の得意なことを活かせる仕事で、やりがいを感じている',
    'スキル':  '例：市場価値のあるスキルがあり、どこでも働ける自信がある',
    '生活':    '例：家族との時間を大切にし、健康で充実した毎日を送っている'
  };

  function renderStep1() {
    const form = getEl('form-step1');
    if (!form) return;

    form.innerHTML = AREAS.map(function (area, i) {
      return (
        '<div class="area-block" data-area="' + area + '">' +
          '<div class="area-label">' +
            '<span class="area-name">' + area + '</span>' +
            '<span class="area-hint">この状態 ＝ 10点満点</span>' +
          '</div>' +
          '<textarea id="ideal-' + i + '" data-area="' + area + '" ' +
            'placeholder="' + IDEAL_PLACEHOLDERS[area] + '" rows="2"></textarea>' +
        '</div>'
      );
    }).join('');

    AREAS.forEach(function (area, i) {
      const ta = getEl('ideal-' + i);
      if (ta && state.ideals[area]) ta.value = state.ideals[area];
    });

    form.querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', checkStep1Complete);
    });
    checkStep1Complete();
  }

  function checkStep1Complete() {
    const form = getEl('form-step1');
    if (!form) return;
    const allFilled = AREAS.every(function (area, i) {
      const ta = form.querySelector('#ideal-' + i);
      return ta && ta.value.trim().length > 0;
    });
    const btn = getEl('btn-to-step2');
    if (btn) btn.disabled = !allFilled;
  }

  function collectStep1() {
    const form = getEl('form-step1');
    AREAS.forEach(function (area, i) {
      const ta = form && form.querySelector('#ideal-' + i);
      state.ideals[area] = ta ? ta.value.trim() : '';
    });
  }

  // ─── Step 2: 現状スコア + 理由 ─────────────────────────────────────────

  function renderStep2() {
    const list = getEl('score-list');
    if (!list) return;

    list.innerHTML = AREAS.map(function (area, i) {
      const idealText = state.ideals[area] || '—';
      const savedScore = state.scores[area] || 5;
      return (
        '<div class="score-block" data-area="' + area + '">' +
          '<div class="score-header">' +
            '<span class="score-area-name">' + area + '</span>' +
          '</div>' +
          '<div class="score-ideal-ref">' +
            '<span class="ref-label">理想（10点）：</span>' +
            '<span class="ref-text">' + escapeHtml(idealText) + '</span>' +
          '</div>' +
          '<div class="score-input-row">' +
            '<span class="score-min-label">1点</span>' +
            '<input type="range" id="score-' + i + '" data-area="' + area + '" ' +
              'min="1" max="10" value="' + savedScore + '" class="score-slider">' +
            '<span class="score-max-label">10点</span>' +
            '<span class="score-display" id="score-display-' + i + '">' + savedScore + '点</span>' +
          '</div>' +
          '<div class="reason-row">' +
            '<label class="reason-label" for="reason-' + i + '">この点数をつけた理由</label>' +
            '<textarea id="reason-' + i + '" data-area="' + area + '" ' +
              'placeholder="' + REASON_PLACEHOLDERS[area] + '" rows="2" class="reason-textarea"></textarea>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    AREAS.forEach(function (area, i) {
      const slider = getEl('score-' + i);
      const display = getEl('score-display-' + i);
      if (slider && display) {
        if (state.scores[area]) {
          slider.value = state.scores[area];
          display.textContent = state.scores[area] + '点';
        }
        slider.addEventListener('input', function () {
          display.textContent = slider.value + '点';
          state.scores[area] = parseInt(slider.value, 10);
        });
      }
      const reasonTa = getEl('reason-' + i);
      if (reasonTa && state.reasons[area]) {
        reasonTa.value = state.reasons[area];
      }
    });
  }

  function collectStep2() {
    AREAS.forEach(function (area, i) {
      const slider = getEl('score-' + i);
      const reasonTa = getEl('reason-' + i);
      state.scores[area] = slider ? parseInt(slider.value, 10) : 5;
      state.reasons[area] = reasonTa ? reasonTa.value.trim() : '';
    });
  }

  // ─── Step 3: ギャップ確認 + 改善内容 + 優先順位 ────────────────────────

  function initPriorityOrder() {
    if (state.priorityOrder.length !== AREAS.length) {
      // ギャップが大きい順にデフォルト設定
      state.priorityOrder = AREAS.slice().sort(function (a, b) {
        return (10 - (state.scores[b] || 5)) - (10 - (state.scores[a] || 5));
      });
    }
  }

  function renderStep3() {
    initPriorityOrder();
    const list = getEl('gap-detail-list');
    if (!list) return;
    renderGapCards();
  }

  function renderGapCards() {
    const list = getEl('gap-detail-list');
    if (!list) return;

    list.innerHTML = state.priorityOrder.map(function (area, rankIndex) {
      const score = state.scores[area] || 5;
      const reason = state.reasons[area] || '';
      const idealText = state.ideals[area] || '—';
      const gap = 10 - score;
      const savedImp = state.improvements[area] || '';

      const isFirst = rankIndex === 0;
      const isLast = rankIndex === state.priorityOrder.length - 1;

      return (
        '<div class="gap-detail-card" data-area="' + area + '" data-rank="' + rankIndex + '">' +
          '<div class="gap-detail-header">' +
            '<span class="rank-badge">第' + (rankIndex + 1) + '位</span>' +
            '<span class="gap-area-name">' + area + '</span>' +
            '<span class="gap-score-badge">現在 <strong>' + score + '点</strong>　ギャップ <strong>' + gap + '点</strong></span>' +
            '<div class="rank-controls">' +
              '<button type="button" class="rank-btn rank-up" data-area="' + area + '" ' + (isFirst ? 'disabled' : '') + '>↑</button>' +
              '<button type="button" class="rank-btn rank-down" data-area="' + area + '" ' + (isLast ? 'disabled' : '') + '>↓</button>' +
            '</div>' +
          '</div>' +
          '<div class="gap-info-row">' +
            '<div class="gap-info-item">' +
              '<span class="gap-info-label">理想（10点）</span>' +
              '<span class="gap-info-text">' + escapeHtml(idealText) + '</span>' +
            '</div>' +
            (reason ? (
              '<div class="gap-info-item">' +
                '<span class="gap-info-label">現在（' + score + '点）の理由</span>' +
                '<span class="gap-info-text">' + escapeHtml(reason) + '</span>' +
              '</div>'
            ) : '') +
          '</div>' +
          '<div class="improvement-row">' +
            '<label class="improvement-label" for="imp-' + area + '">具体的に何が改善されれば理想に近づきますか？<span class="label-hint">できるだけ数字で</span></label>' +
            '<textarea id="imp-' + area + '" data-area="' + area + '" class="improvement-textarea" ' +
              'placeholder="' + IMPROVEMENT_PLACEHOLDERS[area] + '" rows="2">' +
            '</textarea>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // 改善内容を復元
    state.priorityOrder.forEach(function (area) {
      const ta = getEl('imp-' + area);
      if (ta && state.improvements[area]) ta.value = state.improvements[area];
    });

    // 並び替えボタンのイベント
    list.querySelectorAll('.rank-up').forEach(function (btn) {
      btn.addEventListener('click', function () {
        collectImprovements();
        const area = btn.dataset.area;
        const idx = state.priorityOrder.indexOf(area);
        if (idx > 0) {
          const tmp = state.priorityOrder[idx - 1];
          state.priorityOrder[idx - 1] = state.priorityOrder[idx];
          state.priorityOrder[idx] = tmp;
          renderGapCards();
        }
      });
    });

    list.querySelectorAll('.rank-down').forEach(function (btn) {
      btn.addEventListener('click', function () {
        collectImprovements();
        const area = btn.dataset.area;
        const idx = state.priorityOrder.indexOf(area);
        if (idx < state.priorityOrder.length - 1) {
          const tmp = state.priorityOrder[idx + 1];
          state.priorityOrder[idx + 1] = state.priorityOrder[idx];
          state.priorityOrder[idx] = tmp;
          renderGapCards();
        }
      });
    });
  }

  function collectImprovements() {
    state.priorityOrder.forEach(function (area) {
      const ta = getEl('imp-' + area);
      state.improvements[area] = ta ? ta.value.trim() : '';
    });
  }

  // ─── Step 4: 選択肢の提示 ──────────────────────────────────────────────

  function renderStep4() {
    const container = getEl('option-cards');
    const bridgeEl = getEl('bridge-message');
    if (!container) return;

    // 上位3領域を優先表示に使う
    const topAreas = state.priorityOrder.slice(0, 3);

    const bridgeText = topAreas.length > 0
      ? '1位：' + topAreas[0] + '、2位：' + (topAreas[1] || '—') + '、3位：' + (topAreas[2] || '—') + ' を優先改善する想定で、4つの選択肢を提示します。'
      : '理想と現実のギャップを踏まえて、4つの選択肢とそれぞれの根拠をまとめました。';
    if (bridgeEl) bridgeEl.textContent = bridgeText;

    container.innerHTML = OPTIONS.map(function (opt) {
      const meta = OPTION_META[opt.id];
      const rationale = buildRationale(opt.id, topAreas);
      const metaHtml = (
        '<dl class="meta-dl">' +
          '<div><dt>届きやすい領域</dt><dd>' + escapeHtml(meta.reach) + '</dd></div>' +
          '<div><dt>リスク・負荷</dt><dd>' + escapeHtml(meta.risk) + '</dd></div>' +
          '<div><dt>効果の目安</dt><dd>' + escapeHtml(meta.time) + '</dd></div>' +
          '<div><dt>次のステップ</dt><dd>' + escapeHtml(meta.next) + '</dd></div>' +
        '</dl>'
      );
      const rationaleHtml = rationale.map(function (item) {
        return (
          '<div class="rationale-item">' +
            '<span class="rationale-area-tag">' + escapeHtml(item.area) + '</span>' +
            '<p>' + escapeHtml(item.text) + '</p>' +
          '</div>'
        );
      }).join('');

      return (
        '<div class="option-card" data-option-id="' + opt.id + '">' +
          '<h3 class="option-card-title">' + escapeHtml(opt.name) + '</h3>' +
          '<div class="option-card-meta">' + metaHtml + '</div>' +
          '<div class="option-card-rationale">' +
            '<div class="option-card-rationale-title">あなたの状況への根拠</div>' +
            rationaleHtml +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function buildRationale(optionId, topAreas) {
    const items = [];
    topAreas.forEach(function (area) {
      const imp = state.improvements[area] || '';
      const areaTexts = AREA_OPTION_TEXTS[area];
      if (areaTexts && areaTexts[optionId]) {
        items.push({ area: area, text: areaTexts[optionId](imp) });
      } else {
        items.push({ area: area, text: '理想と現実の差を埋める選択肢として検討できます。' });
      }
    });
    if (items.length === 0) {
      items.push({ area: '全体', text: '理想と現実の差を埋める一つの道として、この選択肢を検討できます。' });
    }
    return items;
  }

  // ─── ステップ切り替え ──────────────────────────────────────────────────

  function setStep(step) {
    state.step = step;
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
    const panel = getEl('panel-step' + step);
    if (panel) {
      panel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    document.querySelectorAll('.step').forEach(function (el, i) {
      const num = i + 1;
      el.classList.remove('current', 'done');
      if (num === step) el.classList.add('current');
      else if (num < step) el.classList.add('done');
    });
  }

  // ─── イベントバインド ──────────────────────────────────────────────────

  function bindEvents() {
    var b;

    b = getEl('btn-to-step2');
    if (b) b.addEventListener('click', function () {
      collectStep1();
      renderStep2();
      setStep(2);
    });

    b = getEl('btn-back-step1');
    if (b) b.addEventListener('click', function () {
      collectStep2();
      renderStep1();
      setStep(1);
    });

    b = getEl('btn-to-step3');
    if (b) b.addEventListener('click', function () {
      collectStep2();
      state.priorityOrder = []; // ギャップ順をリセット（スコアが変わった可能性）
      renderStep3();
      setStep(3);
    });

    b = getEl('btn-back-step2');
    if (b) b.addEventListener('click', function () {
      collectImprovements();
      renderStep2();
      setStep(2);
    });

    b = getEl('btn-to-step4');
    if (b) b.addEventListener('click', function () {
      collectImprovements();
      renderStep4();
      setStep(4);
    });

    b = getEl('btn-back-step3');
    if (b) b.addEventListener('click', function () {
      renderStep3();
      setStep(3);
    });
  }

  // ─── 初期化 ────────────────────────────────────────────────────────────

  renderStep1();
  setStep(1);
  bindEvents();

})();
