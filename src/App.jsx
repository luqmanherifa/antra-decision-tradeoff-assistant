import { useState } from "react";

const DIMENSIONS = [
  { key: "time", label: "Waktu" },
  { key: "money", label: "Uang" },
  { key: "energy", label: "Energi" },
  { key: "stress", label: "Stres" },
  { key: "risk", label: "Risiko" },
  { key: "growth", label: "Growth" },
  { key: "peace", label: "Ketenangan" },
  { key: "flexibility", label: "Fleksibilitas" },
  { key: "opportunity", label: "Kesempatan" },
];

export default function App() {
  const [decisionContext, setDecisionContext] = useState("");
  const [options, setOptions] = useState([]);

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        impacts: [],
      },
    ]);
  };

  const updateOptionTitle = (id, title) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, title } : o)));
  };

  const addImpact = (optionId) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: [
                ...o.impacts,
                {
                  id: crypto.randomUUID(),
                  dimension: DIMENSIONS[0].key,
                  text: "",
                  value: 0,
                },
              ],
            }
          : o,
      ),
    );
  };

  const updateImpact = (optionId, impactId, patch) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? {
              ...o,
              impacts: o.impacts.map((i) =>
                i.id === impactId ? { ...i, ...patch } : i,
              ),
            }
          : o,
      ),
    );
  };

  const compare = () => {
    if (options.length < 2) return null;

    const totals = options.map((o) => ({
      optionId: o.id,
      title: o.title,
      total: o.impacts.reduce((s, i) => s + Number(i.value || 0), 0),
    }));

    const [a, b] = options;

    const allDims = new Set([
      ...a.impacts.map((i) => i.dimension),
      ...b.impacts.map((i) => i.dimension),
    ]);

    const deltas = [...allDims]
      .map((dim) => {
        const aVal = a.impacts
          .filter((i) => i.dimension === dim)
          .reduce((s, i) => s + Number(i.value || 0), 0);

        const bVal = b.impacts
          .filter((i) => i.dimension === dim)
          .reduce((s, i) => s + Number(i.value || 0), 0);

        return {
          dimension: dim,
          aVal,
          bVal,
          delta: bVal - aVal,
        };
      })
      .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));

    return { totals, deltas, a, b };
  };

  const result = compare();

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-700 text-white p-4 mb-4">
          <h1 className="text-xl font-bold">Decision Trade-off</h1>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Keputusan
            </h2>
            <input
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              placeholder="Contoh: Beli kopi A atau kopi B"
              value={decisionContext}
              onChange={(e) => setDecisionContext(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
              Pilihan
            </h2>
            <button
              onClick={addOption}
              className="w-full mb-4 px-4 py-2.5 bg-slate-600 text-white rounded-lg text-sm font-medium active:bg-slate-700"
            >
              + Tambah Opsi
            </button>

            <div className="space-y-4">
              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="border border-slate-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </div>
                    <input
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      placeholder="Nama opsi (misal: Kopi A)"
                      value={opt.title}
                      onChange={(e) =>
                        updateOptionTitle(opt.id, e.target.value)
                      }
                    />
                  </div>

                  <button
                    onClick={() => addImpact(opt.id)}
                    className="w-full mb-3 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200 active:bg-slate-200"
                  >
                    + Dampak
                  </button>

                  <div className="space-y-2">
                    {opt.impacts.map((impact) => (
                      <div
                        key={impact.id}
                        className="bg-slate-50 rounded p-2 space-y-2"
                      >
                        <div className="flex gap-2">
                          <select
                            value={impact.dimension}
                            onChange={(e) =>
                              updateImpact(opt.id, impact.id, {
                                dimension: e.target.value,
                              })
                            }
                            className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                          >
                            {DIMENSIONS.map((d) => (
                              <option key={d.key} value={d.key}>
                                {d.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder="0"
                            value={impact.value}
                            onChange={(e) =>
                              updateImpact(opt.id, impact.id, {
                                value: Number(e.target.value),
                              })
                            }
                          />
                        </div>

                        <input
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                          placeholder="Alasan / detail dampak"
                          value={impact.text}
                          onChange={(e) =>
                            updateImpact(opt.id, impact.id, {
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="px-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Hasil Perbandingan
              </h2>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Total Score
                </h3>
                <div className="space-y-2">
                  {result.totals.map((t) => (
                    <div
                      key={t.optionId}
                      className="flex justify-between items-center px-3 py-2 bg-slate-100 rounded"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {t.title || "Tanpa Nama"}
                      </span>
                      <span className="text-base font-bold text-slate-800">
                        {t.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Trade-offs Terbesar
                </h3>
                <div className="space-y-2">
                  {result.deltas.slice(0, 5).map((d, index) => {
                    const dimLabel =
                      DIMENSIONS.find((dim) => dim.key === d.dimension)
                        ?.label || d.dimension;
                    return (
                      <div
                        key={d.dimension}
                        className="px-3 py-2 bg-slate-50 rounded border border-slate-200"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {dimLabel}
                          </span>
                          <span
                            className={`text-sm font-bold ${d.delta > 0 ? "text-green-600" : d.delta < 0 ? "text-red-600" : "text-slate-600"}`}
                          >
                            {d.delta > 0 ? "+" : ""}
                            {d.delta}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>
                            {result.a.title || "A"}: {d.aVal}
                          </span>
                          <span>
                            {result.b.title || "B"}: {d.bVal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Insight
                </h3>
                {result.deltas[0] && (
                  <div className="px-3 py-3 bg-blue-50 rounded border border-blue-200 text-sm text-slate-700 leading-relaxed">
                    Perbedaan terbesar ada di{" "}
                    <span className="font-semibold text-blue-700">
                      {DIMENSIONS.find(
                        (d) => d.key === result.deltas[0].dimension,
                      )?.label || result.deltas[0].dimension}
                    </span>
                    . Memilih{" "}
                    <span className="font-semibold">
                      {result.deltas[0].delta > 0
                        ? result.b.title || "Opsi B"
                        : result.a.title || "Opsi A"}
                    </span>{" "}
                    memberikan keuntungan lebih di dimensi ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
