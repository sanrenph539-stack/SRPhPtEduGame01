import { useEffect, useState } from 'react';
import { CheckCircle2, Lock, RotateCcw, X } from 'lucide-react';
import { ENDING_ORDER, ENDINGS } from '../data/storyScript';
import { UnlockedAlmanac } from '../types/game';

interface AlmanacModalProps {
  isOpen: boolean;
  almanac: UnlockedAlmanac;
  onClose: () => void;
  onResetProgress: () => void;
}

export function AlmanacModal({
  isOpen,
  almanac,
  onClose,
  onResetProgress,
}: AlmanacModalProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmingReset(false);
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedCount = ENDING_ORDER.filter((id) => almanac.endings[id]).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="almanac-title"
      onClick={onClose}
    >
      <div
        className="animate-sheet-up w-full max-w-[430px] max-h-[88dvh] rounded-t-3xl bg-[var(--bg-surface)] border-t border-x border-[var(--border-subtle)] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border-strong)]" />
        </div>

        <div className="px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)] flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[var(--accent-primary)]">藥師收藏冊</p>
            <h2 id="almanac-title" className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              結局與用藥小知識圖鑑
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              已收集 <span className="font-mono-num font-bold text-[var(--text-primary)]">{unlockedCount} / {ENDING_ORDER.length}</span> 種結局
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉圖鑑"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {ENDING_ORDER.map((id) => {
            const ending = ENDINGS[id];
            const unlocked = almanac.endings[id];

            return (
              <article
                key={id}
                className={`rounded-xl border p-4 ${
                  unlocked
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-paper)]'
                    : 'border-dashed border-[var(--border-strong)] bg-[var(--bg-muted)]/45'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">
                      {ending.codeLabel}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-[var(--text-primary)]">
                      {unlocked ? `${ending.titleNormal} ／ ${ending.titleHard}` : '尚未解鎖'}
                    </h3>
                  </div>
                  {unlocked ? (
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        ending.tone === 'good'
                          ? 'text-[var(--accent-primary)]'
                          : 'text-[var(--status-warn)]'
                      }`}
                      aria-hidden="true"
                    />
                  ) : (
                    <Lock className="w-4 h-4 shrink-0 text-[var(--text-secondary)] opacity-60 mt-1" aria-hidden="true" />
                  )}
                </div>

                {unlocked ? (
                  <div className="mt-3 pt-3 receipt-divider space-y-1.5">
                    <p className="text-xs sm:text-sm font-bold text-[var(--accent-primary)]">
                      {ending.knowledgeTitle}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {ending.knowledgeBody}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {id === 'A' && '解鎖方式：拿對每一顆藥、仔細提醒吃藥注意事項，並留住足夠現金。'}
                    {id === '1B' && '解鎖方式：沒拿錯藥順利過關，但手頭現金剩得太少。'}
                    {id === 'B' && '解鎖方式：趕時間略過用藥提醒，直接送客。'}
                    {id === 'C' && '解鎖方式：拿錯藥盒或算錯顆數就直接給藥。'}
                    {id === 'D' && '解鎖方式：配藥超時或讓客人好感度歸零。'}
                    {id === 'E' && '解鎖方式：現金花光或囤太多貨付不出開銷。'}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="px-4 sm:px-6 py-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2.5 bg-[var(--bg-surface)]">
          {confirmingReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmingReset(false);
                }}
                className="min-h-[44px] px-3.5 rounded-xl bg-[var(--status-danger)] hover:opacity-95 text-white text-xs sm:text-sm font-bold transition-opacity whitespace-nowrap"
              >
                確定清除全部
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="min-h-[44px] px-3 rounded-xl border border-[var(--border-subtle)] text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors whitespace-nowrap"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={unlockedCount === 0}
              onClick={() => setConfirmingReset(true)}
              className="min-h-[44px] px-3 rounded-xl text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--status-danger)] hover:bg-[var(--bg-muted)] disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>重置紀錄</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
