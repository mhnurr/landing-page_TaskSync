import { useState, useEffect } from "react";

const App = () => {
  const [activePage, setActivePage] = useState("tasks");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Load data dari localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.warn(`Gagal parsing ${key} dari localStorage`);
      console.error(e.message);
      return defaultValue;
    }
  };

  const [tasks, setTasks] = useState(() =>
    loadFromStorage("universityTasks", [
      { id: 1, title: "Tugas Algoritma", desc: "Selesaikan DFS & BFS", status: "todo", deadline: "2025-04-05", priority: "high" },
      { id: 2, title: "Presentasi MKI", desc: "Buat slide dan latihan", status: "in-progress", deadline: "2025-04-07", priority: "medium" },
      { id: 3, title: "Kuis Basis Data", desc: "Review materi normalisasi", status: "done", deadline: "2025-04-04", priority: "high" },
    ])
  );

  const [dailyPlans, setDailyPlans] = useState(() =>
    loadFromStorage("dailyProductivity", [
      { id: 1, time: "08:00", activity: "Bangun & sarapan", completed: true },
      { id: 2, time: "09:00", activity: "Belajar Frontend", completed: false },
      { id: 3, time: "12:00", activity: "Makan siang & istirahat", completed: true },
      { id: 4, time: "13:00", activity: "Latihan coding", completed: false },
      { id: 5, time: "16:00", activity: "Olahraga ringan", completed: false },
    ])
  );

  const [activitiesLog, setActivitiesLog] = useState(() =>
    loadFromStorage("activitiesLog", [])
  );

  // Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem("universityTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("dailyProductivity", JSON.stringify(dailyPlans));
  }, [dailyPlans]);

  useEffect(() => {
    localStorage.setItem("activitiesLog", JSON.stringify(activitiesLog));
  }, [activitiesLog]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Fungsi log aktivitas
  const addLog = (message) => {
    const newLog = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleString("id-ID"),
    };
    setActivitiesLog((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Update dan hapus task
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) addLog(`Tugas "${task.title}" dihapus`);
  };

  // Tambah task baru
  const addTask = (newTaskData) => {
    const newTask = {
      id: Date.now(),
      ...newTaskData,
      status: "todo",
    };
    setTasks((prev) => [...prev, newTask]);
    addLog(`Tugas baru ditambahkan: "${newTask.title}"`);
  };

  // Tambah kegiatan harian baru
  const addDailyPlan = (newPlanData) => {
    const newPlan = {
      id: Date.now(),
      ...newPlanData,
      completed: false,
    };
    setDailyPlans((prev) => [...prev, newPlan]);
    addLog(`Kegiatan baru ditambahkan: "${newPlan.activity}"`);
  };

  // Toggle daily plan
  const togglePlan = (id) => {
    setDailyPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? { ...plan, completed: !plan.completed }
          : plan
      )
    );
    const plan = dailyPlans.find((p) => p.id === id);
    if (plan) {
      addLog(
        plan.completed
          ? `Aktivitas "${plan.activity}" dibatalkan`
          : `Aktivitas "${plan.activity}" diselesaikan`
      );
    }
  };

  // Hapus kegiatan harian
  const deletePlan = (id) => {
    const plan = dailyPlans.find((p) => p.id === id);
    setDailyPlans((prev) => prev.filter((p) => p.id !== id));
    if (plan) addLog(`Kegiatan "${plan.activity}" dihapus`);
  };

  // Hitung progres untuk chart
  const getProgressData = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter(t => t.deadline === today);
    const completedToday = todayTasks.filter(t => t.status === "done").length;
    const totalToday = todayTasks.length;

    const doneTasks = tasks.filter(t => t.status === "done").length;
    const totalTasks = tasks.length;

    const byStatus = {
      todo: tasks.filter(t => t.status === "todo").length,
      "in-progress": tasks.filter(t => t.status === "in-progress").length,
      done: tasks.filter(t => t.status === "done").length,
    };

    return {
      daily: totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0,
      overall: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
      byStatus,
    };
  };

  const progress = getProgressData();

  // Render Chart Lingkaran
  const renderCircularChart = (percentage, label) => (
    <div className={`rounded-xl p-4 border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} ${darkMode ? 'bg-white/10' : 'bg-white'} ${darkMode ? '' : 'shadow-sm'}`}>
      <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>{label}</h4>
      <div className="relative w-20 h-20 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={darkMode ? "#ffffff30" : "#e0e7ff"}
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>{percentage}%</span>
        </div>
      </div>
    </div>
  );

  // Render Chart Batang (Horizontal)
  const renderBarChart = () => {
    const max = Math.max(...Object.values(progress.byStatus)) || 1;

    const barColor = (status) => {
      if (status === 'todo') return darkMode ? 'bg-blue-500' : 'bg-blue-500';
      if (status === 'in-progress') return darkMode ? 'bg-yellow-500' : 'bg-yellow-500';
      return darkMode ? 'bg-green-500' : 'bg-green-500';
    };

    const labelColor = darkMode ? 'text-blue-200' : 'text-gray-700';

    return (
      <div className={`rounded-xl p-4 ${darkMode ? 'bg-white/10' : 'bg-white'} border ${darkMode ? 'border-blue-500/30' : 'border-blue-200'} ${darkMode ? '' : 'shadow-sm'}`}>
        <h4 className={`text-sm font-medium mb-4 ${labelColor}`}>Distribusi Tugas</h4>
        <div className="space-y-3">
          {Object.entries(progress.byStatus).map(([status, count]) => {
            const width = `${(count / max) * 100}%`;
            const label = status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done';
            return (
              <div key={status}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={labelColor}>{label}</span>
                  <span className={labelColor}>{count}</span>
                </div>
                <div className={`w-full h-2 bg-gray-300 rounded-full overflow-hidden ${darkMode ? 'bg-gray-600' : ''}`}>
                  <div
                    className={`${barColor(status)} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ width }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Kalender
  const Calendar = () => {
    const today = new Date();
    const month = today.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate();
      days.push(
        <div
          key={i}
          className={`h-8 flex items-center justify-center text-sm rounded-full transition-all duration-200 ${isToday
            ? darkMode ? 'bg-blue-500 text-white font-bold scale-110' : 'bg-blue-500 text-white font-bold'
            : darkMode ? 'hover:bg-blue-700' : 'hover:bg-blue-100'
            }`}
        >
          {i}
        </div>
      );
    }

    return (
      <div className={`rounded-xl p-4 border ${darkMode ? 'border-blue-500/30 bg-white/10' : 'border-blue-200 bg-white'} ${darkMode ? '' : 'shadow-sm'}`}>
        <h3 className={`font-semibold text-center mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>{month}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs mb-2">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <div key={day} className={`text-center font-medium ${darkMode ? 'text-blue-300' : 'text-blue-500'}`}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  // Form Modal untuk Tugas
  const TaskForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      desc: "",
      deadline: "",
      priority: "medium",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title || !formData.deadline) return;
      addTask(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-xl p-6 border w-full max-w-md ${darkMode ? 'bg-white/15 backdrop-blur-md border-blue-500/30' : 'bg-white border-gray-200 shadow-xl'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tambah Tugas Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Judul tugas..."
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode
                ? 'bg-white/20 border border-blue-400/50 text-white placeholder-blue-300'
                : 'border border-blue-300 text-gray-800 placeholder-gray-400'
                }`}
              required
            />
            <textarea
              name="desc"
              placeholder="Deskripsi (opsional)..."
              value={formData.desc}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-20 ${darkMode
                ? 'bg-white/20 border border-blue-400/50 text-white placeholder-blue-300'
                : 'border border-blue-300 text-gray-800 placeholder-gray-400'
                }`}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode
                  ? 'bg-white/20 border border-blue-400/50 text-white'
                  : 'border border-blue-300 text-gray-800'
                  }`}
                required
              />
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode
                  ? 'bg-white/20 border border-blue-400/50 text-white'
                  : 'border border-blue-300 text-gray-800'
                  }`}
              >
                <option value="low">Prioritas Rendah</option>
                <option value="medium">Prioritas Sedang</option>
                <option value="high">Prioritas Tinggi</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${darkMode
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-400 hover:bg-gray-500 text-white'
                  }`}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Form Modal untuk Kegiatan Harian
  const DailyPlanForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      time: "",
      activity: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.time || !formData.activity) return;
      addDailyPlan(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-xl p-6 border w-full max-w-md ${darkMode ? 'bg-white/15 backdrop-blur-md border-blue-500/30' : 'bg-white border-gray-200 shadow-xl'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tambah Kegiatan Harian</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Waktu</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode
                    ? 'bg-white/20 border border-blue-400/50 text-white'
                    : 'border border-blue-300 text-gray-800'
                    }`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Aktivitas</label>
                <input
                  type="text"
                  name="activity"
                  placeholder="Aktivitas..."
                  value={formData.activity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode
                    ? 'bg-white/20 border border-blue-400/50 text-white placeholder-blue-300'
                    : 'border border-blue-300 text-gray-800 placeholder-gray-400'
                    }`}
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${darkMode
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-400 hover:bg-gray-500 text-white'
                  }`}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Halaman Tugas Kuliah
  const TasksPage = () => {
    const [showForm, setShowForm] = useState(false);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Manajemen Tugas Kuliah</h1>
            <p className={darkMode ? 'text-blue-200' : 'text-blue-600'}>Atur dan pantau semua tugas akademikmu</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 self-start"
          >
            + Tambah Tugas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["todo", "in-progress", "done"].map((status) => {
            const statusMap = {
              todo: { title: "To Do", color: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', borderColor: darkMode ? 'border-blue-700' : 'border-blue-200' },
              "in-progress": { title: "In Progress", color: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50', borderColor: darkMode ? 'border-yellow-700' : 'border-yellow-200' },
              done: { title: "Done", color: darkMode ? 'bg-green-900/20' : 'bg-green-50', borderColor: darkMode ? 'border-green-700' : 'border-green-200' },
            };
            const filteredTasks = tasks.filter((task) => task.status === status);

            return (
              <div
                key={status}
                className={`${statusMap[status].color} ${statusMap[status].borderColor} border rounded-xl p-4 ${darkMode ? 'shadow-lg shadow-blue-900/20' : 'shadow-sm'}`}
              >
                <h3 className={`font-bold mb-4 text-center ${darkMode ? 'text-blue-100' : 'text-gray-800'}`}>{statusMap[status].title}</h3>
                <div className="space-y-3">
                  {filteredTasks.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tidak ada tugas</p>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`rounded-lg p-3 ${darkMode ? 'bg-white/10 border border-white/20 hover:bg-white/15' : 'bg-white border border-gray-200 hover:shadow'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${task.priority === "high"
                              ? darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-700'
                              : task.priority === "medium"
                                ? darkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-700'
                                : darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {task.desc && <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.desc}</p>}
                        <p className={`text-xs mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Deadline: {task.deadline}</p>
                        <div className="flex gap-2">
                          {status !== "done" && (
                            <button
                              onClick={() =>
                                updateTask(task.id, {
                                  status:
                                    status === "todo"
                                      ? "in-progress"
                                      : status === "in-progress"
                                        ? "done"
                                        : "done",
                                })
                              }
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                            >
                              {status === "todo" ? "Mulai" : "Selesai"}
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCircularChart(progress.daily, "Progres Hari Ini")}
          {renderCircularChart(progress.overall, "Progres Keseluruhan")}
          <Calendar />
        </div>

        <div className="mt-6">
          {renderBarChart()}
        </div>

        {showForm && <TaskForm onClose={() => setShowForm(false)} />}
      </div>
    );
  };

  // Halaman Rencana Harian
  const PlannerPage = () => {
    const [showForm, setShowForm] = useState(false);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Rencana Produktivitas Harian</h1>
            <p className={darkMode ? 'text-blue-200' : 'text-blue-600'}>Agenda harian untuk meningkatkan produktivitas</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 self-start"
          >
            + Tambah Kegiatan
          </button>
        </div>

        <div className={`rounded-xl p-6 border ${darkMode ? 'bg-white/10 border-blue-500/30' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Jadwal Harian</h3>
          <div className="space-y-3">
            {dailyPlans.map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${plan.completed
                  ? darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                  : darkMode ? 'border-white/20 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlan(plan.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${plan.completed
                      ? "bg-green-500 border-green-500"
                      : darkMode ? "border-blue-400 hover:border-blue-300" : "border-blue-400 hover:border-blue-300"
                      }`}
                  >
                    {plan.completed && <div className="w-2 h-2 bg-white rounded"></div>}
                  </button>
                  <div>
                    <p className={`font-medium ${plan.completed ? (darkMode ? 'text-green-300 line-through' : 'text-green-700 line-through') : (darkMode ? 'text-white' : 'text-gray-800')}`}>
                      {plan.activity}
                    </p>
                    <span className={darkMode ? 'text-blue-300 text-xs' : 'text-blue-600 text-xs'}>{plan.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${darkMode ? 'bg-white/10 border-blue-500/30' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Riwayat Aktivitas</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activitiesLog.length === 0 ? (
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Belum ada aktivitas tercatat</p>
            ) : (
              activitiesLog.map((log) => (
                <div key={log.id} className={`text-sm pl-3 py-1 border-l-2 border-blue-400 ${darkMode ? 'text-blue-100' : 'text-gray-700'}`}>
                  <span className={darkMode ? 'text-blue-300 text-xs' : 'text-blue-500 text-xs'}>{log.timestamp}</span> - {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {showForm && <DailyPlanForm onClose={() => setShowForm(false)} />}
      </div>
    );
  };

  return (
    <div className={darkMode ? 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white' : 'min-h-screen bg-gray-50 text-gray-900'}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-white/10 backdrop-blur-md border-b border-blue-500/30' : 'bg-white border-b border-gray-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>CampusPlanner</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setActivePage("tasks")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activePage === "tasks"
                  ? darkMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow'
                  : darkMode ? 'text-blue-200 hover:text-white' : 'text-blue-700 hover:text-blue-900'
                  }`}
              >
                Tugas Kuliah
              </button>
              <button
                onClick={() => setActivePage("planner")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activePage === "planner"
                  ? darkMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow'
                  : darkMode ? 'text-blue-200 hover:text-white' : 'text-blue-700 hover:text-blue-900'
                  }`}
              >
                Rencana Harian
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === "tasks" ? <TasksPage /> : <PlannerPage />}
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center ${darkMode ? 'bg-white/5 border-t border-blue-500/30 text-blue-200' : 'bg-white border-t border-gray-200 text-gray-600'}`}>
        <p className="text-sm">
          TaskSync — Solusi Manajemen Tugas & Produktivitas
        </p>
        <p className="text-sm">
          @2024 By Moh Nur Huda
        </p>
      </footer>

      {/* Tombol Toggle Tema */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 focus:outline-none z-50 ${darkMode ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default App;