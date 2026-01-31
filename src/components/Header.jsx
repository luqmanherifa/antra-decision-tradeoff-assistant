import { useState } from "react";
import { InfoIcon, CloseIcon } from "./icons";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 px-5 py-6 mb-5">
        <div className="relative text-center">
          <div className="inline-block">
            <h1 className="text-xl font-bold tracking-wider text-white mb-1">
              ANTRA
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 mt-0">
            <p className="text-sm text-white/90 font-medium">
              Keputusan jadi lebih jelas
            </p>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/30"
              aria-label="Info"
            >
              <InfoIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 px-4 flex items-center justify-center"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-slate-600 to-slate-700 px-5 py-4 rounded-t-3xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Tentang ANTRA
                  </h2>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/30 flex-shrink-0"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-indigo-600">ANTRA</span>{" "}
                  adalah alat bantu untuk membandingkan pilihan-pilihan dalam
                  hidup dengan lebih terstruktur dan objektif.
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Setiap keputusan memiliki dampak di berbagai dimensi seperti
                  waktu, uang, energi, dan stres. ANTRA membantu melihat
                  pengorbanan yang sebenarnya terjadi.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
                <p className="text-xs font-bold text-emerald-700 mb-3 uppercase tracking-wide">
                  Cara Menggunakan:
                </p>
                <ol className="space-y-2.5">
                  <li className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Tulis keputusan yang sedang dihadapi
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Tambahkan minimal 2 pilihan yang tersedia
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Untuk setiap pilihan, tambahkan dampaknya (positif atau
                      negatif)
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Opsional: Tambahkan batasan penting yang tidak dapat
                      dikompromikan
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      5
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Lihat hasil perbandingan dan analisis yang muncul
                    </p>
                  </li>
                </ol>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  ANTRA tidak membuat keputusan - tetapi memberikan kejelasan
                  yang dibutuhkan untuk memutuskan dengan lebih percaya diri.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
