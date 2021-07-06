var taskInput = null;
var addButton = null;
var incompleteTasksHolder = null;
var completedTasksHolder = null;

function callMeFirst()
{
  taskInput = document.getElementById("new-task");
  addButton = document.getElementById("add-button");
  incompleteTasksHolder = document.getElementById("incomplete-tasks");
  completedTasksHolder = document.getElementById("completed-tasks");

  //TODO:: Load from Task List in Local Storage & create User Interface using Handlebars

  try {
    var taskItems = localStorage.getItem("TaskItems");
    if (taskItems != null && taskItems != undefined && taskItems.length > 0) {
      var taskItemsJSONObj = JSON.parse(taskItems);

      for (var ijk = 0; ijk < taskItemsJSONObj.length; ijk++) {
        var taskItemObj = taskItemsJSONObj[ijk];

        var createdListItem = createNewTaskElement(taskItemObj.TaskName, [taskItemObj.TaskEditMode, taskItemObj.Selected]);
        if (taskItemObj.TaskEditMode === 1) {
          createdListItem.classList.add("editMode");
          var editButton = listItem.getElementsByTagName("button")[0];
          editButton.innerText = "Save";
        }
        console.log("taskItemObj TaskStatus :: "+taskItemObj.TaskStatus);
        if (taskItemObj.TaskStatus === 1) {
          completedTasksHolder.appendChild(createdListItem);
          bindTaskEvents(listItem, taskIncomplete);
        }
        else {
          console.log(" I am here :: "+ijk + " :: "+ taskItemObj.TaskName);
          incompleteTasksHolder.appendChild(createdListItem);
          bindTaskEvents(listItem, taskCompleted);
        }
      }
    }
  } catch(err) {
    console.log("Error while fetching localStorage Item & Parsing")
  }

  /* Incomplete Tasks * /
              <li>
                  <input type="checkbox">
                  <label class="task-label" >Pay Bills</label>
                  <input type="text">
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
              <li class="editMode">
                  <input type="checkbox">
                  <label class="task-label">Go Shopping</label>
                  <input type="text" value="Go Shopping">
                  <button class="edit">Save</button>
                  <button class="delete">Delete</button>
              </li>
  /* */
  /* Completed Tasks * /
              <li>
                  <input type="checkbox" checked>
                  <label class="task-label">See the Doctor</label>
                  <input type="text">
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
              </li>
  /* */
  
  addButton.addEventListener("click", addTask);

  bindTaskHolderChildrenEvents();

  setInterval(function(){
    saveAll("Auto Save");
  }, 30000);
}

function bindTaskHolderChildrenEvents() {
  if (incompleteTasksHolder === null || completedTasksHolder === null)  {
    return;
  }
  if (incompleteTasksHolder.children.length === 0) {
    return;
  }

  for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  if (completedTasksHolder.children.length === 0) {
    return;
  }
  
  for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }  
}

var createNewTaskElement = function(taskString, arr) {
  listItem = document.createElement("li");
  checkBox = document.createElement("input");
  label = document.createElement("label");
  editInput = document.createElement("input");
  editButton = document.createElement("button");
  deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  if (arr != null && arr != undefined && arr.length > 0) {
    checkBox.checked = (arr[1] == 1) ? true : false;
  }
  editInput.type = "text";
  editInput.value = taskString;
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;
  label.classList.add("task-label");

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

var addTask = function () {
  if (taskInput.value === "") {
    console.log("Trying to add Task with Empty Name");
    //TODO:: push error message in ui
    return;
  }
  var listItemName = taskInput.value || "New Item";
  listItem = createNewTaskElement(listItemName);
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = "";

  saveAll("AddTask");
};

var editTask = function () {
  var listItem = this.parentNode;
  var editInput = listItem.querySelectorAll("input[type=text")[0];
  if (editInput.value === "") {
    console.log("Trying to edit Task with Empty Name");
    //TODO:: push error message in ui
    return;
  }

  var label = listItem.querySelector("label");
  var button = listItem.getElementsByTagName("button")[0];

  var containsClass = (listItem.classList != undefined && listItem.classList.contains("editMode"));
  if (containsClass) {
      label.innerText = editInput.value;
      button.innerText = "Edit";
  } else {
     editInput.value = label.innerText;
     button.innerText = "Save";
  }
  
  listItem.classList.toggle("editMode");
  
  //TODO:: Update Local Storage with newer value;
  saveAll("Edit/SaveTask");
};

var deleteTask = function (el) {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;

  //TODO:: Remove List Item from Local Storage

  ul.removeChild(listItem);
  saveAll("DeleteTask");
};

var taskCompleted = function (el) {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);

  //TODO:: Update Task List Item Status in Local Storage
  saveAll("TaskComplete");
  bindTaskEvents(listItem, taskIncomplete);
};

