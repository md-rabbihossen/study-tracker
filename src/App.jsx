import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

// --- Helper Functions ---
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateHeader = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// --- Schedule Data ---
const scheduleData = {
  weekday: [
    {
      title: "Early Morning (Fajr & DSA)",
      tasks: [
        {
          id: "wd-f-1",
          time: "5:00 - 5:25 AM",
          description: "🤲 Fajr Prayer & Quran/Dhikr",
        },
        {
          id: "wd-m-1",
          time: "5:30 - 5:55 AM",
          description: 'DSA: Review notes / Read "Grokking Algorithms."',
        },
        {
          id: "wd-m-2",
          time: "6:00 - 6:25 AM",
          description: 'DSA: Solve 1 "Easy" LeetCode problem.',
        },
        {
          id: "wd-m-3",
          time: "6:30 - 6:55 AM",
          description: "DSA: Analyze solution for the problem.",
        },
        {
          id: "wd-study-1",
          time: "7:00 - 7:25 AM",
          description: "📚 Study Session: Review subjects",
        },
        {
          id: "wd-study-brk",
          time: "7:25 - 7:30 AM",
          description: "Break",
        },
        {
          id: "wd-study-2",
          time: "7:30 - 7:55 AM",
          description: "📚 Study Session: Practice problems",
        },
        {
          id: "wd-prep",
          time: "8:00 - 8:45 AM",
          description: "Breakfast & Commute to University",
        },
      ],
    },
    {
      title: "University & Dhuhr",
      tasks: [
        {
          id: "wd-uni-1",
          time: "9:00 - 1:00 PM",
          description: "🎓 University Classes",
        },
        {
          id: "wd-dhuhr",
          time: "1:00 - 2:00 PM",
          description: "🤲 Dhuhr Prayer + Lunch Break",
        },
        {
          id: "wd-uni-2",
          time: "2:00 - 4:00 PM",
          description: "🎓 University Classes",
        },
      ],
    },
    {
      title: "Afternoon (Asr & Commute)",
      tasks: [
        {
          id: "wd-asr",
          time: "4:00 - 4:25 PM",
          description: "🤲 Asr Prayer",
        },
        {
          id: "wd-commute",
          time: "4:30 - 5:30 PM",
          description: "Commute Home / Rest",
        },
      ],
    },
    {
      title: "Evening (Maghrib & DSA Core)",
      tasks: [
        {
          id: "wd-maghrib",
          time: "6:00 - 6:25 PM",
          description: "🤲 Maghrib Prayer",
        },
        {
          id: "wd-e-1",
          time: "6:30 - 6:55 PM",
          description: "DSA: Review EPIC lecture / Take Notes.",
        },
        { id: "wd-e-brk-1", time: "6:55 - 7:00 PM", description: "Break" },
        {
          id: "wd-e-2",
          time: "7:00 - 7:25 PM",
          description: 'DSA: Solve 1 "Medium" LeetCode problem.',
        },
        { id: "wd-e-brk-2", time: "7:25 - 7:30 PM", description: "Break" },
        {
          id: "wd-e-3",
          time: "7:30 - 7:55 PM",
          description: "DSA: Analyze best solution for Medium problem.",
        },
      ],
    },
    {
      title: "Night (Isha & Supporting Subjects)",
      tasks: [
        {
          id: "wd-isha",
          time: "8:00 - 8:25 PM",
          description: "🤲 Isha Prayer + Dinner",
        },
        {
          id: "wd-l-1",
          time: "8:30 - 8:55 PM",
          description: "Adv. Programming: Watch lecture / Notes.",
        },
        {
          id: "wd-l-2",
          time: "9:00 - 9:25 PM",
          description: "Math / Stats: Watch lecture / Practice.",
        },
        {
          id: "wd-l-3",
          time: "9:30 - 9:55 PM",
          description: "Data Science: Watch lecture / Review terms.",
        },
        {
          id: "wd-stop",
          time: "10:00 PM",
          description: "🛑 STOP. Sleep.",
        },
      ],
    },
  ],
  weekend: [
    {
      title: "Early Morning",
      tasks: [
        {
          id: "we-f-1",
          time: "5:00 - 5:25 AM",
          description: "🤲 Fajr Prayer",
        },
        {
          id: "we-study-1",
          time: "5:30 - 5:55 AM",
          description: "📚 Study Session: Review notes",
        },
        {
          id: "we-study-brk-1",
          time: "5:55 - 6:00 AM",
          description: "Break",
        },
        {
          id: "we-study-2",
          time: "6:00 - 6:25 AM",
          description: "📚 Study Session: Practice problems",
        },
        {
          id: "we-study-brk-2",
          time: "6:25 - 6:30 AM",
          description: "Break",
        },
        {
          id: "we-study-3",
          time: "6:30 - 6:55 AM",
          description: "📚 Study Session: Read concepts",
        },
        {
          id: "we-breakfast",
          time: "7:00 - 7:30 AM",
          description: "Breakfast",
        },
        {
          id: "we-study-4",
          time: "7:30 - 7:55 AM",
          description: "📚 Study Session: Light Reading / Review",
        },
        {
          id: "we-study-brk-3",
          time: "7:55 - 8:00 AM",
          description: "Break",
        },
        {
          id: "we-study-5",
          time: "8:00 - 8:25 AM",
          description: "📚 Study Session: Practice / Prep for day",
        },
        {
          id: "we-study-brk-4",
          time: "8:25 - 8:30 AM",
          description: "Break",
        },
        {
          id: "we-study-6",
          time: "8:30 - 8:55 AM",
          description: "📚 Study Session: Final review",
        },
      ],
    },
    {
      title: "Morning Session (DSA)",
      tasks: [
        {
          id: "we-m-1",
          time: "9:00 - 9:25 AM",
          description: "DSA: Review week's topics.",
        },
        { id: "we-m-brk-1", time: "9:25 - 9:30 AM", description: "Break" },
        {
          id: "we-m-2",
          time: "9:30 - 9:55 AM",
          description: 'DSA: Solve 1 "Medium" LeetCode problem.',
        },
        { id: "we-m-brk-2", time: "9:55 - 10:00 AM", description: "Break" },
        {
          id: "we-m-3",
          time: "10:00 - 10:25 AM",
          description: "DSA: Analyze solution (time/space).",
        },
        { id: "we-m-brk-3", time: "10:25 - 10:30 AM", description: "Break" },
        {
          id: "we-m-4",
          time: "10:30 - 10:55 AM",
          description: 'DSA: Solve a 2nd "Medium" LeetCode problem.',
        },
        {
          id: "we-long-brk",
          time: "11:00 - 11:30 AM",
          description: "Long Break",
        },
        {
          id: "we-skill-1",
          time: "11:30 - 11:55 AM",
          description: "Math / Stats: Lecture & Notes.",
        },
        {
          id: "we-skill-2",
          time: "12:00 - 12:55 PM",
          description: "Math / Stats: Practice Problems.",
        },
      ],
    },
    {
      title: "Mid-Day (Dhuhr & Skills)",
      tasks: [
        {
          id: "we-dhuhr",
          time: "1:00 - 2:00 PM",
          description: "🤲 Dhuhr Prayer + Lunch Break",
        },
        {
          id: "we-ds-1",
          time: "2:00 - 2:25 PM",
          description: "Data Science: Watch lecture & notes.",
        },
        {
          id: "we-ds-2",
          time: "2:30 - 2:55 PM",
          description: "Data Science: Review concepts.",
        },
        {
          id: "we-ap-1",
          time: "3:00 - 3:25 PM",
          description: "Adv. Programming: Lecture & notes.",
        },
        {
          id: "we-ap-2",
          time: "3:30 - 3:55 PM",
          description: "Adv. Programming: Lecture & notes.",
        },
      ],
    },
    {
      title: "Afternoon (Asr & Hard DSA)",
      tasks: [
        {
          id: "we-asr",
          time: "4:00 - 4:25 PM",
          description: "🤲 Asr Prayer",
        },
        {
          id: "we-hard-1",
          time: "4:30 - 4:55 PM",
          description: 'DSA: Try 1 "Hard" LeetCode problem.',
        },
        {
          id: "we-hard-2",
          time: "5:00 - 5:25 PM",
          description: 'DSA: Review solution for "Hard" problem.',
        },
        {
          id: "we-review",
          time: "5:30 - 5:55 PM",
          description: "Review: Look at all notes from the day.",
        },
      ],
    },
    {
      title: "Evening (Maghrib & Planning)",
      tasks: [
        {
          id: "we-maghrib",
          time: "6:00 - 6:25 PM",
          description: "🤲 Maghrib Prayer",
        },
        {
          id: "we-plan",
          time: "6:30 - 6:55 PM",
          description: "Plan: Write study goals for next week.",
        },
        {
          id: "we-free",
          time: "7:00 - 8:00 PM",
          description: "Free Time / Family / Dinner",
        },
        {
          id: "we-isha",
          time: "8:00 - 8:25 PM",
          description: "🤲 Isha Prayer",
        },
        {
          id: "we-stop",
          time: "8:30 PM",
          description: "🛑 STOP. Enjoy your evening.",
        },
      ],
    },
  ],
};

