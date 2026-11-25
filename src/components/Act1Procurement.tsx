import { memo } from 'react';
import { ArrowRight, PackageCheck, ShieldAlert, Sparkles } from 'lucide-react';
import {
  DISPENSE_CAPITAL_COST,
  HARD_FIXED_COST,
  NORMAL_PROCUREMENT_PLANS,
} from '../data/storyScript';
import { GameMode, NormalOrderPlanId } from '../types/game';

interface Act1ProcurementProps {
  mode: GameMode;
  currentMoney: number;
  onSelectNormalPlan: (planId: NormalOrderPlanId) => void;
  onCompleteHardIntro: () => void;
}

export const Act1Procurement = memo(function Act1Procurement({
  mode,
  currentMoney,
  onSelectNormalPlan,
  onCompleteHardIntro,
}: Act1ProcurementProps) {
  if (mode === 'hard') {
    return (
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[var(--accent-primary)]">查藥櫃 · 目前沒貨</p>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            猛壓降 5/80 叫貨資訊
          </h3>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] px-3 divide-y divide-dashed divide-[var(--border-strong)] text-xs">
          <div className="py-2 flex items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)]">處方需要</span>
            <span className="font-mono-num font-bold text-[var(--text-primary)]">
              猛壓降 5/80 · 28 顆
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)]">一次最少叫貨</span>
            <span className="font-mono-num font-bold text-[var(--text-primary)]">
              1 盒（30 顆）
            </span>
          </div>
          <div className="py-2 flex items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)]">一盒進價</span>
            <span className="font-mono-num font-bold text-[var(--text-primary)]">30 元</span>
          </div>
          <div className="py-2 flex items-center justify-between gap-2">
            <span className="text-[var(--text-secondary)]">今日房租＋電費分攤</span>
            <span className="font-mono-num font-bold text-[var(--status-warn)]">
              {HARD_FIXED_COST} 元
            </span>
          </div>
        </div>

        <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 px-3 py-2.5 text-xs text-[var(--text-primary)] leading-relaxed">
          <span className="font-mono-num font-bold text-[var(--accent-primary)]">猛壓降 5/80</span> 很少人領、很難找；但張阿北已跑了三間藥局，明天就可能斷藥。
        </p>

        <button
          type="button"
          onClick={onCompleteHardIntro}
          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>查看藥商叫貨單</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2.5 animate-stage-fade">
      <div>
        <p className="text-xs font-bold text-[var(--accent-primary)]">開門叫貨 · 三選一</p>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          選擇今天的備貨方式
        </h3>
      </div>

      <div className="space-y-2">
        {NORMAL_PROCUREMENT_PLANS.map((plan) => {
          const nextMoney = currentMoney - plan.cost;
          const netProfit = plan.dispenseIncomePerPatient - DISPENSE_CAPITAL_COST;
          const isBalanced = plan.id === 'balanced';
          const isBulk = plan.id === 'bulk';

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectNormalPlan(plan.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all active:scale-[0.99] ${
                isBalanced
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]/55 hover:bg-[var(--accent-soft)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[var(--accent-primary)]">{plan.code}</span>
                    <span
                      className={`font-mono-num font-bold ${
                        isBulk ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      每張淨利 +{netProfit}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-base font-bold text-[var(--text-primary)]">
                    {isBalanced ? (
                      <PackageCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                    ) : isBulk ? (
                      <ShieldAlert className="w-4 h-4 text-[var(--status-warn)] shrink-0" aria-hidden="true" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[var(--text-secondary)] shrink-0" aria-hidden="true" />
                    )}
                    <span>{plan.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                    {plan.summary}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-1.5 receipt-divider flex items-center justify-between gap-2 text-xs">
                <span className="font-mono-num font-bold text-[var(--text-primary)]">
                  備貨 -{plan.cost} 元（剩 {nextMoney}）· {plan.tradeoffNote}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
});
