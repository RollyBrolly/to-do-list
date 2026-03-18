const addBtn = document.getElementById("addBtn");
const inputBox = document.getElementById("inputBox");
const taskContainer = document.getElementById("taskContainer");
const purple = document.querySelector(".purple");
const yellow = document.querySelector(".yellow");
const card = document.querySelector(".card");
const bg = document.querySelector("body");
const customAlert = document.getElementById("customAlert");
const alertBox = document.getElementById("alertBox");
const alertMsg = document.getElementById("alertMSG");
const alertBtn = document.getElementById("alertBtn");
const customConfirm = document.getElementById("customConfirm");
const confirmMSG = document.getElementById("confirmMSG");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(checkbox => {
    const saved = localStorage.getItem(checkbox.id);
        if(saved =="true"){
            checkbox.checked = true;
        }
        
        //save state
        checkbox.addEventListener('change', () => {
            localStorage.setItem(checkbox.id, checkbox.checked);
        });
})

function saveTasks(){
    const tasks = [];

    document.querySelectorAll(".task-item label").forEach(label => {
        tasks.push(label.textContent);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showConfirm(message, callback){
    confirmMSG.textContent = message;
    customConfirm.style.display = "flex";

    yesBtn.onclick = () =>{
        customConfirm.style.display = "none";
        callback(true);
    };
    noBtn.onclick = () => {
        customConfirm.style.display = "none";
        callback(false);
    }

}

function showAlert(message){
    alertMSG.textContent = message;
    customAlert.style.display = "flex";
}

alertBtn.addEventListener("click", () => {
    customAlert.style.display = "none";
});

yellow.addEventListener('click', () => {
    card.style.backgroundColor = "#fff6d1";
    addBtn.style.backgroundColor = "#ffcc00";
    bg.style.backgroundColor = "#fddb6d";
    addBtn.onmouseover = () => addBtn.style.backgroundColor = "rgb(213, 143, 3)";
    addBtn.onmouseout = () => addBtn.style.backgroundColor = "#ffcc00";
    inputBox.onmouseover = () => {
        inputBox.style.borderColor = "#ffcc00";
        inputBox.style.boxShadow = "0 0 0 5px rgba(255, 204, 0, 0.3)";
    };
    inputBox.onmouseout = () => {
        inputBox.style.borderColor = "transparent";
        inputBox.style.boxShadow = "none";
    };
    inputBox.onfocus = () => {
        inputBox.style.borderColor = "#ffcc00";
        inputBox.style.boxShadow = "0 0 0 5px rgba(255, 204, 0, 0.3)";
    };
    inputBox.onblur = () => {
        inputBox.style.borderColor = "transparent";
        inputBox.style.boxShadow = "none";
    };
    document.documentElement.style.setProperty('--checkbox-color', '#ffcc00');
    document.documentElement.style.setProperty('--primary-color', '#ffcc00');
    document.documentElement.style.setProperty('--primary-hover', 'rgb(213, 143, 3)');  

    localStorage.setItem("theme", "yellow");
});

purple.addEventListener('click', () => {
    card.style.backgroundColor = "rgb(225, 225, 225)";
    addBtn.style.backgroundColor = "rgb(169, 78, 255)";
    bg.style.backgroundColor = "rgb(176, 176, 176)";
    addBtn.onmouseover = () => addBtn.style.backgroundColor = "rgb(101, 36, 161)";
    addBtn.onmouseout = () => addBtn.style.backgroundColor = "rgb(169, 78, 255)";
    inputBox.onmouseover = () => {
        inputBox.style.borderColor = "blueviolet";
        inputBox.style.boxShadow = "0 0 0 5px rgb(129 140 248 / 30%)";
    };
    inputBox.onmouseout = () => {
        inputBox.style.borderColor = "transparent";
        inputBox.style.boxShadow = "none";
    };
    inputBox.onfocus = () => {
        inputBox.style.borderColor = "blueviolet";
        inputBox.style.boxShadow = "0 0 0 5px rgb(129 140 248 / 30%)";
    };
    inputBox.onblur = () => {
        inputBox.style.borderColor = "transparent";
        inputBox.style.boxShadow = "none";
    };
    document.documentElement.style.setProperty('--checkbox-color', 'blueviolet');
    document.documentElement.style.setProperty('--primary-color', 'blueviolet');
    document.documentElement.style.setProperty('--primary-hover', 'rgb(101, 36, 161)');

    localStorage.setItem("theme", "purple");
});

inputBox.addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            addBtn.click();
        }
    });


addBtn.addEventListener('click', function () {
    const taskText = inputBox.value.trim();
    if (taskText === "") {
        showAlert("Write something first love :D");
        return;
    }

    const taskRow = document.createElement("div");
    taskRow.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("label");
    label.textContent = taskText;

    taskRow.appendChild(checkbox);
    taskRow.appendChild(label);
    taskContainer.appendChild(taskRow);
    inputBox.value = "";

    saveTasks();

checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
        setTimeout(() => {
            showConfirm("Are you done with this task?", (answer) =>{
                  if (answer) {
                taskRow.remove();
                saveTasks();
            } else {
                checkbox.checked = false;
            }
            });
        }, 200); 
    }
});


});
function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(taskText => {
        const taskRow = document.createElement("div");
        taskRow.classList.add("task-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const label = document.createElement("label");
        label.textContent = taskText;

        taskRow.appendChild(checkbox);
        taskRow.appendChild(label);
        taskContainer.appendChild(taskRow);

        checkbox.addEventListener("change", function (e) {
            e.preventDefault();
            showConfirm("Are you done with this task?", (answer) => {
                if (answer) {
                    taskRow.remove();
                    saveTasks();
                }
            });
        });
    });
}
loadTasks();

function loadTheme(){
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "yellow"){
        yellow.click();
    }

    if(savedTheme === "purple"){
        purple.click();
    }
}

loadTheme();

