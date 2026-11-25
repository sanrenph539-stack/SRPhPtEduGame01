import { memo, useState } from 'react';
import { Check, Clock, ShoppingCart, Truck } from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  HARD_FIXED_COST,
  HARD_SLOW_MOVING_ITEMS,
  HARD_WAIT_AFFECTION_PENALTY,
  MAX_CAPITAL_SCALE,
  SHIPPING_FEE,
} from '../data/storyScript';

interface Act2ShelvingAndTrapProps {
  currentMoney: number;
  currentCapital: number;
  onSelectHardOrderOption: (choice: 'shipping' | 'bulk' | 'wait') => void;
}

export const Act2ShelvingAndTrap = memo(function Act2ShelvingAndTrap({
  currentMoney,
  currentCapital,
  onSelectHardOrderOption,
}: Act2ShelvingAndTrapProps) {
  const [showBulkPicker, setShowBulkPicker] = useState(false);
  const [selectedSlowIds, setSelectedSlowIds] = useState<string[]>([]);

  const slowTotal = HARD_SLOW_MOVING_ITEMS.filter((i) =>
    selectedSlowIds.includes(i.id)
  ).reduce((sum, i) => sum + i.price, 0);
  const grandTotal = 30 + slowTotal;
  const reachedFreeShipping = grandTotal >= FREE_SHIPPING_THRESHOLD;

  const toggleSlowItem = (id: string) => {
    setSelectedSlowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const moneyAfterShipping = Math.max(0, currentMoney - 90);
  const moneyAfterWait = Math.max(0, currentMoney - 30);
  const capitalAfterBulk = Math.min(MAX_CAPITAL_SCALE, currentCapital + FREE_SHIPPING_THRESHOLD);

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2.5 animate-stage-fade">
      <div>
        <p className="text-xs font-bold text-[var(--accent-primary)]">
          藥商叫貨單 · 滿 {FREE_SHIPPING_THRESHOLD} 元免運
        </p>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          猛壓降 5/80 只要 30 元，怎麼叫貨？
        </h3>
      </div>

      {/* Compact 1-line Invoice Summary */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] px-3 py-2 flex items-center justify-between gap-2 text-xs">
        <span className="text-[var(--text-secondary)]">
          藥費 <strong className="font-mono-num text-[var(--text-primary)]">30</strong> · 運費{' '}
          <strong className="font-mono-num text-[var(--status-warn)]">{SHIPPING_FEE}</strong>
        </span>
        <span className="text-[var(--text-secondary)]">
          今日房租電費 <strong className="font-mono-num text-[var(--text-primary)]">{HARD_FIXED_COST} 元</strong>
        </span>
      </div>

      <div className="space-y-2">
        {/* Option A */}
        <button
          type="button"
          onClick={() => onSelectHardOrderOption('shipping')}
          className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.99] p-3 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">
                選項 A｜認賠付運費，立刻叫貨
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                付 30 元藥費＋60 元運費，明天阿北就能準時領藥。
              </p>
            </div>
            <Truck className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="mt-2 pt-1.5 receipt-divider font-mono-num text-xs font-bold text-[var(--status-danger)]">
            現金 -90（剩 {moneyAfterShipping}）· 架上藥 +30
          </p>
        </button>

        {/* Option B */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBulkPicker((prev) => !prev)}
            className="w-full text-left p-3 hover:bg-[var(--bg-muted)]/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  選項 B｜湊滿 {FREE_SHIPPING_THRESHOLD} 元免運
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                  架上已壓 {currentCapital} 元，得買冷門商品來湊單。
                </p>
              </div>
              <ShoppingCart className="w-4 h-4 text-[var(--status-warn)] shrink-0 mt-0.5" aria-hidden="true" />
            </div>
            <p className="mt-1.5 text-xs font-bold text-[var(--status-warn)]">
              {showBulkPicker ? '點選下方冷門商品湊滿 150 元 ▲' : '打開湊免運清單 ▼'}
            </p>
          </button>

          {showBulkPicker && (
            <div className="px-3 pb-3 pt-2.5 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--bg-surface)]">
              <div className="space-y-1.5">
                {HARD_SLOW_MOVING_ITEMS.map((item) => {
                  const checked = selectedSlowIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSlowItem(item.id)}
                      className={`w-full min-h-[46px] px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                        checked
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">
                          {item.subtitle}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono-num text-xs font-bold text-[var(--text-primary)]">
                          +{item.price}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            checked
                              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                              : 'border-[var(--border-strong)] bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={!reachedFreeShipping}
                onClick={() => onSelectHardOrderOption('bulk')}
                className="w-full min-h-[46px] px-3 py-2 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 text-white text-xs font-bold text-center transition-colors"
              >
                {reachedFreeShipping
                  ? `下單 ${FREE_SHIPPING_THRESHOLD} 元免運（架上藥 ${capitalAfterBulk} 元）`
                  : `目前 ${grandTotal}/${FREE_SHIPPING_THRESHOLD} 元（還差 ${FREE_SHIPPING_THRESHOLD - grandTotal}）`}
              </button>
            </div>
          )}
        </div>

        {/* Option C */}
        <button
          type="button"
          onClick={() => onSelectHardOrderOption('wait')}
          className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.99] p-3 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">
                選項 C｜等兩三天湊單免運
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                只要付 30 元，但阿北等太久會不高興，也怕斷藥。
              </p>
            </div>
            <Clock className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="mt-2 pt-1.5 receipt-divider font-mono-num text-xs font-bold text-[var(--status-warn)]">
            現金 -30（剩 {moneyAfterWait}）· 好感 -{HARD_WAIT_AFFECTION_PENALTY} · 架上藥 +30
          </p>
        </button>
      </div>
    </section>
  );
});
