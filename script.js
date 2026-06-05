// ── DOM refs ──
const addBtn           = document.getElementById("addBtn");
const searchBtn        = document.getElementById("searchBtn");
const inputBox         = document.getElementById("inputBox");
const taskContainer    = document.getElementById("taskContainer");
const purple           = document.querySelector(".purple");
const yellow           = document.querySelector(".yellow");
const card             = document.querySelector(".card");
const bg               = document.querySelector("body");

// Alert
const customAlert  = document.getElementById("customAlert");
const alertMSG     = document.getElementById("alertMSG");
const alertBtn     = document.getElementById("alertBtn");

// Confirm
const customConfirm = document.getElementById("customConfirm");
const confirmMSG    = document.getElementById("confirmMSG");
const yesBtn        = document.getElementById("yesBtn");
const noBtn         = document.getElementById("noBtn");

// Edit modal
const editCategory = document.getElementById("editCategory");
const editDueDate  = document.getElementById("editDueDate");
const editModal     = document.getElementById("editModal");
const editInput     = document.getElementById("editInput");
const saveEditBtn   = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Add modal
const addModal      = document.getElementById("addModal");
const newTaskName   = document.getElementById("newTaskName");
const newTaskCat    = document.getElementById("newTaskCategory");
const newTaskDate   = document.getElementById("newTaskDueDate");
const saveAddBtn    = document.getElementById("saveAddBtn");
const cancelAddBtn  = document.getElementById("cancelAddBtn");

// View modal
const viewModal         = document.getElementById("viewModal");
const viewTaskName      = document.getElementById("viewTaskName");
const viewTaskCategory  = document.getElementById("viewTaskCategory");
const viewTaskDueDate   = document.getElementById("viewTaskDueDate");
const viewTaskPriority  = document.getElementById("viewTaskPriority");
const closeViewBtn      = document.getElementById("closeViewBtn");

// ── Helpers ──
function showAlert(message) {
    alertMSG.textContent = message;
    customAlert.style.display = "flex";
}

alertBtn.addEventListener("click", () => { customAlert.style.display = "none"; });

function showConfirm(message, callback) {
    confirmMSG.textContent = message;
    customConfirm.style.display = "flex";
    yesBtn.onclick = () => { customConfirm.style.display = "none"; callback(true); };
    noBtn.onclick  = () => { customConfirm.style.display = "none"; callback(false); };
}

function updateTaskCounter() {
    const total = document.querySelectorAll(".task-item").length;
    document.getElementById("taskCounter").textContent = `Tasks: ${total}`;
}

function getPriority() {
    return document.querySelector('input[name="priority"]:checked')?.value || "medium";
}

