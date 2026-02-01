import { DIMENSIONS } from "../constants/dimensions";
import { ArrowDownIcon, ArrowUpIcon, ChartBarIcon, CloseIcon } from "./icons";

export default function ResultsSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  if (!result) return null;

  const hasMultipleOptions = result.totals && result.totals.length > 2;

  return (
    <div className="px-5">
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <ChartBarIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
            Hasil
          </h2>
        </div>

        {hasMultipleOptions ? (
          <MultiOptionComparison result={result} />
        ) : (
          <ScoreComparison result={result} />
        )}

        {result.deltas && result.deltas.length > 0 && (
          <DeltasSection
            result={result}
            filterMode={filterMode}
            filteredDeltas={filteredDeltas}
            onFilterModeChange={onFilterModeChange}
          />
        )}
      </div>
    </div>
  );
}

function MultiOptionComparison({ result }) {
  const sortedTotals = [...result.totals].sort((a, b) => {
    if (a.isDisqualified && !b.isDisqualified) return 1;
    if (!a.isDisqualified && b.isDisqualified) return -1;
    return Number(b.total || 0) - Number(a.total || 0);
  });

  const colors = [
    {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      bar: "bg-blue-500",
    },
    {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      bar: "bg-purple-500",
    },
    {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      bar: "bg-emerald-500",
    },
    {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      bar: "bg-amber-500",
    },
  ];

  const maxScore = Math.max(
    ...sortedTotals
      .filter((t) => !t.isDisqualified)
      .map((t) => Math.abs(Number(t.total) || 0)),
    1,
  );

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-4">
        Peringkat Pilihan
      </h3>

      <div className="space-y-3">
        {sortedTotals.map((total, idx) => {
          const color = colors[idx % colors.length];
          const totalNum = Number(total.total) || 0;
          const barWidth = total.isDisqualified
            ? 0
            : (Math.abs(totalNum) / maxScore) * 100;

          return (
            <div
              key={total.optionId}
              className={`border ${color.border} rounded-xl p-4 ${color.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full ${color.bar} flex items-center justify-center flex-shrink-0`}
                  >
                    {total.isDisqualified ? (
                      <CloseIcon className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-stone-800 tracking-normal">
                    {total.title || `Pilihan ${idx + 1}`}
                  </span>
                </div>
                <div
                  className={`text-base font-bold ${total.isDisqualified ? "text-stone-400" : color.text}`}
                >
                  {total.isDisqualified ? "GUGUR" : totalNum}
                </div>
              </div>

              {!total.isDisqualified && (
                <div className="h-2.5 bg-white rounded-full overflow-hidden border border-stone-200">
                  <div
                    className={`h-full ${color.bar} transition-all duration-300`}
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <div className="inline-block bg-stone-50 border border-stone-200 rounded-lg px-5 py-3">
          <p className="text-sm text-stone-700 font-semibold leading-relaxed tracking-normal">
            {(() => {
              const qualifiedOptions = sortedTotals.filter(
                (t) => !t.isDisqualified,
              );

              if (qualifiedOptions.length === 0) {
                return <>Semua pilihan gugur</>;
              }

              if (qualifiedOptions.length === 1) {
                return (
                  <>
                    <span className={`font-bold ${colors[0].text}`}>
                      {qualifiedOptions[0].title || "Pilihan terbaik"}
                    </span>{" "}
                    adalah satu-satunya pilihan yang tersisa
                  </>
                );
              }

              const best = qualifiedOptions[0];
              const secondBest = qualifiedOptions[1];
              const colorBest =
                colors[
                  sortedTotals.findIndex((t) => t.optionId === best.optionId) %
                    colors.length
                ];

              const bestTotal = Number(best.total) || 0;
              const secondTotal = Number(secondBest.total) || 0;

              if (bestTotal === secondTotal) {
                return <>Beberapa pilihan memiliki skor seimbang</>;
              }

              return (
                <>
                  <span className={`font-bold ${colorBest.text}`}>
                    {best.title || "Pilihan terbaik"}
                  </span>{" "}
                  unggul{" "}
                  <span className="font-bold text-amber-600">
                    {Math.abs(bestTotal - secondTotal)}
                  </span>{" "}
                  poin
                </>
              );
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreComparison({ result }) {
  const total0 = Number(result.totals[0].total) || 0;
  const total1 = Number(result.totals[1].total) || 0;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
            {result.a.title || "Pilihan A"}
          </div>
          <div className="text-2xl font-black text-blue-600 flex items-center gap-2">
            {result.totals[0].isDisqualified ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              total0
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
            <span className="text-xs font-black text-stone-600 tracking-wide">
              VS
            </span>
          </div>
        </div>

        <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
            {result.b.title || "Pilihan B"}
          </div>
          <div className="text-2xl font-black text-purple-600 flex items-center gap-2">
            {result.totals[1].isDisqualified ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              total1
            )}
          </div>
        </div>
      </div>

      <div className="h-3 bg-stone-100 rounded-full overflow-hidden flex border border-stone-200 mb-4">
        {(() => {
          const absTotal = Math.abs(total0) + Math.abs(total1);

          if (absTotal === 0) {
            return (
              <>
                <div className="w-1/2 bg-blue-500"></div>
                <div className="w-1/2 bg-purple-500"></div>
              </>
            );
          }

          const aWidth = (Math.abs(total0) / absTotal) * 100;
          const bWidth = (Math.abs(total1) / absTotal) * 100;

          return (
            <>
              <div
                className={`${
                  result.totals[0].isDisqualified
                    ? "bg-stone-400"
                    : "bg-blue-500"
                }`}
                style={{ width: `${aWidth}%` }}
              ></div>
              <div
                className={`${
                  result.totals[1].isDisqualified
                    ? "bg-stone-400"
                    : "bg-purple-500"
                }`}
                style={{ width: `${bWidth}%` }}
              ></div>
            </>
          );
        })()}
      </div>

      <div className="text-center">
        <div className="inline-block bg-stone-50 border border-stone-200 rounded-lg px-5 py-3">
          <p className="text-sm text-stone-700 font-semibold leading-relaxed tracking-normal">
            {result.totals[0].isDisqualified &&
            result.totals[1].isDisqualified ? (
              <>Kedua pilihan gugur</>
            ) : result.totals[0].isDisqualified ? (
              <>
                <span className="font-bold text-blue-600">
                  {result.a.title || "Pilihan A"}
                </span>{" "}
                gugur
              </>
            ) : result.totals[1].isDisqualified ? (
              <>
                <span className="font-bold text-purple-600">
                  {result.b.title || "Pilihan B"}
                </span>{" "}
                gugur
              </>
            ) : total0 > total1 ? (
              <>
                <span className="font-bold text-blue-600">
                  {result.a.title || "Pilihan A"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-amber-600">
                  {Math.abs(total0 - total1)}
                </span>{" "}
                poin
              </>
            ) : total0 < total1 ? (
              <>
                <span className="font-bold text-purple-600">
                  {result.b.title || "Pilihan B"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-amber-600">
                  {Math.abs(total0 - total1)}
                </span>{" "}
                poin
              </>
            ) : (
              <>Skor seimbang</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function DeltasSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
          Beda Utama
        </h3>

        <div className="flex gap-1">
          <button
            onClick={() => onFilterModeChange("all")}
            className={`px-2 py-1 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "all"
                ? "bg-stone-600 text-white border-stone-600"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onFilterModeChange("positive")}
            className={`px-2 py-1 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "positive"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            +
          </button>
          <button
            onClick={() => onFilterModeChange("negative")}
            className={`px-2 py-1 text-xs font-bold rounded-md border transition-colors ${
              filterMode === "negative"
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            -
          </button>
        </div>
      </div>

      {filteredDeltas.length > 0 ? (
        <div className="space-y-3">
          {filteredDeltas.map((d) => {
            const dimLabel =
              DIMENSIONS.find((dim) => dim.key === d.dimension)?.label ||
              d.dimension;

            const winner = d.delta > 0 ? result.b : result.a;
            const loser = d.delta > 0 ? result.a : result.b;
            const winnerName =
              winner.title || (d.delta > 0 ? "Pilihan B" : "Pilihan A");
            const loserName =
              loser.title || (d.delta > 0 ? "Pilihan A" : "Pilihan B");

            return (
              <div
                key={d.dimension}
                className={`rounded-xl p-4 border ${
                  d.delta > 0
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-bold text-stone-800 tracking-normal">
                    {dimLabel}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                      d.delta > 0
                        ? "bg-emerald-100 border-emerald-300"
                        : "bg-rose-100 border-rose-300"
                    }`}
                  >
                    {d.delta > 0 ? (
                      <ArrowUpIcon className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <ArrowDownIcon className="w-3.5 h-3.5 text-rose-700" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        d.delta > 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {Math.abs(d.delta)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium tracking-normal">
                  Pilih{" "}
                  <span
                    className={`font-bold ${
                      d.delta > 0 ? "text-purple-600" : "text-blue-600"
                    }`}
                  >
                    {winnerName}
                  </span>{" "}
                  dapat{" "}
                  <span className="font-bold text-amber-600">
                    +{Math.abs(d.delta)}
                  </span>{" "}
                  {dimLabel.toLowerCase()} dibanding{" "}
                  <span className="font-bold text-stone-800">{loserName}</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-stone-50 rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-200 mx-auto mb-3 flex items-center justify-center">
            <CloseIcon className="w-5 h-5 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500 font-medium tracking-normal">
            Tidak ada yang cocok dengan filter
          </p>
        </div>
      )}
    </div>
  );
}
