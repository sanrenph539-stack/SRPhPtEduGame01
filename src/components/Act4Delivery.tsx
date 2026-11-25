import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, CreditCard, Eye, RefreshCw } from 'lucide-react';
import { DISPENSE_CAPITAL_COST } from '../data/storyScript';
import { useCountdown } from '../hooks/useCountdown';
import { DispensingTray, DrugSpec, GameMode, PatientIndex, PrescriptionItem } from '../types/game';
import { validateTrayAgainstRx } from '../utils/pharmacy';

interface Act4DeliveryProps {
  mode: GameMode;
  patientIndex: PatientIndex;
  patientName: string;
  drugs: readonly DrugSpec[];
  prescriptionItems: readonly PrescriptionItem[];
  tray: DispensingTray;
  dispenseIncome: number;
  paused?: boolean;
  onPauseTimer: () => void;
  onAutoFixTray: () => void;
  onDeliverMeds: (didDoubleCheck: boolean) => void;
}

function getPatientConfirmLine(mode: GameMode, patientIndex: PatientIndex): string {
  if (mode === 'normal' && patientIndex === 1) {
    return '「對對對，一顆不差！謝謝藥師再幫我點一次。」';
  }
  if (mode === 'normal' && patientIndex === 2) {
    return '「沒錯，劑量跟排數都對，辛苦你了！」';
  }
  if (mode === 'hard' && patientIndex === 1) {
    return '「對啦對啦都對，快刷卡我要去牽機車了！」';
  }
  return '「好啦都點清楚了，排數沒少，快刷卡吧！」';
}

function getPatientWaitFixLine(mode: GameMode): string {
  return mode === 'normal'
    ? '「沒關係沒關係，還好你有當面再看一眼，你慢慢換！」'
    : '「啊怎麼拿錯啦？快一點幫我換好喔，我趕時間捏！」';
}

const OK_CHECK_DURATION = 2.6;
const FIX_CHECK_DURATION = 5.6;

