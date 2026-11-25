import { memo, useCallback, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FastForward,
  Gift,
  MessageSquareHeart,
  MessageSquareOff,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import {
  HARD_FIXED_COST,
  HARD_REFUSE_FREEBIE_AFFECTION_PENALTY,
  NORMAL_P2_COUNSEL_AFFECTION,
} from '../data/storyScript';
import { useCountdown } from '../hooks/useCountdown';
import { ConsultBehavior, GameMode, PatientIndex } from '../types/game';

interface Act5ConsultationProps {
  mode: GameMode;
  patientIndex: PatientIndex;
  patientName: string;
  consultBehavior: ConsultBehavior;
  currentMoney: number;
  currentCapital: number;
  onNormalP1Complete: (didCounsel: boolean) => void;
  onNormalP2Complete: (didCounsel: boolean) => void;
  onHardP1QuickSkip: () => void;
  onHardP1CounselSuccess: () => void;
  onHardP1FreebieDecision: (choice: 'refuse' | 'patch') => void;
  onHardP2Complete: (didCounsel: boolean) => void;
}

function getConsultDuration(behavior: ConsultBehavior): number {
  if (behavior === 'calcium_catch') return 4.0;
  if (behavior === 'polite_ok') return 3.0;
  return 2.4;
}

export const Act5Consultation = memo(function Act5Consultation({
  mode,
  patientIndex,
  patientName,
  consultBehavior,
  currentMoney,
  currentCapital,
  onNormalP1Complete,
  onNormalP2Complete,
  onHardP1QuickSkip,
  onHardP1CounselSuccess,
  onHardP1FreebieDecision,
  onHardP2Complete,
}: Act5ConsultationProps) {
  const durationSec = getConsultDuration(consultBehavior);
  const [phase, setPhase] = useState<'choice' | 'counting' | 'revealed' | 'freebie'>('choice');

  const handleConsultDone = useCallback(() => {
    setPhase('revealed');
  }, []);

  const {
    remainingSec: consultRemaining,
    elapsedSec: elapsed,
    remainingPct: progressPct,
  } = useCountdown({
    durationSec,
    active: phase === 'counting',
    onComplete: handleConsultDone,
  });

  const startDetailedConsultation = () => {
    setPhase('counting');
  };

  if (phase === 'choice') {
    return (
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
        <div>
          <p className="text-xs font-bold text-[var(--accent-primary)]">
            第 {patientIndex}/2 位客人 · 用藥提醒
          </p>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            要花點時間提醒怎麼吃藥嗎？
          </h3>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={startDetailedConsultation}
            className="w-full text-left rounded-xl border border-[var(--accent-primary)] bg-[var(--accent-soft)]/55 hover:bg-[var(--accent-soft)] active:scale-[0.99] p-3.5 transition-all"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  選項 A｜多問幾句、仔細提醒
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  主動關心平常怎麼吃藥，以及有沒有同時吃中藥、其他西藥或保健食品。
                </p>
              </div>
              <MessageSquareHeart
                className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5"
                aria-hidden="true"
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (mode === 'normal' && patientIndex === 1) {
                onNormalP1Complete(false);
              } else if (mode === 'normal' && patientIndex === 2) {
                onNormalP2Complete(false);
              } else if (mode === 'hard' && patientIndex === 1) {
                onHardP1QuickSkip();
              } else {
                onHardP2Complete(false);
              }
            }}
            className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-muted)]/60 active:scale-[0.99] p-3.5 transition-all"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">
                  選項 B｜簡單交代、快速送客
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  請客人照藥袋上面寫的吃，直接送客。
                </p>
              </div>
              <FastForward
                className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>
      </section>
    );
  }

  if (phase === 'counting') {
    const calciumAnswer =
      mode === 'normal'
        ? '「我每天早上吃高劑量鈣片，都順便跟護甲寧一起吞耶！」'
        : '「就兒子買的高劑量鈣片啊，我都跟護甲寧、猛壓降 5/80 一起吞！」';

    return (
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              和客人聊聊吃藥習慣中……
            </h3>
          </div>
          <span className="font-mono-num text-xs font-bold text-[var(--accent-primary)]">
            {consultRemaining.toFixed(1)}s
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent-primary)] origin-left transition-transform duration-200 ease-linear"
            style={{ transform: `scaleX(${progressPct / 100})` }}
          />
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] p-3 text-xs">
            <div className="font-bold text-[var(--accent-primary)] mb-0.5">藥師</div>
            <p className="text-[var(--text-primary)] leading-relaxed">
              {consultBehavior === 'impatient_dismiss'
                ? '「阿姨稍等一下！請問您平常有同時吃中藥、其他西藥或保健食品嗎？這兩種藥……」'
                : '「請問您平常還有吃其他西藥、中藥，或是保健食品嗎？」'}
            </p>
          </div>

          {consultBehavior === 'calcium_catch' && elapsed >= 1.2 && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 p-3 text-xs">
              <div className="font-bold text-[var(--text-secondary)] mb-0.5">{patientName}</div>
              <p className="text-[var(--text-primary)] leading-relaxed">{calciumAnswer}</p>
            </div>
          )}

          {consultBehavior === 'calcium_catch' && elapsed >= 2.6 && (
            <div className="rounded-xl border border-[var(--status-warn)]/40 bg-[#FEF9EC] p-3 text-xs">
              <div className="font-bold text-[var(--status-warn)] mb-0.5">藥師發現</div>
              <p className="text-[#78350F] leading-relaxed">
                「等等——鈣片跟『{mode === 'normal' ? '護甲寧 50 mcg' : '護甲寧 100 mcg'}』一起吃會影響吸收！」
              </p>
            </div>
          )}

          {consultBehavior === 'polite_ok' && elapsed >= 1.0 && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-muted)]/60 p-3 text-xs">
              <div className="font-bold text-[var(--text-secondary)] mb-0.5">{patientName}</div>
              <p className="text-[var(--text-primary)] leading-relaxed">
                「沒有喔，沒吃中藥也沒亂吃其他西藥或保健食品，都配白開水按時吃。」
              </p>
            </div>
          )}

          {consultBehavior === 'impatient_dismiss' && elapsed >= 1.0 && (
            <div className="rounded-xl border border-[var(--status-warn)]/40 bg-[#FEF9EC] p-3 text-xs">
              <div className="font-bold text-[var(--status-warn)] mb-0.5">{patientName}</div>
              <p className="text-[#78350F] leading-relaxed">
                「哎呀，上面不是都有寫，不用講那麼多啦……」
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (phase === 'revealed') {
    if (consultBehavior === 'calcium_catch') {
      return (
        <section className="rounded-2xl border border-[var(--accent-primary)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[var(--accent-primary)]">
                還好有多問一句！
              </p>
              <h3 className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
                及時擋下「鈣片」跟「護甲寧」打架
              </h3>
            </div>
            <ShieldAlert className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>

          <div className="rounded-xl bg-[var(--accent-soft)]/70 p-3 text-xs text-[var(--text-primary)] leading-relaxed">
            高劑量鈣片會擋住 <strong>{mode === 'normal' ? '護甲寧 50 mcg' : '護甲寧 100 mcg'}</strong> 的吸收。你立刻幫{mode === 'normal' ? '她' : '他'}在藥袋上寫好「兩樣至少要隔開 4 小時再吃」！
          </div>

          <button
            type="button"
            onClick={() => {
              if (mode === 'normal') {
                onNormalP1Complete(true);
              } else {
                onHardP1CounselSuccess();
                setPhase('freebie');
              }
            }}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>
              {mode === 'normal' ? '迎接第 2 位客人（好感 +10）' : '繼續櫃檯結帳（好感 +10）'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </section>
      );
    }

    if (consultBehavior === 'polite_ok') {
      return (
        <section className="rounded-2xl border border-[var(--accent-primary)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[var(--accent-primary)]">
                確認完畢 · 吃法沒問題
              </p>
              <h3 className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
                王阿北禮貌地向你道謝
              </h3>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>

          <div className="rounded-xl bg-[var(--accent-soft)]/70 p-3 text-xs text-[var(--text-primary)] leading-relaxed">
            「謝謝藥師這麼細心幫我確認，有你們在社區真的很安心，辛苦你了！」（好感 +{NORMAL_P2_COUNSEL_AFFECTION}）
          </div>

          <button
            type="button"
            onClick={() => onNormalP2Complete(true)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>完成今天的工作，看看結果</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </section>
      );
    }

    return (
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-3 animate-stage-fade">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-[var(--status-warn)]">好心提醒被打斷 · 藥局日常</p>
            <h3 className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
              陳阿姨不耐煩地打斷了提醒
            </h3>
          </div>
          <MessageSquareOff className="w-5 h-5 text-[var(--status-warn)] shrink-0 mt-0.5" aria-hidden="true" />
        </div>

        <div className="rounded-xl bg-[var(--bg-muted)]/70 p-3 text-xs text-[var(--text-primary)] leading-relaxed">
          「好啦好啦我知道！藥袋上面不是都有寫，不用講那麼多啦，我要趕著去接孫子！」——玻璃門啪地關上，該打烊結帳了。
        </div>

        <button
          type="button"
          onClick={() => onHardP2Complete(true)}
          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] active:scale-[0.99] text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2"
        >
          <span>打烊結算（今日房租電費 {HARD_FIXED_COST} 元）</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </section>
    );
  }

  // Phase 4: Hard Mode Patient 1 Freebie Decision
  const cashAfterPatch = Math.max(0, currentMoney - 20);

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 space-y-2.5 animate-stage-fade">
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-[var(--accent-primary)]">第 1 位尾聲 · 開口要贈品</p>
        <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
          阿北：「隔壁領藥都有送小禮物，你們沒有喔？」
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          現金 <strong className="font-mono-num text-[var(--text-primary)]">{currentMoney}</strong> · 藥庫{' '}
          <strong className="font-mono-num">{currentCapital}</strong> · 尚有第 2 位客人與房租電費 {HARD_FIXED_COST} 元
        </p>
      </div>

      <div className="rounded-xl border border-[var(--status-warn)]/35 bg-[#FEF9EC] px-3 py-2 flex items-start gap-2 text-xs text-[#78350F] leading-snug">
        <Scale className="w-4 h-4 text-[var(--status-warn)] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          健保規定特約藥局不得以贈品招徠病人領藥；依《藥師法》還可能被移付懲戒。
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onHardP1FreebieDecision('refuse')}
          className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.99] p-3 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">
                選項 A｜照規定婉拒
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                他嘆口氣說那只領這次——抽屜還留著剪剩的 2 顆猛壓降 5/80。
              </p>
            </div>
            <Scale className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="mt-2 pt-1.5 receipt-divider font-mono-num text-xs font-bold text-[var(--status-warn)]">
            好感 -{HARD_REFUSE_FREEBIE_AFFECTION_PENALTY} · 守規定、留住現金
          </p>
        </button>

        <button
          type="button"
          onClick={() => onHardP1FreebieDecision('patch')}
          className="w-full text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.99] p-3 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">
                選項 B｜自己貼錢送 20 元貼布
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                冒檢舉風險自掏腰包安撫，他笑說下次再來，但你沒把握。
              </p>
            </div>
            <Gift className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
          </div>
          <p className="mt-2 pt-1.5 receipt-divider font-mono-num text-xs font-bold text-[var(--status-danger)]">
            現金 -20（剩 {cashAfterPatch}）· 好感 +10
          </p>
        </button>
      </div>
    </section>
  );
});
