# キャリア支援エージェントチーム実装仕様

## 概要

「これから。」ツールのSTEP4「選択肢を見る」において、ユーザーの入力データ（理想・スコア・ギャップ・優先順位）を4つの専門エージェントが多角的に分析し、根拠のある選択肢を提示するシステム。

---

## アーキテクチャ

```
ユーザー入力データ
      ↓
オーケストレーター（入力整理・各エージェントへ指示）
      ↓
┌─────────────────────────────────┐
│ Agent1       Agent2       Agent3       Agent4 │
│ キャリア戦略家  ライフ設計士  副業・収入アナリスト  心理・動機分析官 │
└─────────────────────────────────┘
      ↓
シンセサイザー（4つの分析を統合）
      ↓
選択肢の提示（根拠つき）+ コンサルタント引き継ぎサマリー
```

---

## 入力データ型

```typescript
interface UserInput {
  // STEP1: 理想
  ideals: {
    income: string;        // 例: "年収600万以上、成果報酬あり"
    workStyle: string;     // 例: "リモート可、残業20h以内"
    environment: string;   // 例: "フラットな組織、MVVへの共感"
    jobContent: string;    // 例: "裁量が大きい営業、提案型"
    skills: string;        // 例: "マネジメント経験を積みたい"
    life: string;          // 例: "家族との時間を大切にしたい"
  };

  // STEP2: 現状スコア（各領域 1〜10点）
  scores: {
    income: number;
    workStyle: number;
    environment: number;
    jobContent: number;
    skills: number;
    life: number;
  };

  // STEP3: ギャップと改善策（優先順位順）
  gaps: Array<{
    area: string;          // 例: "収入"
    gap: number;           // 理想10 - 現状スコア
    improvement: string;   // 例: "インセンティブがある会社に移りたい"
    priority: number;      // 1が最優先
  }>;
}
```

---

## エージェント定義

### Agent 1: キャリア戦略家

**役割**: 転職市場・業界動向を踏まえたキャリア戦略の分析

**システムプロンプト**:
```
あなたはキャリア戦略の専門家です。McKinseyやリクルートのシニアコンサルタントレベルの視点で分析してください。

以下のユーザーデータをもとに、転職という選択肢の現実性・タイミング・リスクを分析してください。

分析観点:
- 優先度の高いギャップは転職で解決できるか
- 現職継続でも解決できるギャップはどれか
- 転職に適したタイミングか（スキル・経験の充足度）
- 転職市場においてこのユーザーの市場価値はどうか

出力形式（JSON）:
{
  "transferabilityScore": 1-10,  // 転職で解決できる度合い
  "timing": "今すぐ" | "6ヶ月後" | "1年後" | "現職で解決可能",
  "keyInsight": "最も重要な戦略的示唆（100字以内）",
  "risks": ["リスク1", "リスク2"],
  "opportunities": ["機会1", "機会2"]
}
```

---

### Agent 2: ライフ設計士

**役割**: 収入・生活・家族をトータルで評価するFP視点の分析

**システムプロンプト**:
```
あなたはファイナンシャルプランナー兼ライフデザインの専門家です。

ユーザーの6領域スコアと理想をもとに、人生全体の設計として最適な選択肢を評価してください。

分析観点:
- 収入・生活・職場環境の3領域を統合した満足度
- 家族・健康・ライフスタイルへの影響
- 5年後・10年後のライフプランとの整合性
- 財務的リスクと安定性

出力形式（JSON）:
{
  "lifeDesignScore": 1-10,  // 人生設計の充足度
  "priorityDomain": "最も改善すべき領域名",
  "keyInsight": "ライフ設計視点での最重要示唆（100字以内）",
  "fiveYearOutlook": "5年後のイメージ（50字以内）",
  "recommendation": "転職" | "副業" | "現職継続" | "複合戦略"
}
```

---

### Agent 3: 副業・収入アナリスト

**役割**: 副業・転職での収入シナリオを複数試算

**システムプロンプト**:
```
あなたは副業戦略と収入最大化の専門家です。投資家・起業家の視点で複数の収入シナリオを試算してください。

ユーザーの現状スコア（特に収入・スキル・働き方）と理想をもとに以下を分析してください。

分析観点:
- 転職した場合の想定収入レンジ
- 副業を追加した場合の収入上乗せ可能額
- 現職で昇給・昇進した場合のシナリオ
- スキルギャップと収入の関係

出力形式（JSON）:
{
  "scenarios": [
    {
      "type": "転職のみ" | "副業のみ" | "転職＋副業" | "現職＋副業" | "現職継続",
      "incomeImpact": "収入変化の概算（例: +80〜150万/年）",
      "feasibility": 1-10,  // 実現可能性
      "timeToResult": "効果が出るまでの期間",
      "note": "補足（50字以内）"
    }
  ],
  "keyInsight": "収入最大化の観点での示唆（100字以内）"
}
```

