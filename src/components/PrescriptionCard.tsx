import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { PrescriptionItem } from '../types/game';

interface PrescriptionCardProps {
  patientName: string;
  patientMeta: string;
  rxNumber: string;
  items: readonly PrescriptionItem[];
  shortageNote?: string;
  defaultOpen?: boolean;
  compactToggleable?: boolean;
}

export const PrescriptionCard = memo(function PrescriptionCard({
  patientName,
  patientMeta,
  rxNumber,
  items,
  shortageNote,
  defaultOpen = true,
  compactToggleable = false,
}: PrescriptionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] overflow-hidden">
      <div className="px-3.5 py-2 flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
              處方箋 · {patientName}
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] truncate font-mono-num">
              {rxNumber} · {patientMeta}
            </p>
          </div>
        </div>
        {compactToggleable && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="min-h-[38px] px-2.5 rounded-lg text-xs font-bold text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>{isOpen ? '收合' : '展開明細'}</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="px-3.5 py-2.5 space-y-2">
          <div className="divide-y divide-dashed divide-[var(--border-strong)]">
            {items.map((item) => (
              <div key={item.targetDrugId} className="py-1.5 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    <span>{item.displayName}</span>
                    <span className="font-mono-num font-bold ml-1 text-[var(--accent-primary)]">
                      {item.strength}
                    </span>
                  </div>
                  <span className="font-mono-num text-sm font-bold text-[var(--text-primary)] whitespace-nowrap shrink-0">
                    共 {item.requiredQty} 顆
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">
                  {item.dosageInstruction}
                </p>
              </div>
            ))}
          </div>
          {shortageNote && (
            <p className="pt-2 receipt-divider text-xs font-medium text-[var(--status-warn)] leading-snug">
              {shortageNote}
            </p>
          )}
        </div>
      )}
    </section>
  );
});
