import { useState, useEffect } from "react";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      const sections = ["hero", "features", "demo", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const FloatingElement = ({ children, delay = 0, duration = "3s" }) => (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: duration,
        transformOrigin: "center"
      }}
    >
      {children}
    </div>
  );

  const SectionTitle = ({ children, number }) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-8 relative group">
      <span className="flex items-center gap-3">
        <span className="text-blue-400 opacity-60 text-sm md:text-base">0{number}</span>
        <span className={`${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
          } transition-all duration-700 inline-block`}>
          {children}
        </span>
      </span>
      <div className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-400 to-transparent group-hover:w-32 transition-all duration-500"></div>
    </h2>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)`,
          backgroundSize: "50px 50px"
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.165-2.052-.48-3.006z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TaskSync
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Beranda", section: "hero" },
                { label: "Fitur", section: "features" },
                { label: "Demo", section: "demo" },
                { label: "Kontak", section: "contact" }
              ].map((item) => (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className={`text-sm font-medium transition-all duration-300 hover:text-blue-400 capitalize ${activeSection === item.section ? 'text-blue-400' : 'text-gray-300'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => window.open('https://mhnurr.github.io/TaskSync/', '_blank')}
              className="hidden md:block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`text-center ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} transition-all duration-1000 delay-300`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Atur Tugas Kuliah
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lebih Cerdas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Solusi manajemen tugas & produktivitas harian untuk mahasiswa, pelajar, profesional dan generasi produktif.
              Pantau progres, rencanakan kegiatan, dan capai target akademik dengan lebih mudah.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => scrollToSection('demo')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Lihat Demo
              </button>
              <button
                onClick={() => window.open('https://mhnurr.github.io/TaskSync/', '_blank')}
                className="border border-blue-400/50 hover:border-blue-400 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-blue-500/10 backdrop-blur-sm"
              >
                Coba Sekarang
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle number={1}>Fitur Unggulan</SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Manajemen Tugas Kuliah",
                desc: "Atur semua tugas akademik dalam board seperti Trello dengan status To Do, In Progress, dan Done."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Perencanaan Harian",
                desc: "Buat jadwal harian yang terstruktur untuk meningkatkan produktivitas setiap hari."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Laporan Progres",
                desc: "Monitor perkembangan dengan chart visual yang menampilkan progres harian dan keseluruhan."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Kalender Real-time",
                desc: "Kalender interaktif yang menampilkan deadline tugas dan aktivitas harian Anda."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Tema Gelap/Terang",
                desc: "Pilih tema yang nyaman untuk mata Anda, baik saat siang maupun malam hari."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Data Lokal Aman",
                desc: "Semua data disimpan di localStorage, aman dan tidak akan hilang saat refresh halaman."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  } transition-all duration-700 delay-${index * 100}`}
              >
                <div className="bg-white/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 hover:bg-white/15 hover:border-blue-400/40 transition-all duration-500 group hover:transform hover:scale-105 h-full">
                  <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle number={2}>Coba Sekarang</SectionTitle>

          <div className={`text-center mb-12 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} transition-all duration-1000 delay-300`}>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Rasakan pengalaman mengelola tugas kuliah dan perencanaan harian secara intuitif.
              Semua fitur lengkap siap digunakan tanpa perlu registrasi.
            </p>
          </div>

          <div className={`relative ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} transition-all duration-1000 delay-500`}>
            <div className="bg-white/10 backdrop-blur-md border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-black/20 border-b border-blue-500/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <iframe
                src="https://mhnurr.github.io/TaskSync/"
                className="w-full h-96 md:h-[600px] border-none"
                title="TaskSync Demo"
                loading="lazy"
              ></iframe>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => window.open('https://mhnurr.github.io/TaskSync/', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Buka Aplikasi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle number={3}>Mulai Produktif Hari Ini</SectionTitle>

          <div className={`max-w-2xl mx-auto ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} transition-all duration-1000 delay-300`}>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              TaskSync dirancang khusus untuk membantu mahasiswa mengelola waktu dan tugas dengan lebih efektif.
              Gunakan aplikasi ini untuk mencapai potensi maksimal Anda dalam dunia akademik.
            </p>

            <div className="bg-white/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-8 items-center justify-center text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">hudamohammadnur1987@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Lokasi</p>
                    <p className="font-semibold">Nganjuk, Jawa Timur,Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.open('https://mhnurr.github.io/TaskSync/', '_blank')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Mulai Menggunakan
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.165-2.052-.48-3.006z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TaskSync
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 TaskSync - Copyright all right reserved
          </p>
          <p className="text-gray-400">
            Moh Nur Huda
          </p>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .animate-float {
            animation-duration: 4s;
          }
        }
      `}</style>
    </div>
  );
};

export default App;