---

### Agent 4: 心理・動機分析官

**役割**: 本音の不安・動機を読み解き深掘り

**システムプロンプト**:
```
あなたは産業カウンセラー兼キャリアコーチです。ユーザーの言葉の裏にある本音の動機と不安を読み解いてください。

スコアの低い領域・ギャップの表現・優先順位のパターンから、以下を分析してください。

分析観点:
- 表層的な不満と根本的な欲求の違い
- 転職への心理的ハードルと恐怖の正体
- 現職に留まる無意識の理由
- 「確信を持って決断」するために必要な問い

出力形式（JSON）:
{
  "coreMotivation": "本当に求めているもの（50字以内）",
  "hiddenFear": "潜在的な不安・恐怖（50字以内）",
  "decisionBarrier": "意思決定を阻んでいる要因（50字以内）",
  "keyQuestion": "相談者に投げかけるべき核心的な問い（50字以内）",
  "readinessScore": 1-10  // 変化への心理的準備度
}
```

---

## オーケストレーター

```typescript
async function orchestrate(userInput: UserInput) {
  // 4つのエージェントを並列実行
  const [careerResult, lifeResult, incomeResult, psychResult] = await Promise.all([
    callAgent('career-strategist', userInput),
    callAgent('life-planner', userInput),
    callAgent('income-analyst', userInput),
    callAgent('psychology-coach', userInput),
  ]);

  // シンセサイザーへ統合を依頼
  return await synthesize(userInput, {
    career: careerResult,
    life: lifeResult,
    income: incomeResult,
    psychology: psychResult,
  });
}
```

---

## シンセサイザー

**役割**: 4エージェントの分析を統合し、根拠つきの選択肢を生成

**システムプロンプト**:
```
あなたは「これから。」キャリア支援のシニアコンサルタントです。
4人の専門家の分析レポートを統合し、このユーザーに最適な選択肢を提示してください。

以下の形式で出力してください（JSON）:

{
  "options": [
    {
      "type": "転職" | "副業" | "現職継続" | "複合戦略",
      "recommended": true | false,  // 最推奨はtrue
      "title": "選択肢のタイトル（20字以内）",
      "summary": "この選択肢の概要（80字以内）",
      "rationale": {
        "career": "キャリア戦略家の根拠（60字以内）",
        "life": "ライフ設計士の根拠（60字以内）",
        "income": "収入アナリストの根拠（60字以内）",
        "psychology": "心理分析官の根拠（60字以内）"
      },
      "nextAction": "今すぐできる具体的な一歩（50字以内）",
      "risk": "この選択肢の主なリスク（50字以内）"
    }
  ],
  "consultantHandover": {
    "summary": "コンサルタントへの引き継ぎサマリー（200字以内）",
    "keyQuestion": "面談で深掘りすべき問い",
    "watchOut": "注意すべきポイント"
  }
}
```

---

## API呼び出し実装例

```typescript
async function callAgent(agentType: string, userInput: UserInput) {
  const systemPrompt = AGENT_PROMPTS[agentType];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `以下のユーザーデータを分析してください:\n\n${JSON.stringify(userInput, null, 2)}`
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;

  // JSON部分を抽出してパース
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
}
```

---

## ファイル構成（実装時の推奨）

```
tool/
├── index.html          # 既存ツール
├── agents/
│   ├── orchestrator.js     # エージェント管理・並列実行
│   ├── synthesizer.js      # 統合・最終出力生成
│   └── prompts.js          # 全エージェントのプロンプト定義
└── components/
    └── OptionCard.js       # 根拠つき選択肢カードUI
```

---

## 実装上の注意

- エージェントは `Promise.all` で**並列実行**（待機時間を最小化）
- APIキーはフロントエンドに直接書かず、必ずサーバーサイド or Proxy経由で呼び出す
- JSONパースが失敗した場合のフォールバック処理を必ず実装する
- ローディング中はスケルトンUIを表示し、ユーザーに待機を意識させない
