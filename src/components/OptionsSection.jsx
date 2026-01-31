import { DIMENSIONS } from "../constants/dimensions";
import { ClipboardListIcon } from "./icons";

export default function OptionsSection({
  options,
  viewMode,
  onViewModeChange,
  onAddOption,
  onUpdateTitle,
  onAddImpact,
  onUpdateImpact,
}) {
  return (
    <div className="px-4 mb-5">
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0">
              <ClipboardListIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Pilihan
            </h2>
          </div>

          <div className="flex gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => onViewModeChange("detail")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                viewMode === "detail"
                  ? "bg-gradient-to-br from-slate-500 to-slate-600 text-white"
                  : "text-slate-600"
              }`}
            >
              Lengkap
            </button>
            <button
              onClick={() => onViewModeChange("quick")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                viewMode === "quick"
                  ? "bg-gradient-to-br from-slate-500 to-slate-600 text-white"
                  : "text-slate-600"
              }`}
            >
              Cepat
            </button>
          </div>
        </div>

        <button
          onClick={onAddOption}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl text-sm font-bold"
        >
          + Tambah Pilihan
        </button>

        {viewMode === "detail" ? (
          <DetailView
            options={options}
            onUpdateTitle={onUpdateTitle}
            onAddImpact={onAddImpact}
            onUpdateImpact={onUpdateImpact}
          />
        ) : (
          <QuickView
            options={options}
            onUpdateTitle={onUpdateTitle}
            onAddImpact={onAddImpact}
            onUpdateImpact={onUpdateImpact}
          />
        )}
      </div>
    </div>
  );
}

