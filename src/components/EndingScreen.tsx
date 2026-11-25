import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Home,
  Info,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  DISPENSING_TIME_LIMIT_BY_MODE,
  ENDINGS,
  ENDING_ORDER,
  GAME_ASSETS,
  getNetProfitByPlan,
  HARD_FIXED_COST,
  INITIAL_STATS,
} from '../data/storyScript';
import { CoreStats, EndingId, GameFlags, GameMode, UnlockedAlmanac } from '../types/game';
import { IllustrationImage } from './IllustrationImage';

interface EndingScreenProps {
  mode: GameMode;
  endingId: EndingId;
  stats: CoreStats;
  flags: GameFlags;
  almanac: UnlockedAlmanac;
  onReplaySameMode: () => void;
  onSwitchMode: (nextMode: GameMode) => void;
  onOpenAlmanac: () => void;
  onReturnMenu: () => void;
}

export function EndingScreen({
  mode,
  endingId,
  stats,
  flags,
  almanac,
  onReplaySameMode,
  onSwitchMode,
  onOpenAlmanac,
  onReturnMenu,
}: EndingScreenProps) {
  const ending = ENDINGS[endingId];
  const unlockedCount = ENDING_ORDER.filter((id) => almanac.endings[id]).length;
  const title = mode === 'normal' ? ending.titleNormal : ending.titleHard;
  const summary = mode === 'normal' ? ending.summaryNormal : ending.summaryHard;
  const isClearEnding = endingId === 'A' || endingId === '1B';
  const clearedNormal = mode === 'normal' && isClearEnding;
  const carriedNetProfit = getNetProfitByPlan(flags.normalOrderPlan);

  const openingTotal = INITIAL_STATS.money + INITIAL_STATS.capital;
  const finalTotal = stats.money + stats.capital;
  const totalDiff = finalTotal - openingTotal;
  const cashDiff = stats.money - INITIAL_STATS.money;
  const shelfDiff = stats.capital - INITIAL_STATS.capital;
  const affectionDiff = stats.affection - INITIAL_STATS.affection;
  const affectionDiffText =
    affectionDiff > 0 ? `+${affectionDiff}` : affectionDiff < 0 ? `${affectionDiff}` : '不變';
  const lostCapital = totalDiff < 0;

  const toneColor =
    ending.tone === 'good'
      ? 'text-[var(--accent-primary)]'
      : ending.tone === 'critical'
        ? 'text-[var(--status-danger)]'
        : 'text-[var(--status-warn)]';

  return (
    <div className="h-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col min-h-0">
      {/* Compact Ending Header */}
      <header className="shrink-0 px-3.5 h-11 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)] flex items-center justify-between gap-2">
        <span className={`text-xs font-bold ${toneColor} truncate`}>
          {ending.codeLabel} · {mode === 'normal' ? '普通模式' : '藥局幕後篇'}
        </span>
        <span className="text-[11px] font-mono-num text-[var(--text-secondary)] shrink-0">
          結算藥袋
        </span>
      </header>

      {/* Scrollable Ending Details */}
      <main className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3 animate-stage-fade">
        {/* 1. Main Ending Card */}
        <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="relative h-24 w-full bg-[var(--bg-muted)]">
            <IllustrationImage
              src={mode === 'normal' ? GAME_ASSETS.pharmacyWarm : GAME_ASSETS.pharmacyHard}
              alt={title}
              className="w-full h-full object-cover"
              priority={true}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/65 to-transparent" />
          </div>

          <div className="p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                {title}
              </h1>
              {ending.tone === 'good' ? (
                <CheckCircle2 className={`w-5 h-5 ${toneColor} shrink-0 mt-0.5`} aria-hidden="true" />
              ) : (
                <AlertTriangle className={`w-5 h-5 ${toneColor} shrink-0 mt-0.5`} aria-hidden="true" />
              )}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {flags.endingReason ?? summary}
            </p>

            {endingId === 'C' && flags.dispensingErrors && flags.dispensingErrors.length > 0 && (
              <div className="rounded-xl border border-[var(--status-danger)]/35 bg-[#FDF3F2] p-2.5 space-y-1">
                <div className="text-xs font-bold text-[var(--status-danger)]">
                  這次拿錯的地方：
                </div>
                <ul className="space-y-0.5 text-xs text-[#7F1D1D] font-mono-num">
                  {flags.dispensingErrors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final 3 Core Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2.5 receipt-divider text-center">
              <div>
                <div className="text-[11px] text-[var(--text-secondary)]">剩餘現金</div>
                <div className="font-mono-num text-base font-bold text-[var(--text-primary)]">
                  {stats.money}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-secondary)]">架上藥品</div>
                <div className="font-mono-num text-base font-bold text-[var(--text-primary)]">
                  {stats.capital}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[var(--text-secondary)]">鄰居好感</div>
                <div className="font-mono-num text-base font-bold text-[var(--text-primary)]">
                  {stats.affection}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 2. Hard Mode Unlock / Carry Banner (Normal Clear Only) */}
        {clearedNormal && (
          <section className="rounded-2xl border border-[#D8C5C1] bg-[#FAF6F5] p-3.5 space-y-2.5">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-[#B44535]">
                普通模式過關 · 延續目前狀態挑戰
              </p>
              <h2 className="text-base font-bold text-[#161E28]">
                藥局幕後篇 (困難版)｜真實經營考驗
              </h2>
              <p className="text-xs text-[#435061] leading-relaxed">
                延續現金 <strong className="font-mono-num text-[#161E28]">{stats.money}</strong>、藥庫{' '}
                <strong className="font-mono-num text-[#161E28]">{stats.capital}</strong>、好感{' '}
                <strong className="font-mono-num text-[#161E28]">{stats.affection}</strong>（淨利{' '}
                <strong className="font-mono-num text-[#161E28]">+{carriedNetProfit}</strong>），面對{' '}
                <strong className="font-mono-num text-[#161E28]">{DISPENSING_TIME_LIMIT_BY_MODE.hard}秒</strong>倒數與房租電費（{HARD_FIXED_COST}元）。
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchMode('hard')}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#B44535] hover:bg-[#943628] active:scale-[0.99] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>挑戰藥局幕後篇 (困難版)</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </section>
        )}

        {/* 3. Closing Receipt Ledger */}
        <section
          className={`rounded-2xl border p-3.5 space-y-2.5 ${
            lostCapital
              ? 'border-[var(--status-danger)]/35 bg-[#FDF8F7]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-paper)]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={`text-[11px] font-bold flex items-center gap-1 ${
                  lostCapital ? 'text-[var(--status-danger)]' : 'text-[var(--accent-primary)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>打烊對帳單</span>
              </p>
              <h2 className="mt-0.5 text-sm font-bold text-[var(--text-primary)]">
                {lostCapital
                  ? `比剛開局少了 ${Math.abs(totalDiff)} 元資本`
                  : totalDiff > 0
                    ? `比剛開局多了 +${totalDiff} 元資本`
                    : '總資本與剛開局持平'}
              </h2>
            </div>
            {lostCapital ? (
              <TrendingDown className="w-5 h-5 text-[var(--status-danger)] shrink-0" aria-hidden="true" />
            ) : (
              <TrendingUp className="w-5 h-5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2 receipt-divider text-xs">
            <div>
              <div className="text-[11px] text-[var(--text-secondary)]">總資本差額</div>
              <div
                className={`font-mono-num text-sm font-bold ${
                  lostCapital
                    ? 'text-[var(--status-danger)]'
                    : totalDiff > 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-primary)]'
                }`}
              >
                {lostCapital ? `-${Math.abs(totalDiff)} 元` : totalDiff > 0 ? `+${totalDiff} 元` : '0 元'}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-mono-num">
                現金 {cashDiff >= 0 ? `+${cashDiff}` : cashDiff} · 藥 {shelfDiff >= 0 ? `+${shelfDiff}` : shelfDiff}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-secondary)]">好感度變化</div>
              <div
                className={`font-mono-num text-sm font-bold ${
                  affectionDiff < 0
                    ? 'text-[var(--status-danger)]'
                    : affectionDiff > 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-primary)]'
                }`}
              >
                {stats.affection}（{affectionDiffText}）
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-mono-num">
                開局 {INITIAL_STATS.affection}
              </div>
            </div>
          </div>

          <p className="pt-2 receipt-divider text-xs text-[var(--text-secondary)] leading-relaxed">
            {endingId === '1B'
              ? `雖然總資本${totalDiff > 0 ? `多了 +${totalDiff} 元` : totalDiff < 0 ? `少了 ${Math.abs(totalDiff)} 元` : '打平'}，但現金只剩 ${stats.money} 元、${stats.capital} 元壓在藥架上，遇到突發支出時應變空間有限。`
              : mode === 'hard' && lostCapital
                ? endingId === 'A'
                  ? `一顆藥都沒拿錯，結帳卻發現總資本比開局少了 ${Math.abs(totalDiff)} 元——這正是許多獨立社區小藥局每天面對的真實處境。`
                  : `扣除進貨、運費與今日開銷後，總資本比剛開局少了 ${Math.abs(totalDiff)} 元。`
                : mode === 'hard' && endingId === 'A'
                  ? `忙完一整天、一顆藥都沒拿錯，扣完單日房租電費後總資本${totalDiff === 0 ? '剛好打平' : `微幅多出 +${totalDiff} 元`}——撐住社區藥局靠的是日復一日的細心與堅持。`
                  : clearedNormal
                    ? `目前總資本比開局多了 +${totalDiff} 元，還沒算進冷門藥、運費與房租電費——接下來的困難版才是真正考驗！`
                    : lostCapital
                      ? `扣除今天花費後，總資本比開局少了 ${Math.abs(totalDiff)} 元。`
                      : `目前算上架上的藥${totalDiff === 0 ? '與剛開店時持平' : `比剛開店多了 +${totalDiff} 元`}。`}
          </p>
        </section>

        {/* 4. Pharmacist Note Card */}
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-[var(--accent-primary)]">
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            <h2 className="text-sm font-bold">{ending.knowledgeTitle}</h2>
          </div>
          <p className="text-xs text-[var(--text-primary)]/90 leading-relaxed">
            {ending.knowledgeBody}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] pt-2 receipt-divider">
            參考：{ending.knowledgeSource}
          </p>
        </section>
      </main>

      {/* Pinned Thumb-Zone Action Footer */}
      <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReplaySameMode}
            className={`min-h-[44px] px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              clearedNormal
                ? 'border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)]'
                : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{mode === 'hard' ? '再戰困難版' : '再玩一次'}</span>
          </button>

          {mode === 'hard' ? (
            <button
              type="button"
              onClick={() => onSwitchMode('normal')}
              className="min-h-[44px] px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>回普通模式</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAlmanac}
              className="min-h-[44px] px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                圖鑑 <span className="font-mono-num">({unlockedCount}/{ENDING_ORDER.length})</span>
              </span>
            </button>
          )}
        </div>

        <div className={`grid gap-2 ${mode === 'hard' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {mode === 'hard' && (
            <button
              type="button"
              onClick={onOpenAlmanac}
              className="min-h-[40px] px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-xs font-medium text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                結局圖鑑 <span className="font-mono-num">({unlockedCount}/{ENDING_ORDER.length})</span>
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onReturnMenu}
            className="min-h-[40px] px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] text-xs font-medium text-[var(--text-secondary)] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>回主選單</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
