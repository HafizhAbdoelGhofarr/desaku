import Link from "next/link";
import { ArrowRight, ShieldCheck, BarChart3, Users, Leaf } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Sistem Desa Ku</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
          >
            Masuk Sistem (Petugas)
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pt-24 pb-16 bg-gradient-to-b from-emerald-50 to-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200">
          <Leaf className="w-3.5 h-3.5" />
          <span>Sistem Informasi Ketahanan Desa Berbasis AI & SDGs</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight">
          Pantau & Majukan <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Ketahanan Desa Anda</span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          Platform terpadu bagi Administrator Kabupaten beserta Perangkat Desa dalam mengukur, memverifikasi, dan mensimulasikan indeks ketahanan desa secara transparan dan cerdas.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/publik/skor"
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 hover:-translate-y-0.5"
          >
            <span>Lihat Skor Desa</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 transition-all shadow-sm"
          >
            Masuk Sistem Petugas
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl w-full text-left">
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-emerald-600" />}
            title="Transparansi & Verifikasi"
            desc="Data ketahanan desa diverifikasi berjenjang oleh tim Administrator Kabupaten sebelum dipublikasikan untuk menjamin validitas."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
            title="AI & What-If Analysis"
            desc="Simulasi dampak intervensi dan rekomendasi kebijakan prioritas berbasis kecerdasan buatan untuk akselerasi pembangunan."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-amber-600" />}
            title="Kanal Suara Warga"
            desc="Masyarakat dapat memantau capaian desa dan menyalurkan aspirasi, aduan lapangan, serta masukan langsung."
          />
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Sistem Desa Ku - Gemastik XIX. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