export const Act4Delivery = memo(function Act4Delivery({
  mode,
  patientIndex,
  patientName,
  drugs,
  prescriptionItems,
  tray,
  dispenseIncome,
  paused = false,
  onPauseTimer,
  onAutoFixTray,
  onDeliverMeds,
}: Act4DeliveryProps) {
  const [phase, setPhase] = useState<'choice' | 'checking' | 'ready'>('choice');
  const [hadMismatch, setHadMismatch] = useState(false);
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);
  const [checkDuration, setCheckDuration] = useState(OK_CHECK_DURATION);
  const [swipingCard, setSwipingCard] = useState(false);
  const swipeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (swipeTimerRef.current !== null) {
        window.clearTimeout(swipeTimerRef.current);
      }
    };
  }, []);

  const handleCheckComplete = useCallback(() => {
    if (hadMismatch) {
      onAutoFixTray();
    }
    setPhase('ready');
  }, [hadMismatch, onAutoFixTray]);

  const {
    remainingSec: checkRemaining,
    elapsedSec: elapsed,
    remainingPct: progressPct,
  } = useCountdown({
    durationSec: checkDuration,
    active: phase === 'checking',
    paused,
    onComplete: handleCheckComplete,
  });

  const startDoubleCheckDialogue = () => {
    const issues = validateTrayAgainstRx(drugs, prescriptionItems, tray);
    const mismatch = issues.length > 0;
    const duration = mismatch ? FIX_CHECK_DURATION : OK_CHECK_DURATION;

    setDetectedIssues(issues);
    setHadMismatch(mismatch);
    setCheckDuration(duration);
    setPhase('checking');
  };

  const handleDeliverClick = (didDoubleCheck: boolean) => {
    if (swipingCard) return;
    onPauseTimer();
    setSwipingCard(true);
    swipeTimerRef.current = window.setTimeout(() => {
      swipeTimerRef.current = null;
      onDeliverMeds(didDoubleCheck);
    }, 360);
  };

  const rxSummaryText = prescriptionItems
    .map((i) => `${i.displayName} ${i.strength} ${i.requiredQty} 顆`)
    .join('、');
  const netProfit = dispenseIncome - DISPENSE_CAPITAL_COST;

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-3 relative overflow-hidden animate-stage-fade">
      {swipingCard && (
        <div className="absolute inset-0 z-20 bg-[var(--bg-surface)]/95 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-44 h-24 rounded-xl border border-[var(--accent-primary)] bg-[var(--accent-soft)] relative overflow-hidden flex flex-col justify-between p-3 mb-2.5 shadow-sm">
            <div className="text-xs font-bold text-[var(--accent-primary)] text-left">
              全民健康保險卡
            </div>
            <div className="w-7 h-5 rounded-sm bg-[#D69E2E]/75" />
            <div className="animate-swipe-scan absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-transparent via-white/85 to-transparent" />
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)]">刷健保卡給藥中……</p>
        </div>
      )}

      {phase === 'choice' && (
        <>
          <div>
            <p className="text-xs font-bold text-[var(--accent-primary)]">給藥前確認 · 倒數計時中</p>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              要跟客人當面再對一次，還是直接刷健保卡？
            </h3>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={startDoubleCheckDialogue}
              className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.99] p-3.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">
                    選項 A｜當面再仔細核對一次
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                    跟客人一起核對藥品；若有拿錯，會花時間回藥櫃重拿對的藥。
                  </p>
                </div>
                <Eye className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDeliverClick(false)}
              className="w-full text-left rounded-xl border border-[var(--accent-primary)] bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white p-3.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div>
                  <div className="font-bold text-sm">
                    選項 B｜直接刷健保卡給藥（淨利 +{netProfit}）
                  </div>
                  <p className="mt-0.5 text-xs text-white/85 leading-relaxed">
                    直接刷健保卡把藥交給客人，停止計時。
                  </p>
                </div>
                <CreditCard className="w-4 h-4 text-white shrink-0 mt-0.5" aria-hidden="true" />
              </div>
            </button>
          </div>
        </>
      )}

      {phase === 'checking' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {hadMismatch ? (
                <RefreshCw className="w-4 h-4 text-[var(--status-warn)] animate-spin shrink-0" aria-hidden="true" />
              ) : (
                <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              )}
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {hadMismatch ? '發現拿錯，回藥櫃重新拿藥中……' : '當面核對藥品中……'}
              </h3>
            </div>
            <span
              className={`font-mono-num text-xs font-bold ${
                hadMismatch ? 'text-[var(--status-warn)]' : 'text-[var(--accent-primary)]'
              }`}
            >
              {checkRemaining.toFixed(1)}s
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
            <div
              className={`h-full rounded-full origin-left transition-transform duration-150 ease-linear ${
                hadMismatch ? 'bg-[var(--status-warn)]' : 'bg-[var(--accent-primary)]'
              }`}
              style={{ transform: `scaleX(${progressPct / 100})` }}
            />
          </div>

          <div className="space-y-2">
            {!hadMismatch ? (
              <>
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] p-3 text-xs">
                  <div className="font-bold text-[var(--accent-primary)] mb-0.5">藥師</div>
                  <p className="text-[var(--text-primary)] leading-relaxed">
                    「跟您當面點一下：{rxSummaryText}，這樣排數都對嗎？」
                  </p>
                </div>

                {elapsed >= 1.2 && (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 p-3 text-xs">
                    <div className="font-bold text-[var(--text-secondary)] mb-0.5">{patientName}</div>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {getPatientConfirmLine(mode, patientIndex)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="rounded-xl border border-[var(--status-warn)]/40 bg-[#FEF9EC] p-3 text-xs">
                  <div className="font-bold text-[var(--status-warn)] mb-0.5">藥師</div>
                  <p className="text-[#78350F] leading-relaxed">
                    「這個藥……稍等喔，我幫您重新拿一下！」
                  </p>
                  {detectedIssues.length > 0 && (
                    <p className="mt-1 font-mono-num text-[11px] text-[#92400E]">
                      發現：{detectedIssues.join('、')}
                    </p>
                  )}
                </div>

                {elapsed >= 1.6 && (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 p-3 text-xs">
                    <div className="font-bold text-[var(--text-secondary)] mb-0.5">{patientName}</div>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {getPatientWaitFixLine(mode)}
                    </p>
                  </div>
                )}

                {elapsed >= 3.6 && (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] p-3 text-xs">
                    <div className="font-bold text-[var(--accent-primary)] mb-0.5">藥師</div>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      「不好意思久等了！已重新換成正確的 {rxSummaryText}，幫您點齊了。」
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {phase === 'ready' && (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[var(--accent-primary)]">
                {hadMismatch ? '已經換成對的藥了' : '當面核對完全正確'}
              </p>
              <h3 className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
                {hadMismatch ? '還好有再確認一次，馬上換好了！' : '雙方確認藥品跟數量都沒錯'}
              </h3>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>

          <div className="rounded-xl bg-[var(--accent-soft)]/70 p-3 text-xs text-[var(--text-primary)] leading-relaxed">
            {hadMismatch
              ? `雖然多花了一點時間回藥櫃重拿，但成功換回正確的藥（${rxSummaryText}），避免了一次嚴重的給藥失誤。`
              : `${patientName}已經當面點清所有藥品跟排數（${rxSummaryText}），可以安心刷健保卡給藥了。`}
          </div>

          <button
            type="button"
            onClick={() => handleDeliverClick(true)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>確認無誤，刷健保卡給藥（淨利 +{netProfit}）</span>
          </button>
        </div>
      )}
    </section>
  );
});
