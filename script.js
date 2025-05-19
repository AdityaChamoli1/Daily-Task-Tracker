const taskList = [
  { name: "🌅 Wake up early", time: "06:00" },
  { name: "💪 Workout", time: "07:00" },
  { name: "📚 Study 2 hours", time: "10:00" },
  { name: "🧘‍♂️ Meditation", time: "18:00" },
  { name: "🌙 Sleep on time", time: "22:00" }
];

const todayKey = new Date().toISOString().slice(0, 10);
const savedData = JSON.parse(localStorage.getItem(todayKey)) || {};
const tasksContainer = document.getElementById("tasks");
const progress = document.getElementById("progress");
const currentDateSpan = document.getElementById("currentDate");
currentDateSpan.textContent = todayKey;

function updateProgressBar() {
  const total = taskList.length;
  let done = 0;
  taskList.forEach((t, i) => {
    if (document.getElementById(`check-${i}`).checked) done++;
  });
  const percent = Math.round((done / total) * 100);
  progress.style.width = percent + "%";
  progress.textContent = percent + "% ✅";
}

function saveData() {
  const taskData = {};
  taskList.forEach((task, i) => {
    taskData[task.name] = {
      done: document.getElementById(`check-${i}`).checked,
      note: document.getElementById(`note-${i}`).value
    };
  });
  localStorage.setItem(todayKey, JSON.stringify(taskData));
}

function createTasks() {
  taskList.forEach((task, i) => {
    const row = document.createElement("tr");

    // Task Name
    const name = document.createElement("td");
    name.textContent = task.name;
    row.appendChild(name);

    // Time
    const time = document.createElement("td");
    time.textContent = task.time;
    row.appendChild(time);

    // Status (checkbox)
    const status = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check-${i}`;

    const taskTime = new Date();
    const [h, m] = task.time.split(":");
    taskTime.setHours(h, m, 0);
    const now = new Date();

    if (now > taskTime && !(savedData[task.name]?.done)) {
      checkbox.disabled = true;
      checkbox.title = "Time expired ⏳";
    }
    if (savedData[task.name]?.done) checkbox.checked = true;

    checkbox.onchange = () => {
      updateProgressBar();
      saveData();
    };
    row.appendChild(status).appendChild(checkbox);

    // Note
    const note = document.createElement("td");
    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.id = `note-${i}`;
    noteInput.value = savedData[task.name]?.note || "";
    noteInput.oninput = saveData;
    note.appendChild(noteInput);
    row.appendChild(note);

    // Reminder
    const reminder = document.createElement("td");
    const remindBtn = document.createElement("button");
    remindBtn.textContent = "⏰ Set";
    remindBtn.onclick = () => {
      const msUntil = taskTime.getTime() - now.getTime();
      if (msUntil > 0) {
        alert(`Reminder set for "${task.name}" in ${(msUntil / 60000).toFixed(0)} minutes`);
        setTimeout(() => {
          alert(`🔔 Reminder: ${task.name}`);
        }, msUntil);
      } else {
        alert("⏳ Time already passed!");
      }
    };
    reminder.appendChild(remindBtn);
    row.appendChild(reminder);

    tasksContainer.appendChild(row);
  });

  updateProgressBar();
}

function loadHistory() {
  const historyDiv = document.getElementById("history");
  for (let key in localStorage) {
    if (key === todayKey) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      const section = document.createElement("div");
      section.innerHTML = `<h4>📅 ${key}</h4>`;
      const ul = document.createElement("ul");
      for (let task in data) {
        const li = document.createElement("li");
        li.textContent = `${task} — ${data[task].done ? "✅ Done" : "❌ Missed"} — 📝 ${data[task].note || "No note"}`;
        ul.appendChild(li);
      }
      section.appendChild(ul);
      historyDiv.appendChild(section);
    } catch {}
  }
}

createTasks();
loadHistory();
