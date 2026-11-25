import { memo } from 'react';
import { DrugSpec } from '../types/game';

interface MedicineBoxCardProps {
  drug: DrugSpec;
  slotCode?: string;
  selected?: boolean;
  pickedCount?: number;
  outOfStock?: boolean;
  onClick?: () => void;
}

export const MedicineBoxCard = memo(function MedicineBoxCard({
  drug,
  slotCode,
  selected = false,
  pickedCount = 0,
  outOfStock = false,
  onClick,
}: MedicineBoxCardProps) {
  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={outOfStock ? undefined : onClick}
      className={`group relative w-full text-left rounded-xl border transition-all duration-150 select-none overflow-hidden min-h-[64px] ${
        outOfStock
          ? 'border-dashed border-[var(--border-strong)] bg-[var(--bg-muted)]/75 opacity-75 cursor-not-allowed'
          : selected
            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/35 bg-[var(--bg-surface)] -translate-y-0.5 shadow-[0_3px_0_rgba(27,37,47,0.16)]'
            : 'border-[#CFC8BA] bg-[#FDFCF9] hover:bg-white shadow-[0_2px_0_rgba(27,37,47,0.12)] active:translate-y-0.5 active:shadow-none'
      }`}
    >
      {/* Top folded cardboard box flap & color band with slot code */}
      <div
        className={`h-5 w-full flex items-center justify-between px-2 border-b border-black/10 text-[10px] font-mono-num font-bold text-white/95 ${
          outOfStock ? 'grayscale opacity-50' : ''
        }`}
        style={{ backgroundColor: drug.bandColor }}
      >
        <span className="truncate">{slotCode ?? drug.defaultShelfCode}</span>
        <span className="whitespace-nowrap shrink-0">
          {outOfStock ? '缺貨' : `${drug.packSize}顆/排`}
        </span>
      </div>

      {/* Box front face */}
      <div className="px-2 py-1.5 space-y-1">
        <div className="flex items-baseline justify-between gap-1">
          <span
            className={`text-sm font-bold leading-tight truncate ${
              outOfStock ? 'text-[#6B7280] line-through' : 'text-[#1B252F]'
            }`}
          >
            {drug.name}
          </span>
          {!outOfStock && pickedCount > 0 && (
            <span className="font-mono-num text-[11px] font-bold text-[var(--accent-primary)] whitespace-nowrap shrink-0">
              已拿 {pickedCount}
            </span>
          )}
        </div>

        {/* Distinct dosage imprint band */}
        <div
          className={`px-2 py-0.5 rounded-md border border-black/8 flex items-center justify-between gap-1 ${
            outOfStock ? 'bg-[#DDD8CE]' : ''
          }`}
          style={outOfStock ? undefined : { backgroundColor: drug.bandAccent }}
        >
          <span
            className={`font-mono-num text-sm font-bold leading-tight ${
              outOfStock ? 'text-[#6B7280]' : 'text-[#161E28]'
            }`}
          >
            {drug.strength}
          </span>
          {outOfStock && (
            <span className="text-[11px] font-bold text-[var(--status-warn)] whitespace-nowrap">
              已開欠單
            </span>
          )}
        </div>
      </div>
    </button>
  );
});
