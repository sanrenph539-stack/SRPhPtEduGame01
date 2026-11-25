import { memo } from 'react';
import { Clock, Home, Pause, Play } from 'lucide-react';
import { MAX_CAPITAL_SCALE, MAX_MONEY_SCALE } from '../data/storyScript';
import { ActNumber, CoreStats, GameMode, StatDelta } from '../types/game';

interface TopHudProps {
  mode: GameMode;
  act: ActNumber;
  totalActs: number;
  patientIndex: 1 | 2;
  showPatientCount: boolean;
  stats: CoreStats;
  latestDelta: StatDelta | null;
  timerActive: boolean;
  isPaused: boolean;
  remainingSec: number;
  totalSec: number;
  onTogglePause: () => void;
  onReturnMenu: () => void;
}

function getMoneyStatus(money: number): { label: string; color: string; barColor: string } {
  if (money <= 100) {
    return { label: '吃緊', color: 'text-[var(--status-danger)]', barColor: 'bg-[var(--status-danger)]' };
  }
  if (money <= 180) {
    return { label: '警戒', color: 'text-[var(--status-warn)]', barColor: 'bg-[var(--status-warn)]' };
  }
  return { label: '穩定', color: 'text-[var(--accent-primary)]', barColor: 'bg-[var(--accent-primary)]' };
}

function getCapitalStatus(capital: number): { label: string; color: string; barColor: string } {
  if (capital >= 450) {
    return { label: '偏滿', color: 'text-[var(--status-danger)]', barColor: 'bg-[var(--status-danger)]' };
  }
  if (capital >= 360) {
    return { label: '偏多', color: 'text-[var(--status-warn)]', barColor: 'bg-[var(--status-warn)]' };
  }
  return { label: '適中', color: 'text-[var(--text-primary)]', barColor: 'bg-[#64748B]' };
}

function getAffectionStatus(affection: number): { label: string; color: string; barColor: string } {
  if (affection <= 20) {
    return { label: '不耐', color: 'text-[var(--status-danger)]', barColor: 'bg-[var(--status-danger)]' };
  }
  if (affection <= 35) {
    return { label: '微詞', color: 'text-[var(--status-warn)]', barColor: 'bg-[var(--status-warn)]' };
  }
  return { label: '安心', color: 'text-[var(--accent-primary)]', barColor: 'bg-[var(--accent-primary)]' };
}

