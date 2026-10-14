import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-todo-tasks")) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("my-todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (editId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, text: input.trim() }
            : task
        )
      );

      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: input.trim(),
          completed: false,
        },
      ]);
    }

    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  };

  const editTask = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app">
      <header className="topbar">
        <a href="#" className="logo">
          <span className="logo-icon">✓</span>
          TaskBloom
        </a>

        <span className="topbar-label">
          ✨ Make today count
        </span>
      </header>

      <main className="main-container">
        <section className="welcome-section">
          <div className="welcome-text">
            <span className="eyebrow">YOUR PERSONAL SPACE</span>

            <h1>
              Small steps,
              <br />
              <span>big achievements.</span>
            </h1>

            <p>
              Organize your day, focus on what matters,
              and celebrate every little win.
            </p>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              <span>🌷</span>
              <span className="floating-star star-one">✦</span>
              <span className="floating-star star-two">✧</span>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple-icon">▤</div>
            <div>
              <p>Total Tasks</p>
              <h2>{tasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pink-icon">◷</div>
            <div>
              <p>Pending</p>
              <h2>{pendingCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green-icon">✓</div>
            <div>
              <p>Completed</p>
              <h2>{completedCount}</h2>
            </div>
          </div>
        </section>

        <section className="todo-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LET'S GET THINGS DONE</span>
              <h2>My Tasks <span>✿</span></h2>
            </div>

            {tasks.length > 0 && (
              <button
                className="clear-button"
                onClick={clearCompleted}
                disabled={completedCount === 0}
              >
                Clear completed
              </button>
            )}
          </div>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="What would you like to do today?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Task name"
            />

            <button type="submit" className="add-button">
              {editId !== null ? "Save Task" : "+ Add Task"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setEditId(null);
                  setInput("");
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="filter-tabs">
            {["All", "Pending", "Completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item}
                {item === "All" && (
                  <span className="filter-count">{tasks.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filter === "Completed" ? "🌸" : "📝"}
                </div>

                <h3>
                  {filter === "All"
                    ? "Your space is waiting!"
                    : filter === "Pending"
                    ? "All caught up!"
                    : "No completed tasks yet"}
                </h3>

                <p>
                  {filter === "All"
                    ? "Add your first task and make today productive."
                    : filter === "Pending"
                    ? "You've finished all your tasks. Well done!"
                    : "Complete a task and it will appear here."}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className={`task-item ${
                    task.completed ? "task-completed" : ""
                  }`}
                  key={task.id}
                >
                  <button
                    className={`checkbox ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task completion"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <span className="task-text">{task.text}</span>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() => editTask(task)}
                      aria-label="Edit task"
                      title="Edit task"
                    >
                      ✎
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card-footer">
            <span>
              ✨ {pendingCount} {pendingCount === 1 ? "task" : "tasks"} left
              to complete
            </span>

            <span>One step at a time 💜</span>
          </div>
        </section>

        <footer className="page-footer">
          Made with <span>♥</span> and a little lavender magic
        </footer>
      </main>
    </div>
  );
}

export default App;