var taskIncomplete = function() {
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);

  //TODO:: Update Task List Item Status in Local Storage
  saveAll("TaskIncomplete");
  bindTaskEvents(listItem, taskCompleted);
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
  var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  var editButton = taskListItem.querySelectorAll("button.edit")[0];
  var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

function saveAll(fromWhere)
{
  console.log("Called From :: "+fromWhere + " :: "+ new Date().toTimeString());

  var allTasks = [];

  var incompleteTaskElements = document.getElementById("incomplete-tasks");
  //console.log("incompleteTaskElements :: "+incompleteTaskElements);
  var incompleteChilds = incompleteTaskElements.children;
  //var incompleteChildNodes = incompleteTaskElements.childNodes;

  for (var i = 0; i < incompleteChilds.length; i++) {

    var childTask = incompleteChilds[i];
    //var incompleteChildTaskNode = incompleteChildNodes[i];

    //console.log("The values :: "+childTask + " :: " + incompleteChildTaskNode);

    var onEditMode = false;
    if (childTask.classList != undefined && childTask.classList.contains("editMode")) {
      onEditMode = true;
    }
    var nameValue = childTask.getElementsByTagName("label")[0].innerText;
    //console.log("The Task Name Value :: "+nameValue);
    var editModeValue = 0;
    if (onEditMode) {
      //console.log("I came here::: "+nameValue);
      nameValue = childTask.querySelectorAll("input[type=text]")[0].value;
      editModeValue = 1;
    }
    var selectedValue = 0;
    var selectedValueCB = childTask.querySelectorAll("input[type=checkbox]")[0].checked;
    //console.log("The selected value CB:: "+selectedValueCB);
    if (selectedValueCB) {
      selectedValue = 1;
    }

      allTasks.push ({
        "TaskName"  :   nameValue,
        "TaskStatus"  : 0,
        "TaskEditMode"  : editModeValue,
        "Selected"  : selectedValue
      });
  }

  var completeTaskElements = document.getElementById("completed-tasks");
  var completeChilds = completeTaskElements.children;

  for (var ij = 0; ij < completeChilds.length; ij++) 
  {
    var completeChildTask = completeChilds[ij];

    var taskEditMode = false;
    if (completeChildTask.classList != undefined && completeChildTask.classList.contains("editMode")) {
      taskEditMode = true;
    }
    var taskNameValue = completeChildTask.getElementsByTagName("label")[0].innerText;
    var taskEditModeValue = 0;
    if (taskEditMode) {
      taskEditModeValue = completeChildTask.querySelectorAll("input[type=text]")[0].value;
    }

    var compSelectedValue = 0;
    var compSelectedValueCB = false;
    var completedTasksChildArr = completeChildTask.querySelectorAll("input[type=checkbox]");
    if (completedTasksChildArr.length > 0) {
      compSelectedValueCB = completedTasksChildArr[0].checked;
    }
    //console.log("The comp selected value CB:: "+compSelectedValueCB);
    if (compSelectedValueCB) {
      compSelectedValue = 1;
    }


      allTasks.push ({
        "TaskName"  :   taskNameValue,
        "TaskStatus"  : 1,
        "TaskEditMode"  : taskEditModeValue,
        "Selected"  : compSelectedValue
      });
  }

  console.log("Tasks before saving From :: " + fromWhere + " :: "+JSON.stringify(allTasks));
  localStorage.setItem("TaskItems", JSON.stringify(allTasks));

}