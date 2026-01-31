import { WarningTriangleIcon } from "./icons";

export default function ConstraintsSection({
  constraints,
  options,
  onAddConstraint,
  onUpdateConstraint,
  onUpdateCheck,
  onRemoveConstraint,
}) {
  if (options.length < 2) return null;

  return (
    <div className="px-4 mb-5">
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-4">
        <div className="mb-3">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <WarningTriangleIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Batasan Penting
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-11">
            Ada yang tidak bisa dikompromikan? Tulis di sini
          </p>
        </div>

        <button
          onClick={onAddConstraint}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold"
        >
          + Tambah Batasan
        </button>

        <div className="space-y-3">
          {constraints.map((constraint) => (
            <ConstraintItem
              key={constraint.id}
              constraint={constraint}
              options={options}
              onUpdate={(patch) => onUpdateConstraint(constraint.id, patch)}
              onUpdateCheck={(optionId, value) =>
                onUpdateCheck(constraint.id, optionId, value)
              }
              onRemove={() => onRemoveConstraint(constraint.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConstraintItem({
  constraint,
  options,
  onUpdate,
  onUpdateCheck,
  onRemove,
}) {
  return (
    <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-4">
      <input
        className="w-full px-3.5 py-3 border-2 border-orange-300 rounded-xl text-sm font-semibold mb-4 bg-white focus:outline-none focus:border-orange-400"
        placeholder="Anggaran kopi 300 ribu per bulan"
        value={constraint.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />

      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2.5">
          Tingkat Batasan
        </h3>

        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <label
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg border-2 cursor-pointer ${
              constraint.type === "soft"
                ? "bg-amber-100 border-amber-400"
                : "bg-white border-orange-200"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "soft"}
              onChange={() => onUpdate({ type: "soft" })}
              className="w-4 h-4 border-2 border-slate-400 text-amber-600 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-800">Lunak</div>
              <div className="text-xs text-amber-700 font-semibold">
                Kena penalti
              </div>
            </div>
          </label>

          <label
            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg border-2 cursor-pointer ${
              constraint.type === "hard"
                ? "bg-red-100 border-red-400"
                : "bg-white border-orange-200"
            }`}
          >
            <input
              type="radio"
              name={`type-${constraint.id}`}
              checked={constraint.type === "hard"}
              onChange={() => onUpdate({ type: "hard" })}
              className="w-4 h-4 border-2 border-slate-400 text-red-600 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-800">Keras</div>
              <div className="text-xs text-red-700 font-bold">GUGUR</div>
            </div>
          </label>
        </div>

        {constraint.type === "soft" && (
          <div className="bg-white border-2 border-amber-300 rounded-lg p-3">
            <label className="text-xs text-amber-900 font-bold block mb-2 uppercase tracking-wide">
              Penalti kalau dilanggar
            </label>
            <input
              type="number"
              className="w-full px-3 py-2.5 border-2 border-amber-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-amber-400"
              value={constraint.penalty}
              onChange={(e) => onUpdate({ penalty: Number(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wide">
          Pilihan yang Memenuhi
        </h3>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-2.5 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-orange-300"
            >
              <input
                type="checkbox"
                checked={constraint.checks[opt.id] === true}
                onChange={(e) => onUpdateCheck(opt.id, e.target.checked)}
                className="w-4 h-4 rounded border-2 border-slate-400 text-orange-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-700 font-semibold flex-1">
                {opt.title || `Pilihan ${options.indexOf(opt) + 1}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="w-full px-4 py-2.5 text-sm text-red-700 font-bold bg-white border-2 border-red-300 rounded-lg hover:bg-red-50"
      >
        Hapus Batasan
      </button>
    </div>
  );
}
