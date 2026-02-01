"use client";

import { useTranslations, useLocale } from "next-intl";

interface Risk {
  id: string;
  probability: number;
  impact: number;
}

interface RiskMatrixProps {
  risks: Risk[];
  onRiskClick?: (risk: Risk) => void;
}

export function RiskMatrix({ risks, onRiskClick }: RiskMatrixProps) {
  const t = useTranslations("risks");
  const locale = useLocale();

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const labels = [t("veryLow"), t("low"), t("medium"), t("high"), t("veryHigh")];

  const getCellColor = (prob: number, impact: number) => {
    const emv = prob * impact;
    if (emv >= 0.49) return "bg-red-500/80 hover:bg-red-500";
    if (emv >= 0.25) return "bg-yellow-500/80 hover:bg-yellow-500";
    return "bg-green-500/80 hover:bg-green-500";
  };

  const getRisksInCell = (probLevel: number, impactLevel: number) => {
    return risks.filter((risk) => {
      const probIndex = Math.ceil(risk.probability * 5) - 1;
      const impactIndex = Math.ceil(risk.impact * 5) - 1;
      return probIndex === probLevel && impactIndex === impactLevel;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("riskMatrix")}</h3>

      <div className="flex gap-4">
        {/* Y-axis label */}
        <div className="flex items-center">
          <span
            className="text-sm font-medium -rotate-90 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {t("probability")} →
          </span>
        </div>

        <div className="flex-1">
          {/* Matrix Grid */}
          <div className="grid grid-cols-6 gap-1">
            {/* Header row - empty corner + impact labels */}
            <div className="h-10" />
            {labels.map((label, i) => (
              <div
                key={`impact-${i}`}
                className="h-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}

            {/* Matrix rows (from high to low probability) */}
            {[...levels].reverse().map((probLevel, rowIdx) => (
              <>
                {/* Probability label */}
                <div
                  key={`prob-label-${rowIdx}`}
                  className="h-16 flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {labels[4 - rowIdx]}
                </div>

                {/* Cells */}
                {levels.map((impactLevel, colIdx) => {
                  const cellRisks = getRisksInCell(4 - rowIdx, colIdx);
                  return (
                    <div
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`h-16 rounded-md flex flex-wrap items-center justify-center gap-1 p-1 transition-colors cursor-pointer ${getCellColor(
                        probLevel,
                        impactLevel
                      )}`}
                    >
                      {cellRisks.map((risk) => (
                        <button
                          key={risk.id}
                          onClick={() => onRiskClick?.(risk)}
                          className="h-6 w-6 rounded-full bg-white/90 text-xs font-bold text-gray-800 flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                          title={risk.id}
                        >
                          {risk.id.replace("R", "")}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>

          {/* X-axis label */}
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("impact")} →
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500" />
          <span className="text-sm">{t("highRisk")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-yellow-500" />
          <span className="text-sm">{t("mediumRisk")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-green-500" />
          <span className="text-sm">{t("lowRisk")}</span>
        </div>
      </div>
    </div>
  );
}