export const TopHud = memo(function TopHud({
  mode,
  act,
  totalActs,
  patientIndex,
  showPatientCount,
  stats,
  latestDelta,
  timerActive,
  isPaused,
  remainingSec,
  totalSec,
  onTogglePause,
  onReturnMenu,
}: TopHudProps) {
  const moneyMeta = getMoneyStatus(stats.money);
  const capitalMeta = getCapitalStatus(stats.capital);
  const affectionMeta = getAffectionStatus(stats.affection);

  const moneyPct = Math.max(0, Math.min(100, (stats.money / MAX_MONEY_SCALE) * 100));
  const capitalPct = Math.max(0, Math.min(100, (stats.capital / MAX_CAPITAL_SCALE) * 100));
  const affectionPct = Math.max(0, Math.min(100, stats.affection));

  const timePct = totalSec > 0 ? Math.max(0, Math.min(100, (remainingSec / totalSec) * 100)) : 0;
  const isUrgent = remainingSec <= 15;
  const warnThreshold = Math.min(30, Math.floor(totalSec * 0.45));
  const isWarn = remainingSec <= warnThreshold && !isUrgent;

  return (
    <header className="shrink-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md">
      <div className="px-3 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onReturnMenu}
              aria-label="返回主選單"
              className="min-h-[40px] min-w-[40px] -ml-1 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="leading-tight">
              <div className="text-[11px] font-bold text-[var(--accent-primary)] whitespace-nowrap">
                {mode === 'normal' ? '普通' : '困難'} {act}/{totalActs}
              </div>
              {showPatientCount && (
                <div className="text-[11px] text-[var(--text-secondary)] whitespace-nowrap">
                  客 {patientIndex}/2
                </div>
              )}
            </div>
          </div>

          {/* 3 Core State Variables with explicit text states + tabular numerals */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {/* Money */}
            <div className="relative">
              <div className="flex items-baseline justify-between gap-0.5 text-[11px]">
                <span className="text-[var(--text-secondary)] truncate">
                  現金<span className={`ml-0.5 font-bold ${moneyMeta.color}`}>{moneyMeta.label}</span>
                </span>
                <span className={`font-mono-num font-bold text-xs ${moneyMeta.color} whitespace-nowrap`}>
                  {stats.money}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-transform duration-200 origin-left ${moneyMeta.barColor}`}
                  style={{ transform: `scaleX(${moneyPct / 100})` }}
                />
              </div>
              {latestDelta?.money !== undefined && latestDelta.money !== 0 && (
                <span
                  key={`m-${latestDelta.id}`}
                  className={`animate-float-delta pointer-events-none absolute -bottom-3.5 right-0 font-mono-num text-[11px] font-bold ${
                    latestDelta.money > 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--status-danger)]'
                  }`}
                >
                  {latestDelta.money > 0 ? `+${latestDelta.money}` : latestDelta.money}
                </span>
              )}
            </div>

            {/* Capital (0-600) */}
            <div className="relative">
              <div className="flex items-baseline justify-between gap-0.5 text-[11px]">
                <span className="text-[var(--text-secondary)] truncate">
                  藥庫<span className={`ml-0.5 font-bold ${capitalMeta.color}`}>{capitalMeta.label}</span>
                </span>
                <span className={`font-mono-num font-bold text-xs ${capitalMeta.color} whitespace-nowrap`}>
                  {stats.capital}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-transform duration-200 origin-left ${capitalMeta.barColor}`}
                  style={{ transform: `scaleX(${capitalPct / 100})` }}
                />
              </div>
              {latestDelta?.capital !== undefined && latestDelta.capital !== 0 && (
                <span
                  key={`c-${latestDelta.id}`}
                  className="animate-float-delta pointer-events-none absolute -bottom-3.5 right-0 font-mono-num text-[11px] font-bold text-[var(--status-warn)]"
                >
                  {latestDelta.capital > 0 ? `+${latestDelta.capital}` : latestDelta.capital}
                </span>
              )}
            </div>

            {/* Affection */}
            <div className="relative">
              <div className="flex items-baseline justify-between gap-0.5 text-[11px]">
                <span className="text-[var(--text-secondary)] truncate">
                  好感<span className={`ml-0.5 font-bold ${affectionMeta.color}`}>{affectionMeta.label}</span>
                </span>
                <span className={`font-mono-num font-bold text-xs ${affectionMeta.color} whitespace-nowrap`}>
                  {stats.affection}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-transform duration-200 origin-left ${affectionMeta.barColor}`}
                  style={{ transform: `scaleX(${affectionPct / 100})` }}
                />
              </div>
              {latestDelta?.affection !== undefined && latestDelta.affection !== 0 && (
                <span
                  key={`a-${latestDelta.id}`}
                  className={`animate-float-delta pointer-events-none absolute -bottom-3.5 right-0 font-mono-num text-[11px] font-bold ${
                    latestDelta.affection > 0
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--status-danger)]'
                  }`}
                >
                  {latestDelta.affection > 0 ? `+${latestDelta.affection}` : latestDelta.affection}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cross-Stage Countdown Bar */}
        {timerActive && (
          <div className="mt-1 pt-1 border-t border-[var(--border-subtle)] flex items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <Clock
                className={`w-3.5 h-3.5 ${
                  isPaused
                    ? 'text-[var(--text-secondary)]'
                    : isUrgent
                      ? 'text-[var(--status-danger)]'
                      : isWarn
                        ? 'text-[var(--status-warn)]'
                        : 'text-[var(--accent-primary)]'
                }`}
                aria-hidden="true"
              />
              <span
                className={`font-mono-num text-xs font-bold whitespace-nowrap ${
                  isPaused
                    ? 'text-[var(--text-secondary)]'
                    : isUrgent
                      ? 'text-[var(--status-danger)]'
                      : isWarn
                        ? 'text-[var(--status-warn)]'
                        : 'text-[var(--text-primary)]'
                }`}
              >
                {Math.ceil(remainingSec)}s
              </span>
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
              <div
                className={`h-full rounded-full origin-left transition-transform duration-1000 ease-linear ${
                  isPaused
                    ? 'bg-[var(--border-strong)]'
                    : isUrgent
                      ? 'bg-[var(--status-danger)]'
                      : isWarn
                        ? 'bg-[var(--status-warn)]'
                        : 'bg-[var(--accent-primary)]'
                }`}
                style={{ transform: `scaleX(${timePct / 100})` }}
              />
            </div>
            <button
              type="button"
              onClick={onTogglePause}
              aria-label={isPaused ? '繼續計時' : '暫停計時'}
              className="min-h-[34px] px-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)] active:scale-[0.98] text-xs font-bold text-[var(--text-primary)] transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                  <span>繼續</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-[var(--text-secondary)] shrink-0" aria-hidden="true" />
                  <span>暫停</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
});
