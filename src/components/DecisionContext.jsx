import { QuestionCircleIcon } from "./icons";

export default function DecisionContext({ value, onChange }) {
  return (
    <div className="px-4 mb-5">
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0">
            <QuestionCircleIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Keputusan Apa?
          </h2>
        </div>

        <input
          className="w-full px-3.5 py-3 border-2 border-slate-300 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
          placeholder="Beli kopi di kafe atau bikin sendiri?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