// ── Persist ──
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach(item => {
        tasks.push({
            text:     item.dataset.text,
            category: item.dataset.category,
            dueDate:  item.dataset.dueDate,
            priority: item.dataset.priority,
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ── Create task DOM ──
function createTask(taskData) {
    const { text, category = "", dueDate = "", priority = "medium" } = taskData;

    const taskRow = document.createElement("div");
    taskRow.classList.add("task-item");
    taskRow.dataset.text     = text;
    taskRow.dataset.category = category;
    taskRow.dataset.dueDate  = dueDate;
    taskRow.dataset.priority = priority;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Priority dot
    const dot = document.createElement("span");
    dot.classList.add("priorityDot", priority);

    // Meta block
    const meta = document.createElement("div");
    meta.classList.add("task-meta");

    const nameEl = document.createElement("div");
    nameEl.classList.add("task-name");
    nameEl.textContent = text;

    const subEl = document.createElement("div");
    subEl.classList.add("task-sub");
    if (category) subEl.innerHTML += `<span><i class="fa-solid fa-tag"></i> ${category}</span>`;
    if (dueDate)  subEl.innerHTML += `<span><i class="fa-solid fa-calendar-days"></i> ${formatDate(dueDate)}</span>`;

    meta.appendChild(nameEl);
    meta.appendChild(subEl);

    // Deadline badge
if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        const badge = document.createElement("span");
        badge.classList.add("deadlineBadge");
        badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Due Tomorrow';
        nameEl.appendChild(badge);
    } else if (diffDays === 0) {
        const badge = document.createElement("span");
        badge.classList.add("deadlineBadge", "deadlineToday");
        badge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Due Today';
        nameEl.appendChild(badge);
    } else if (diffDays < 0) {
        const badge = document.createElement("span");
        badge.classList.add("deadlineBadge", "deadlineOverdue");
        badge.innerHTML = '<i class="fa-solid fa-skull"></i> Overdue';
        nameEl.appendChild(badge);
    }
}

    // View button
    const viewBtn = document.createElement("button");
    viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    viewBtn.classList.add("viewBtn");
    viewBtn.title = "View details";
    viewBtn.addEventListener("click", () => showViewModal(taskRow.dataset));

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.classList.add("editBtn");
    editBtn.title = "Edit task";
    editBtn.addEventListener("click", () => {
        showEditModal(taskRow.dataset, (updated) => {
        taskRow.dataset.text     = updated.text;
        taskRow.dataset.category = updated.category;
        taskRow.dataset.dueDate  = updated.dueDate;
        taskRow.dataset.priority = updated.priority;

        nameEl.textContent = updated.text;

        // Refresh the subtitle line
        subEl.innerHTML = "";
        if (updated.category) subEl.innerHTML += `<span><i class="fa-solid fa-tag"></i> ${updated.category}</span>`;
        if (updated.dueDate)  subEl.innerHTML += `<span><i class="fa-solid fa-calendar-days"></i> ${formatDate(updated.dueDate)}</span>`;

        // Refresh the priority dot
        dot.className = `priorityDot ${updated.priority}`;

        saveTasks();
    });
});

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", () => {
        showConfirm("Delete this task?", (answer) => {
            if (answer) { taskRow.remove(); saveTasks(); updateTaskCounter(); }
        });
    });

    // Checkbox done
    checkbox.addEventListener("change", () => {
        showConfirm("Are you done with this task?", (answer) => {
            if (answer) { taskRow.remove(); saveTasks(); updateTaskCounter(); }
            else        { checkbox.checked = false; }
        });
    });

    taskRow.appendChild(checkbox);
    taskRow.appendChild(dot);
    taskRow.appendChild(meta);
    taskRow.appendChild(viewBtn);
    taskRow.appendChild(editBtn);
    taskRow.appendChild(deleteBtn);
    taskContainer.appendChild(taskRow);

    updateTaskCounter();
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${m}/${d}/${y}`;
}

// ── ADD Modal ──
addBtn.addEventListener("click", () => {
    newTaskName.value = "";
    newTaskCat.value  = "";
    newTaskDate.value = "";
    document.querySelector('input[name="priority"][value="medium"]').checked = true;
    addModal.style.display = "flex";
    setTimeout(() => newTaskName.focus(), 50);
});

cancelAddBtn.addEventListener("click", () => { addModal.style.display = "none"; });

saveAddBtn.addEventListener("click", () => {
    const text = newTaskName.value.trim();
    if (!text) { showAlert("Enter a task name love love!"); return; }
    const taskData = {
        text,
        category: newTaskCat.value.trim(),
        dueDate:  newTaskDate.value,
        priority: getPriority(),
    };
    createTask(taskData);
    saveTasks();
    addModal.style.display = "none";
});

newTaskName.addEventListener("keydown", e => { if (e.key === "Enter") saveAddBtn.click(); });

// ── SEARCH ──
function runSearch() {
    const query = inputBox.value.trim().toLowerCase();
    const items = document.querySelectorAll(".task-item");
    let found = 0;
    items.forEach(item => {
        const name     = (item.dataset.text     || "").toLowerCase();
        const category = (item.dataset.category || "").toLowerCase();
        const matches  = !query || name.includes(query) || category.includes(query);
        item.style.display = matches ? "flex" : "none";
        if (matches) found++;
    });

    // Show/hide no-results message
    let noResults = taskContainer.querySelector(".noResults");
    if (!noResults) {
        noResults = document.createElement("p");
        noResults.classList.add("noResults");
        noResults.textContent = "No matching tasks found.";
        taskContainer.appendChild(noResults);
    }
    noResults.style.display = (found === 0 && query) ? "block" : "none";
}

searchBtn.addEventListener("click", runSearch);
inputBox.addEventListener("keydown", e => { if (e.key === "Enter") runSearch(); });
// Live search on clear
inputBox.addEventListener("input", () => { if (inputBox.value === "") runSearch(); });

// ── EDIT Modal ──
function showEditModal(data, callback) {
    editInput.value = data.text || "";
    editCategory.value = data.category || "";
    editDueDate.value = data.dueDate || "";
    const savedPriority = data.priority || "medium";
    const radioToCheck = document.querySelector(`input[name="editPriority"][value="${savedPriority}"]`);
    if (radioToCheck) radioToCheck.checked = true;

    editModal.style.display = "flex";
    setTimeout(() => editInput.focus(), 50);

    saveEditBtn.onclick = () => {
        const newText = editInput.value.trim();
        if(!newText) { showAlert("Task name can't be empty!"); return;}
        editModal.style.display = "none";
        callback({
            text: newText,
            category: editCategory.value.trim(),
            dueDate: editDueDate.value,
            priority: document.querySelector('input[name="editPriority"]:checked')?.value || "medium",

        });
    };
    cancelEditBtn.onclick = () => {editModal.style.display = "none"; };
}

editInput.addEventListener("keydown", e => { if (e.key === "Enter") saveEditBtn.click(); });

// ── VIEW Modal ──
function showViewModal(data) {
    viewTaskName.textContent     = data.text     || "—";
    viewTaskCategory.textContent = data.category || "—";
    viewTaskDueDate.textContent  = data.dueDate  ? formatDate(data.dueDate) : "—";

    const p = data.priority || "medium";
    viewTaskPriority.innerHTML = `<span class="viewPriorityBadge ${p}">${capitalize(p)}</span>`;

    viewModal.style.display = "flex";
}

closeViewBtn.addEventListener("click", () => { viewModal.style.display = "none"; });

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ── LOAD / SAVE ──
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
    updateTaskCounter();
}

// ── THEMES ──
function applyYellow() {
    document.documentElement.style.setProperty('--card-bg',        '#fff6d1');
    document.documentElement.style.setProperty('--body-bg',        '#fddb6d');
    document.documentElement.style.setProperty('--add-btn-bg',     '#ffc800');
    document.documentElement.style.setProperty('--add-btn-hover',  'rgb(213,143,3)');
    document.documentElement.style.setProperty('--checkbox-color', '#e6a800');
    document.documentElement.style.setProperty('--primary-color',  '#ffc800');
    document.documentElement.style.setProperty('--primary-hover',  'rgb(213,143,3)');
    document.documentElement.style.setProperty('--badge-color',    'rgb(213,143,3)');
    document.documentElement.style.setProperty('--search-glow',    'rgba(255,204,0,0.25)');
    card.style.backgroundColor = '#fff6d1';
    bg.style.backgroundColor   = '#fddb6d';
    localStorage.setItem("theme", "yellow");
}

function applyPurple() {
    document.documentElement.style.setProperty('--card-bg',        'rgb(225,225,225)');
    document.documentElement.style.setProperty('--body-bg',        'rgb(176,176,176)');
    document.documentElement.style.setProperty('--add-btn-bg',     'rgb(169,78,255)');
    document.documentElement.style.setProperty('--add-btn-hover',  'rgb(101,36,161)');
    document.documentElement.style.setProperty('--checkbox-color', 'blueviolet');
    document.documentElement.style.setProperty('--primary-color',  'blueviolet');
    document.documentElement.style.setProperty('--primary-hover',  'rgb(101,36,161)');
    document.documentElement.style.setProperty('--badge-color',    'blueviolet');
    document.documentElement.style.setProperty('--search-glow',    'rgb(129 140 248 / 30%)');
    card.style.backgroundColor = 'rgb(225,225,225)';
    bg.style.backgroundColor   = 'rgb(176,176,176)';
    localStorage.setItem("theme", "purple");
}

yellow.addEventListener('click', applyYellow);
purple.addEventListener('click', applyPurple);

function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "yellow") applyYellow();
    if (saved === "purple") applyPurple();
}

loadTasks();
loadTheme();