// --- Pomodoro Timer Component ---
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");

  const modes = {
    focus: { duration: 25 * 60, label: "Focus", color: "bg-gray-900" },
    shortBreak: {
      duration: 5 * 60,
      label: "Short Break",
      color: "bg-emerald-600",
    },
    longBreak: { duration: 15 * 60, label: "Long Break", color: "bg-blue-600" },
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Timer Complete!", {
          body: `${modes[mode].label} session finished!`,
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  const percentage =
    ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Pomodoro Timer</h3>
      </div>

      <div className="flex gap-2 mb-4">
        {Object.entries(modes).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => changeMode(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <div className="text-6xl font-bold text-center text-gray-900 py-8">
          {formatTime(timeLeft)}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${modes[mode].color} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause size={18} /> Pause
            </>
          ) : (
            <>
              <Play size={18} /> Start
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Custom Tasks Component ---
const CustomTasks = ({ date, completedTasks, onToggleTask }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("General");

  const categories = [
    "General",
    "Assignment",
    "Project",
    "Exam Prep",
    "Reading",
    "Other",
  ];

  const categoryColors = {
    General: "bg-gray-100 text-gray-700",
    Assignment: "bg-blue-100 text-blue-700",
    Project: "bg-purple-100 text-purple-700",
    "Exam Prep": "bg-red-100 text-red-700",
    Reading: "bg-emerald-100 text-emerald-700",
    Other: "bg-amber-100 text-amber-700",
  };

  useEffect(() => {
    const dateString = getLocalDateString(date);
    const storageKey = `customTasks_${dateString}`;
    try {
      const savedTasks = localStorage.getItem(storageKey);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error loading custom tasks:", error);
      setTasks([]);
    }
  }, [date]);

  const saveTasks = (updatedTasks) => {
    const dateString = getLocalDateString(date);
    const storageKey = `customTasks_${dateString}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error saving custom tasks:", error);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: `custom-${Date.now()}`,
        description: newTask,
        category: category,
      };
      saveTasks([...tasks, task]);
      setNewTask("");
      setShowForm(false);
    }
  };

  const deleteTask = (taskId) => {
    saveTasks(tasks.filter((t) => t.id !== taskId));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? categoryColors[cat]
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={addTask}
            className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Add Task
          </button>
        </div>
      )}

      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  completedTasks.has(task.id)
                    ? "bg-gray-900 border-gray-900"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {completedTasks.has(task.id) && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </button>
              <span
                className={`flex-1 text-sm ${
                  completedTasks.has(task.id)
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {task.description}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  categoryColors[task.category]
                }`}
              >
                {task.category}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-sm py-4">
          No custom tasks yet. Click + to add one!
        </p>
      )}
    </div>
  );
};

// --- Daily Notes Component ---
const DailyNotes = ({ date }) => {
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const dateString = getLocalDateString(date);
    const storageKey = `notes_${dateString}`;
    try {
      const savedNotes = localStorage.getItem(storageKey);
      setNotes(savedNotes || "");
      setIsSaved(true);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }, [date]);

  const saveNotes = (value) => {
    setNotes(value);
    setIsSaved(false);
    const dateString = getLocalDateString(date);
    const storageKey = `notes_${dateString}`;
    try {
      localStorage.setItem(storageKey, value);
      setTimeout(() => setIsSaved(true), 500);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Notes</h3>
        </div>
        {!isSaved && <span className="text-xs text-gray-500">Saving...</span>}
        {isSaved && notes && (
          <span className="text-xs text-emerald-600">✓ Saved</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => saveNotes(e.target.value)}
        placeholder="Write your thoughts, ideas, or important notes for today..."
        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
      />
    </div>
  );
};

// --- Live Clock Component ---
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Current Time</h3>
        </div>
        <div className="text-3xl font-bold text-gray-900 font-mono">
          {time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
      <div className="text-sm text-gray-500 text-right mt-1">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

// --- Stats Component ---
const StatsView = () => {
  const [stats, setStats] = useState({
    totalDays: 0,
    totalTasks: 0,
    avgCompletion: 0,
  });
  const [last7Days, setLast7Days] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    try {
      // Calculate 30-day stats
      let totalDays = 0;
      let totalTasks = 0;
      let totalCompleted = 0;

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = getLocalDateString(date);

        const habitKey = `studyHabits_${dateString}`;
        const customKey = `customTasks_${dateString}`;

        const habits = localStorage.getItem(habitKey);
        const customs = localStorage.getItem(customKey);

        if (habits || customs) {
          totalDays++;
          const habitTasks = habits ? JSON.parse(habits).length : 0;
          const customTasks = customs ? JSON.parse(customs).length : 0;
          totalCompleted += habitTasks + customTasks;

          const allScheduleTasks = [
            ...scheduleData.weekday,
            ...scheduleData.weekend,
          ].flatMap((s) => s.tasks).length;
          totalTasks += allScheduleTasks;
        }
      }

      setStats({
        totalDays,
        totalTasks: totalCompleted,
        avgCompletion:
          totalDays > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0,
      });

      // Calculate last 7 days (today first)
      const sevenDays = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = getLocalDateString(date);

        const habitKey = `studyHabits_${dateString}`;
        const habits = localStorage.getItem(habitKey);
        const completed = habits ? JSON.parse(habits).length : 0;

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const totalForDay = (
          isWeekend ? scheduleData.weekend : scheduleData.weekday
        ).flatMap((s) => s.tasks).length;
        const percentage =
          totalForDay > 0 ? Math.round((completed / totalForDay) * 100) : 0;

        sevenDays.push({
          date: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          completed,
          total: totalForDay,
          percentage,
        });
      }
      setLast7Days(sevenDays);

      // Calculate weekly stats (Sat-Fri)
      const weekly = [];
      const today = new Date();

      for (let weekNum = 0; weekNum < 4; weekNum++) {
        let weekCompleted = 0;
        let weekTotal = 0;
        const weekStart = new Date(today);

        // Find the most recent Saturday
        const currentDay = weekStart.getDay();
        const daysToSaturday = currentDay === 6 ? 0 : currentDay + 1;
        weekStart.setDate(weekStart.getDate() - daysToSaturday - weekNum * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + i);
          const dateString = getLocalDateString(date);

          const habits = localStorage.getItem(`studyHabits_${dateString}`);
          const completed = habits ? JSON.parse(habits).length : 0;

          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const totalForDay = (
            isWeekend ? scheduleData.weekend : scheduleData.weekday
          ).flatMap((s) => s.tasks).length;

          weekCompleted += completed;
          weekTotal += totalForDay;
        }

        const avgPercentage =
          weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

        weekly.push({
          weekLabel: `${weekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${weekEnd.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          completed: weekCompleted,
          total: weekTotal,
          percentage: avgPercentage,
        });
      }
      setWeeklyStats(weekly);
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <LiveClock />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Your Stats (Last 30 Days)
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalDays}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Days</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-600 mt-1">Tasks Done</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">
              {stats.avgCompletion}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Completion</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Last 7 Days Progress
          </h3>
        </div>
        <div className="space-y-3">
          {last7Days.map((day, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">
                {day.date}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gray-900 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                      style={{ width: `${day.percentage}%` }}
                    >
                      {day.percentage > 15 && (
                        <span className="text-xs font-bold text-white">
                          {day.percentage}%
                        </span>
                      )}
                    </div>
                    {day.percentage <= 15 && day.percentage > 0 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                        {day.percentage}%
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 w-20 text-right">
                    {day.completed}/{day.total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Weekly Average (Saturday - Friday)
          </h3>
        </div>
        <div className="space-y-3">
          {weeklyStats.map((week, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {week.weekLabel}
                </span>
                <span className="text-sm text-gray-500">
                  {week.completed}/{week.total}
                </span>
              </div>
              <div className="relative bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gray-900 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${week.percentage}%` }}
                >
                  {week.percentage > 15 && (
                    <span className="text-xs font-bold text-white">
                      {week.percentage}%
                    </span>
                  )}
                </div>
                {week.percentage <= 15 && week.percentage > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                    {week.percentage}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Week View Component ---
const WeekView = ({ currentDate, onDateSelect }) => {
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dateString = getLocalDateString(date);
      const habitKey = `studyHabits_${dateString}`;
      const customKey = `customTasks_${dateString}`;

      const habits = localStorage.getItem(habitKey);
      const customs = localStorage.getItem(customKey);
      const completed =
        (habits ? JSON.parse(habits).length : 0) +
        (customs ? JSON.parse(customs).length : 0);

      days.push({
        date,
        dateString,
        completed,
        isToday: dateString === getLocalDateString(new Date()),
        isSelected: dateString === getLocalDateString(currentDate),
      });
    }
    return days;
  }, [currentDate]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, idx) => (
          <button
            key={idx}
            onClick={() => onDateSelect(day.date)}
            className={`p-3 rounded-lg text-center transition-all min-w-[60px] ${
              day.isSelected
                ? "bg-gray-900 text-white"
                : day.isToday
                ? "bg-blue-50 text-blue-900 border-2 border-blue-300"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="text-xs font-medium mb-1 whitespace-nowrap">
              {day.date.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className="text-lg font-bold">{day.date.getDate()}</div>
            {day.completed > 0 && (
              <div className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Day Type Modal Component ---
const DayTypeModal = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Is University Open Today?
          </h2>
          <p className="text-gray-600">Choose your schedule type for today</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect("weekday")}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <BookOpen size={20} />
            Yes - Weekday Schedule
          </button>
          <button
            onClick={() => onSelect("weekend")}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            <X size={20} />
            No - Weekend Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Header Component ---
const Header = ({ view, currentView, setCurrentView }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="mb-8 sticky top-0 z-50 bg-gray-50 pb-4 pt-4 -mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Study Tracker
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} className="text-gray-500" />
            <span className="text-lg font-semibold font-mono">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {["schedule", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentView(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              currentView === tab
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};

// --- DateControl Component ---
const DateControl = ({ selectedDate, onDateChange }) => {
  const isToday =
    getLocalDateString(selectedDate) === getLocalDateString(new Date());

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={() => onDateChange(-1)}
        className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex flex-col items-center min-w-[200px]">
        <span className="text-xl font-semibold text-gray-900">
          {formatDateHeader(selectedDate)}
        </span>
        {!isToday && (
          <button
            onClick={() => onDateChange("today")}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-1"
          >
            Jump to Today
          </button>
        )}
      </div>
      <button
        onClick={() => onDateChange(1)}
        className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// --- ProgressBar Component ---
const ProgressBar = ({ schedule, completedTasks, customTasksCount }) => {
  const totalTasks = useMemo(() => {
    return (
      schedule.reduce((acc, session) => acc + session.tasks.length, 0) +
      customTasksCount
    );
  }, [schedule, customTasksCount]);

  const completedCount = useMemo(() => {
    return Array.from(completedTasks).length;
  }, [completedTasks]);

  const percentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-900">
          Daily Progress
        </span>
        <span className="text-sm font-medium text-gray-500">
          {completedCount} / {totalTasks}
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gray-900 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-xs font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {percentage <= 10 && percentage > 0 && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

// --- Helper to check if current time is within a time range ---
const isCurrentSession = (timeString) => {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Try to match format: "5:00 - 5:25 AM" or "5:00 AM - 5:25 AM" or "9:00 - 1:00 PM"
    const match = timeString.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );
    if (!match) {
      console.log("❌ No regex match for:", timeString);
      return false;
    }

    let startHour = parseInt(match[1]);
    const startMin = parseInt(match[2]);
    let endHour = parseInt(match[4]);
    const endMin = parseInt(match[5]);
    const endPeriod = match[6].toUpperCase();

    // Determine start period
    let startPeriod;
    if (match[3]) {
      // Explicit AM/PM on start time
      startPeriod = match[3].toUpperCase();
    } else {
      // No AM/PM on start time - infer it logically
      // If end is PM and start hour > end hour, start is likely AM (e.g., "9:00 - 1:00 PM" = 9 AM to 1 PM)
      // If end is AM or start hour <= end hour with same period, use end period
      if (endPeriod === "PM" && startHour > endHour) {
        startPeriod = "AM";
      } else {
        startPeriod = endPeriod;
      }
    }

    // Convert start time to 24-hour format
    if (startPeriod === "PM" && startHour !== 12) startHour += 12;
    if (startPeriod === "AM" && startHour === 12) startHour = 0;

    // Convert end time to 24-hour format
    if (endPeriod === "PM" && endHour !== 12) endHour += 12;
    if (endPeriod === "AM" && endHour === 12) endHour = 0;

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const isMatch =
      currentMinutes >= startMinutes && currentMinutes < endMinutes;

    // Debug logging - only log matches to reduce noise
    if (isMatch) {
      console.log(
        "✅ MATCH!",
        timeString,
        `| Current: ${currentMinutes}min (${now.getHours()}:${String(
          now.getMinutes()
        ).padStart(2, "0")})`,
        `| Range: ${startMinutes}-${endMinutes}min`
      );
    }

    return isMatch;
  } catch (error) {
    console.error("❌ Error in isCurrentSession:", error, "for", timeString);
    return false;
  }
};

// --- TaskItem Component ---
const TaskItem = forwardRef(
  (
    { task, isCompleted, onToggle, isEditing, onEdit, onEditTask, isCurrent },
    ref
  ) => {
    const { id, time, description } = task;
    const [editTime, setEditTime] = useState(time);
    const [editDesc, setEditDesc] = useState(description);

    const handleSave = () => {
      onEdit(id, editTime, editDesc);
    };

    if (isEditing) {
      return (
        <li className="flex items-center gap-3 px-6 py-4 bg-blue-50 border-l-4 border-blue-500">
          <input
            type="text"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            className="text-sm font-mono text-gray-700 w-44 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5:00 - 5:25 AM"
          />
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="flex-1 text-sm text-gray-900 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        onClick={() => (onEditTask ? onEditTask(id) : onToggle(id))}
        className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 group ${
          isCurrent ? "bg-amber-50 border-l-4 border-amber-500" : ""
        }`}
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex="0"
        onKeyPress={(e) =>
          (e.key === "Enter" || e.key === " ") &&
          (onEditTask ? onEditTask(id) : onToggle(id))
        }
      >
        <div
          data-checked={isCompleted}
          className="w-5 h-5 rounded border border-gray-300 bg-white flex-shrink-0 flex items-center justify-center transition-all data-[checked=true]:bg-gray-900 data-[checked=true]:border-gray-900 group-hover:border-gray-400"
        >
          {isCompleted && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
        </div>
        <span
          className={`text-sm font-mono w-28 sm:w-32 flex-shrink-0 ${
            isCurrent ? "text-amber-700 font-semibold" : "text-gray-500"
          }`}
        >
          {time}
        </span>
        <span
          data-checked={isCompleted}
          className={`text-base transition-colors data-[checked=true]:line-through data-[checked=true]:text-gray-400 ${
            isCurrent ? "text-gray-900 font-semibold" : "text-gray-900"
          }`}
        >
          {description}
        </span>
        {isCurrent && (
          <span className="ml-auto px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </li>
    );
  }
);

TaskItem.displayName = "TaskItem";

// --- ScheduleView Component ---
const ScheduleView = ({
  schedule,
  completedTasks,
  onToggleTask,
  editMode,
  editingTaskId,
  onEditTask,
  onSaveEdit,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentSessionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to current session on mount and when schedule changes
  useEffect(() => {
    if (currentSessionRef.current) {
      currentSessionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [schedule, currentTime]); // Add currentTime as dependency to update highlight

  return (
    <div className="space-y-6">
      {schedule.map((session) => (
        <section
          key={session.title}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <h2 className="bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-900 border-b border-gray-100 uppercase tracking-wider">
            {session.title}
          </h2>
          <ul className="divide-y divide-gray-100">
            {session.tasks.map((task) => {
              // Recalculate isCurrent on every render (which happens when currentTime updates)
              const isCurrent = isCurrentSession(task.time);
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  isCompleted={completedTasks.has(task.id)}
                  onToggle={onToggleTask}
                  onEditTask={editMode ? onEditTask : null}
                  isEditing={editMode && editingTaskId === task.id}
                  onEdit={onSaveEdit}
                  isCurrent={isCurrent}
                  ref={isCurrent ? currentSessionRef : null}
                />
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState("weekday");
  const [currentView, setCurrentView] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [customTasksCount, setCustomTasksCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [customSchedule, setCustomSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dayTypeSelected, setDayTypeSelected] = useState(false);
  const [currentDateKey, setCurrentDateKey] = useState(
    getLocalDateString(new Date())
  );

  // Check if modal should be shown (Sun-Thu only, once per day)
  // Also check periodically if date has changed
  useEffect(() => {
    const checkDayType = () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      const dateKey = getLocalDateString(today);

      // If date changed, reset the selection
      if (dateKey !== currentDateKey) {
        setCurrentDateKey(dateKey);
        setDayTypeSelected(false);
        setShowModal(false);
      }

      const storageKey = `dayType_${dateKey}`;
      const savedDayType = localStorage.getItem(storageKey);

      // Show modal only on Sun-Thu (0-4) and if not already answered today
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        if (savedDayType) {
          // Load saved preference
          setView(savedDayType);
          setDayTypeSelected(true);
        } else if (!dayTypeSelected) {
          // Show modal to ask (only if not already selected in this session)
          setShowModal(true);
        }
      } else {
        // Friday (5) or Saturday (6) - auto set to weekend
        setView("weekend");
        setDayTypeSelected(true);
      }
    };

    // Check immediately on mount
    checkDayType();

    // Check every minute for date changes
    const interval = setInterval(checkDayType, 60000);

    return () => clearInterval(interval);
  }, [currentDateKey, dayTypeSelected]);

  const handleDayTypeSelect = (type) => {
    const dateKey = getLocalDateString(new Date());
    const storageKey = `dayType_${dateKey}`;
    localStorage.setItem(storageKey, type);
    setView(type);
    setShowModal(false);
    setDayTypeSelected(true);
  };

  // Load custom schedule from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("customSchedule");
      if (saved) {
        setCustomSchedule(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading custom schedule:", error);
    }
  }, []);

  useEffect(() => {
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const dateString = getLocalDateString(selectedDate);
    const habitKey = `studyHabits_${dateString}`;
    const customKey = `customTasks_${dateString}`;

    try {
      const habits = localStorage.getItem(habitKey);
      const customs = localStorage.getItem(customKey);

      const allCompleted = new Set();
      if (habits) {
        JSON.parse(habits).forEach((id) => allCompleted.add(id));
      }
      if (customs) {
        const customTasks = JSON.parse(customs);
        setCustomTasksCount(customTasks.length);
      } else {
        setCustomTasksCount(0);
      }

      setCompletedTasks(allCompleted);
    } catch (error) {
      console.error("Error loading data:", error);
      setCompletedTasks(new Set());
      setCustomTasksCount(0);
    }
  }, [selectedDate]);

  const handleToggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }

    setCompletedTasks(newCompleted);

    const dateString = getLocalDateString(selectedDate);
    const storageKey = `studyHabits_${dateString}`;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(newCompleted))
      );
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDateChange = (days) => {
    if (days === "today") {
      setSelectedDate(new Date());
      return;
    }
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleSaveEdit = (taskId, newTime, newDesc) => {
    // Deep clone the schedule to avoid mutation
    const baseSchedule = customSchedule || scheduleData;
    const updatedSchedule = {
      weekday: baseSchedule.weekday.map((session) => ({
        ...session,
        tasks: session.tasks.map((task) => ({ ...task })),
      })),
      weekend: baseSchedule.weekend.map((session) => ({
        ...session,
        tasks: session.tasks.map((task) => ({ ...task })),
      })),
    };

    // Find and update the task
    for (let section of updatedSchedule[view]) {
      const taskIndex = section.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        section.tasks[taskIndex] = {
          ...section.tasks[taskIndex],
          time: newTime,
          description: newDesc,
        };
        break;
      }
    }

    setCustomSchedule(updatedSchedule);
    localStorage.setItem("customSchedule", JSON.stringify(updatedSchedule));
    setEditingTaskId(null);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditingTaskId(null);
  };

  const resetToDefault = () => {
    if (
      window.confirm(
        "Reset schedule to default? This will clear all your customizations."
      )
    ) {
      setCustomSchedule(null);
      localStorage.removeItem("customSchedule");
      setEditMode(false);
      setEditingTaskId(null);
    }
  };

  const currentSchedule = customSchedule
    ? customSchedule[view]
    : scheduleData[view];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <DayTypeModal isOpen={showModal} onSelect={handleDayTypeSelect} />
      <div className="max-w-5xl mx-auto">
        <Header
          view={view}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {currentView === "schedule" && (
          <>
            <DateControl
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleEditMode}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        editMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {editMode ? "✓ Done Editing" : "✏️ Edit Schedule"}
                    </button>
                    {customSchedule && (
                      <button
                        onClick={resetToDefault}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                  {editMode && (
                    <span className="text-sm text-gray-500 italic">
                      Click any task to edit
                    </span>
                  )}
                </div>
                <ProgressBar
                  schedule={currentSchedule}
                  completedTasks={completedTasks}
                  customTasksCount={customTasksCount}
                />
                <ScheduleView
                  schedule={currentSchedule}
                  completedTasks={completedTasks}
                  onToggleTask={handleToggleTask}
                  editMode={editMode}
                  editingTaskId={editingTaskId}
                  onEditTask={handleEditTask}
                  onSaveEdit={handleSaveEdit}
                />
              </div>

              <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit lg:self-start">
                <PomodoroTimer />
                <WeekView
                  currentDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </aside>
            </div>
          </>
        )}

        {currentView === "stats" && (
          <div className="max-w-3xl mx-auto">
            <StatsView />
          </div>
        )}
      </div>
    </div>
  );
}
