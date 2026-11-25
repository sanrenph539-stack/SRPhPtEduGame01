import { ArrowRight, BookOpen, Flame, ShieldCheck } from 'lucide-react';
import { ENDING_ORDER, GAME_ASSETS, INITIAL_STATS } from '../data/storyScript';
import { GameMode, UnlockedAlmanac } from '../types/game';
import { IllustrationImage } from './IllustrationImage';

interface TitleMenuProps {
  almanac: UnlockedAlmanac;
  onStartMode: (mode: GameMode) => void;
  onOpenAlmanac: () => void;
}

export function TitleMenu({ almanac, onStartMode, onOpenAlmanac }: TitleMenuProps) {
  const unlockedCount = ENDING_ORDER.filter((id) => almanac.endings[id]).length;
  const hardUnlocked = almanac.completedModes.normal;

  return (
    <div className="h-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      {/* Compact Mobile Top Bar */}
      <header className="shrink-0 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-sm px-3.5 h-12 flex items-center justify-between gap-2">
        <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
          到你手上之前
        </span>
        <button
          type="button"
          onClick={onOpenAlmanac}
          className="min-h-[38px] px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] active:scale-[0.98] text-xs font-bold text-[var(--text-primary)] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
          <span>
            結局圖鑑 <span className="font-mono-num">({unlockedCount}/{ENDING_ORDER.length})</span>
          </span>
        </button>
      </header>

      {/* Main Content — fits inside 1 mobile viewport without scrolling */}
      <main className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 flex flex-col justify-between gap-2.5">
        <div className="space-y-2.5">
          {/* Compact Hero Illustration Card */}
          <figure className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="relative h-32 w-full overflow-hidden">
              <IllustrationImage
                src={GAME_ASSETS.pharmacyWarm}
                alt="從社區藥局調劑櫃檯內往外看的早晨室內場景"
                className="w-full h-full object-cover"
                fallbackLabel="社區藥局早班調劑台"
                priority={true}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 px-3.5 py-2.5 text-white">
                <p className="text-[11px] text-white/90">
                  社區藥局一日體驗 · 全程靜音 · 約 3 分鐘
                </p>
                <h1 className="text-xl font-bold leading-tight">
                  到你手上之前
                </h1>
              </figcaption>
            </div>
            <div className="px-3.5 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-paper)] flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
              <span>開門資本</span>
              <span className="font-mono-num font-bold text-[var(--text-primary)] whitespace-nowrap">
                現金 {INITIAL_STATS.money} · 架上藥 {INITIAL_STATS.capital} · 好感 {INITIAL_STATS.affection}
              </span>
            </div>
          </figure>

          {/* Compact 3-Step Flow Summary */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-3 space-y-2">
            <p className="text-xs text-[var(--text-secondary)] leading-snug">
              站進社區藥局櫃檯後方，體驗一袋藥交到手中前的三道把關：
            </p>
            <div className="space-y-1.5 pt-1.5 border-t border-[var(--border-subtle)] text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-mono-num font-bold text-[var(--accent-primary)] shrink-0">01</span>
                <p className="text-[var(--text-primary)] leading-snug">
                  <strong>決定備貨</strong>：現金有限，拿捏叫貨量避免缺藥或壓垮周轉
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono-num font-bold text-[var(--accent-primary)] shrink-0">02</span>
                <p className="text-[var(--text-primary)] leading-snug">
                  <strong>親手數藥</strong>：看清劑量與每排顆數，在倒數內一顆不差配齊
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono-num font-bold text-[var(--accent-primary)] shrink-0">03</span>
                <p className="text-[var(--text-primary)] leading-snug">
                  <strong>核對叮嚀</strong>：當面點清排數、多問吃藥習慣避開風險
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Thumb-Zone Primary Action Dock */}
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[var(--accent-primary)] flex items-center gap-1 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>普通模式 · 2 位客人{hardUnlocked ? ' · 已破關' : ''}</span>
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] truncate">
              {hardUnlocked ? '困難版已解鎖' : '破關解鎖困難版'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onStartMode('normal')}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-base font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
          >
            <span>{hardUnlocked ? '開始上班（普通模式）' : '開始上班'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          {hardUnlocked && (
            <button
              type="button"
              onClick={() => onStartMode('hard')}
              className="w-full min-h-[44px] px-4 py-2 rounded-xl border border-[#D8B4AE] bg-[#FAF6F5] hover:bg-[#F5EBE9] active:scale-[0.99] text-[#B44535] text-sm font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Flame className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>直接挑戰藥局幕後篇 (困難版)</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}

          <p className="text-[11px] text-[var(--text-secondary)]/85 leading-snug">
            ※ 藥品名稱與規格皆為衛教模擬虛構，實際用藥請諮詢醫師或藥師。
          </p>
        </section>
      </main>
    </div>
  );
}