function DetailView({ options, onUpdateTitle, onAddImpact, onUpdateImpact }) {
  const colors = [
    {
      bg: "bg-blue-50",
      badge: "from-blue-500 to-blue-600",
      border: "border-blue-200",
      button: "from-blue-400 to-blue-500",
    },
    {
      bg: "bg-purple-50",
      badge: "from-purple-500 to-purple-600",
      border: "border-purple-200",
      button: "from-purple-400 to-purple-500",
    },
    {
      bg: "bg-emerald-50",
      badge: "from-emerald-500 to-emerald-600",
      border: "border-emerald-200",
      button: "from-emerald-400 to-emerald-500",
    },
    {
      bg: "bg-amber-50",
      badge: "from-amber-500 to-amber-600",
      border: "border-amber-200",
      button: "from-amber-400 to-amber-500",
    },
  ];

  return (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const color = colors[idx % colors.length];

        return (
          <div
            key={opt.id}
            className={`border-2 ${color.border} rounded-xl p-3.5 ${color.bg}`}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${color.badge} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
              >
                {idx + 1}
              </div>
              <input
                className="flex-1 px-3 py-2.5 border-2 border-slate-300 rounded-lg text-sm font-semibold bg-white focus:outline-none focus:border-slate-400"
                placeholder={idx % 2 === 0 ? "Beli di Kafe" : "Bikin Sendiri"}
                value={opt.title}
                onChange={(e) => onUpdateTitle(opt.id, e.target.value)}
              />
            </div>

            <button
              onClick={() => onAddImpact(opt.id)}
              className={`w-full mb-3 px-3.5 py-2.5 bg-gradient-to-br ${color.button} text-white text-xs font-bold rounded-lg`}
            >
              + Dampak
            </button>

            <div className="space-y-2.5">
              {opt.impacts.map((impact) => (
                <ImpactItem
                  key={impact.id}
                  impact={impact}
                  optionIndex={idx}
                  onUpdate={(patch) => onUpdateImpact(opt.id, impact.id, patch)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuickView({ options, onUpdateTitle, onAddImpact, onUpdateImpact }) {
  const colors = [
    {
      bg: "bg-blue-50",
      badge: "from-blue-500 to-blue-600",
      border: "border-blue-200",
      button: "from-blue-400 to-blue-500",
    },
    {
      bg: "bg-purple-50",
      badge: "from-purple-500 to-purple-600",
      border: "border-purple-200",
      button: "from-purple-400 to-purple-500",
    },
  ];

  return (
    <div>
      {options.length > 2 && (
        <div className="mb-3 px-3.5 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl">
          <p className="text-xs font-semibold text-amber-900 leading-relaxed">
            Mode cepat maksimal 2 pilihan. Pilihan ke-3 dan seterusnya
            disembunyikan.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {options.slice(0, 2).map((opt, idx) => {
          const color = colors[idx % colors.length];

          return (
            <div
              key={opt.id}
              className={`border-2 ${color.border} rounded-xl p-3 ${color.bg}`}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className={`w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br ${color.badge} text-white flex items-center justify-center text-xs font-bold`}
                >
                  {idx + 1}
                </div>
                <input
                  className="flex-1 min-w-0 px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-slate-400"
                  placeholder={idx % 2 === 0 ? "Beli di Kafe" : "Bikin Sendiri"}
                  value={opt.title}
                  onChange={(e) => onUpdateTitle(opt.id, e.target.value)}
                />
              </div>

              <button
                onClick={() => onAddImpact(opt.id)}
                className={`w-full mb-2.5 px-3 py-2 bg-gradient-to-br ${color.button} text-white text-xs font-bold rounded-lg`}
              >
                + Dampak
              </button>

              <div className="space-y-2">
                {opt.impacts.map((impact) => (
                  <div
                    key={impact.id}
                    className="bg-white rounded-lg p-2 border border-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <select
                        value={impact.dimension}
                        onChange={(e) =>
                          onUpdateImpact(opt.id, impact.id, {
                            dimension: e.target.value,
                          })
                        }
                        className="flex-1 min-w-0 px-2 py-1.5 border border-slate-300 rounded-md text-xs font-semibold focus:outline-none focus:border-slate-400"
                      >
                        {DIMENSIONS.map((d) => (
                          <option key={d.key} value={d.key}>
                            {d.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="w-14 flex-shrink-0 px-1.5 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-center focus:outline-none focus:border-slate-400"
                        placeholder="0"
                        value={impact.value}
                        onChange={(e) =>
                          onUpdateImpact(opt.id, impact.id, {
                            value: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImpactItem({ impact, optionIndex, onUpdate }) {
  const getPlaceholder = () => {
    if (optionIndex % 2 === 0) {
      const placeholders = {
        time: "Langsung jadi",
        money: "25 ribu per cangkir",
        energy: "Tinggal pesan saja",
        stress: "Tidak ribet pagi",
        risk: "Kualitas selalu konsisten",
        growth: "Tidak belajar skill",
        peace: "Suasana kafe nyaman",
        flexibility: "Tergantung jam buka",
        opportunity: "Ketemu teman barista",
      };
      return placeholders[impact.dimension] || "";
    } else {
      const placeholders = {
        time: "Perlu waktu buat",
        money: "5 ribu per cangkir",
        energy: "Harus nyiapin sendiri",
        stress: "Ribet kalau terburu",
        risk: "Kadang gagal rasanya",
        growth: "Belajar skill baru",
        peace: "Menikmati proses sendiri",
        flexibility: "Bisa kapan saja",
        opportunity: "Hemat uang bulanan",
      };
      return placeholders[impact.dimension] || "";
    }
  };

  return (
    <div className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-2">
      <div className="flex gap-2">
        <select
          value={impact.dimension}
          onChange={(e) => onUpdate({ dimension: e.target.value })}
          className="flex-1 px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400"
        >
          {DIMENSIONS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-16 px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-slate-400"
          placeholder="0"
          value={impact.value}
          onChange={(e) => onUpdate({ value: Number(e.target.value) })}
        />
      </div>

      <input
        className="w-full px-2.5 py-2 border-2 border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-slate-400"
        placeholder={getPlaceholder()}
        value={impact.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />
    </div>
  );
}
