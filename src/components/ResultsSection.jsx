import { DIMENSIONS } from "../constants/dimensions";
import { ChartBarIcon, CloseIcon } from "./icons";

export default function ResultsSection({
  result,
  filterMode,
  filteredDeltas,
  onFilterModeChange,
}) {
  if (!result) return null;

  return (
    <div className="px-4">
      <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <ChartBarIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Hasil
          </h2>
        </div>

        <ScoreComparison result={result} />

        {(result.totals[0].violations.length > 0 ||
          result.totals[1].violations.length > 0) && (
          <ViolationsSection result={result} />
        )}

        {result.deltas.length > 0 && (
          <DeltasSection
            result={result}
            filterMode={filterMode}
            filteredDeltas={filteredDeltas}
            onFilterModeChange={onFilterModeChange}
          />
        )}

        {(result.isCloseCall || result.hasExtremeSacrifice) && (
          <NoticesSection result={result} />
        )}
      </div>
    </div>
  );
}

function ScoreComparison({ result }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 bg-blue-50 border-2 border-blue-300 rounded-xl p-3.5">
          <div className="text-xs font-bold text-blue-700 mb-1.5 uppercase tracking-wide">
            {result.a.title || "Pilihan A"}
          </div>
          <div className="text-2xl font-black text-blue-600">
            {result.totals[0].isDisqualified ? "✗" : result.totals[0].total}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
            <span className="text-xs font-black text-slate-600">VS</span>
          </div>
        </div>

        <div className="flex-1 bg-purple-50 border-2 border-purple-300 rounded-xl p-3.5">
          <div className="text-xs font-bold text-purple-700 mb-1.5 uppercase tracking-wide">
            {result.b.title || "Pilihan B"}
          </div>
          <div className="text-2xl font-black text-purple-600">
            {result.totals[1].isDisqualified ? "✗" : result.totals[1].total}
          </div>
        </div>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex border-2 border-slate-300 mb-3">
        {(() => {
          const totalA = result.totals[0].total;
          const totalB = result.totals[1].total;
          const absTotal = Math.abs(totalA) + Math.abs(totalB);

          if (absTotal === 0) {
            return (
              <>
                <div className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              </>
            );
          }

          const aWidth = (Math.abs(totalA) / absTotal) * 100;
          const bWidth = (Math.abs(totalB) / absTotal) * 100;

          return (
            <>
              <div
                className={`${
                  result.totals[0].isDisqualified
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
                style={{ width: `${aWidth}%` }}
              ></div>
              <div
                className={`${
                  result.totals[1].isDisqualified
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-600"
                }`}
                style={{ width: `${bWidth}%` }}
              ></div>
            </>
          );
        })()}
      </div>

      <div className="text-center px-3">
        <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
          <p className="text-sm text-slate-700 font-semibold leading-relaxed">
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
            ) : result.totals[0].total > result.totals[1].total ? (
              <>
                <span className="font-bold text-blue-600">
                  {result.a.title || "Pilihan A"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-emerald-600">
                  {Math.abs(result.totals[0].total - result.totals[1].total)}
                </span>{" "}
                poin
              </>
            ) : result.totals[0].total < result.totals[1].total ? (
              <>
                <span className="font-bold text-purple-600">
                  {result.b.title || "Pilihan B"}
                </span>{" "}
                unggul{" "}
                <span className="font-bold text-emerald-600">
                  {Math.abs(result.totals[0].total - result.totals[1].total)}
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

function ViolationsSection({ result }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
        Pelanggaran Batasan
      </h3>

      <div className="space-y-2.5">
        {result.totals.map((total, idx) => {
          if (total.violations.length === 0) return null;
          return (
            <div
              key={total.optionId}
              className={`rounded-xl p-3.5 border-2 ${
                total.isDisqualified
                  ? "bg-red-50 border-red-300"
                  : "bg-amber-50 border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-bold text-slate-800">
                  {total.title || `Pilihan ${idx === 0 ? "A" : "B"}`}
                </span>
                {total.isDisqualified && (
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full border border-red-300">
                    GUGUR
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {total.violations.map((v, vIdx) => (
                  <div key={vIdx} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-slate-700 font-semibold flex-1 leading-relaxed">
                      {v.text}
                      {v.type === "soft" && (
                        <span className="text-amber-700 font-bold ml-1">
                          ({v.penalty} poin)
                        </span>
                      )}
                      {v.type === "hard" && (
                        <span className="text-red-700 font-bold ml-1">
                          (gugur)
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {!total.isDisqualified && total.constraintPenalty !== 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-300">
                  <p className="text-xs text-slate-600 font-semibold">
                    Skor dampak:{" "}
                    <span className="font-bold text-slate-800">
                      {total.impactTotal}
                    </span>{" "}
                    → Skor akhir:{" "}
                    <span className="font-bold text-slate-800">
                      {total.total}
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
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
    <div className="mb-5">
      <div className="flex items-start gap-2.5 mb-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pt-1.5">
          Beda Utama
        </h3>

        <div className="flex-1"></div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onFilterModeChange("all")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 ${
              filterMode === "all"
                ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white border-slate-700"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => onFilterModeChange("positive")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 ${
              filterMode === "positive"
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Untung
          </button>
          <button
            onClick={() => onFilterModeChange("negative")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 ${
              filterMode === "negative"
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-600"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            Rugi
          </button>
          <button
            onClick={() => onFilterModeChange("significant")}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border-2 ${
              filterMode === "significant"
                ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600"
                : "bg-white text-slate-600 border-slate-300"
            }`}
          >
            &gt;3
          </button>
        </div>
      </div>

      {filteredDeltas.length > 0 ? (
        <div className="space-y-2.5">
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
                className={`rounded-xl p-3.5 border-2 ${
                  d.delta > 0
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-rose-50 border-rose-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">
                    {dimLabel}
                  </span>
                  <div
                    className={`px-2.5 py-1 rounded-lg border ${
                      d.delta > 0
                        ? "bg-emerald-100 border-emerald-400"
                        : "bg-rose-100 border-rose-400"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        d.delta > 0 ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      Δ {d.delta > 0 ? "+" : ""}
                      {d.delta}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Pilih{" "}
                  <span
                    className={`font-bold ${
                      d.delta > 0 ? "text-purple-600" : "text-blue-600"
                    }`}
                  >
                    {winnerName}
                  </span>{" "}
                  dapat{" "}
                  <span className="font-bold text-emerald-600">
                    +{Math.abs(d.delta)}
                  </span>{" "}
                  {dimLabel.toLowerCase()} dibanding{" "}
                  <span className="font-bold text-slate-800">{loserName}</span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-xl border-2 border-slate-200">
          <div className="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-2 flex items-center justify-center">
            <CloseIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            Tidak ada yang cocok dengan filter
          </p>
        </div>
      )}
    </div>
  );
}

function NoticesSection({ result }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
        Perlu Diperhatikan
      </h3>

      {result.isCloseCall && (
        <div className="px-3.5 py-3 bg-amber-50 border-2 border-amber-300 rounded-xl">
          <p className="text-sm text-amber-900 leading-relaxed font-semibold">
            <span className="font-bold">Hampir Sama:</span> Selisih skor sangat
            tipis. Kembali pada prioritas Anda saat ini.
          </p>
        </div>
      )}

      {result.hasExtremeSacrifice && (
        <div className="px-3.5 py-3 bg-red-50 border-2 border-red-300 rounded-xl">
          <p className="text-sm text-red-900 leading-relaxed font-semibold mb-1.5">
            <span className="font-bold">Ada Dampak Berat:</span> Ada pengorbanan
            yang cukup signifikan di salah satu pilihan.
          </p>
          <div className="space-y-1 pl-2">
            {result.sacrifices.a && result.sacrifices.a.value <= -5 && (
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-red-600 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-red-800 font-semibold">
                  {result.a.title || "Pilihan A"}:{" "}
                  {
                    DIMENSIONS.find(
                      (d) => d.key === result.sacrifices.a.dimension,
                    )?.label
                  }{" "}
                  <span className="font-bold">
                    ({result.sacrifices.a.value})
                  </span>
                </p>
              </div>
            )}
            {result.sacrifices.b && result.sacrifices.b.value <= -5 && (
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-red-600 mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-red-800 font-semibold">
                  {result.b.title || "Pilihan B"}:{" "}
                  {
                    DIMENSIONS.find(
                      (d) => d.key === result.sacrifices.b.dimension,
                    )?.label
                  }{" "}
                  <span className="font-bold">
                    ({result.sacrifices.b.value})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
