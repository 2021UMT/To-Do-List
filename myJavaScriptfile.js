function getAndUpdate() {
    console.log("Updating List...");
    showToast("Task added successfully!", "success");
    showToast("All tasks cleared successfully!", "danger");
    tit = document.getElementById("title").value.trim();
    desc = document.getElementById("description").value.trim();
    if (tit == "" || desc == "") {
        alert("Title or Description can't be empty");
        return;
    }
    let exists = itemJsonArray.some(
        (task) => task[0] === tit && task[1] === desc
    );
    if (exists) {
        alert("This task already exists!");
        return;
    }
    if (localStorage.getItem("itemsJson") == null) {
        itemJsonArray = [];
        itemJsonArray.push([tit, desc]);
        localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
    } else {
        itemJsonArrayStr = localStorage.getItem("itemsJson");
        itemJsonArray = JSON.parse(itemJsonArrayStr);
        itemJsonArray.push([tit, desc]);
        localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
    }
    document.getElementById("title").focus();
    updatePagination();
}

let itemsPerPage = 7;
let currentPage = 1;

function updatePagination() {
    if (localStorage.getItem("itemsJson") == null) {
        itemJsonArray = [];
    } else {
        itemJsonArray = JSON.parse(localStorage.getItem("itemsJson"));
    }

    let totalPages = Math.ceil(itemJsonArray.length / itemsPerPage);

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = Math.min(
        startIndex + itemsPerPage,
        itemJsonArray.length
    );

    let tableBody = document.getElementById("tableBody");
    let str = "";
    itemJsonArray.slice(startIndex, endIndex).forEach((element, index) => {
        str += `
    <tr>
    <th scope="row">${startIndex + index + 1}</th>
    <td>${element[0]}</td>
    <td>${element[1]}</td>
    <td><button class="btn btn-sm btn-primary" onclick="deleted(${startIndex + index
            })">Delete</button></td>
    </tr>`;
    });
    tableBody.innerHTML = str;

    let paginationControls = document.getElementById("paginationControls");
    let paginationStr = "";
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `<button class="btn btn-sm btn-${i === currentPage ? "primary" : "secondary"
            }" onclick="changePage(${i})">${i}</button> `;
    }
    paginationControls.innerHTML = paginationStr;
}

function changePage(pageNumber) {
    currentPage = pageNumber;
    updatePagination();
}
updatePagination();

add = document.getElementById("add");
add.addEventListener("click", getAndUpdate);
updatePagination();

function searchTasks() {
    let searchQuery = document
        .getElementById("searchBar")
        .value.toLowerCase();

    if (localStorage.getItem("itemsJson") == null) {
        itemJsonArray = [];
    } else {
        itemJsonArray = JSON.parse(localStorage.getItem("itemsJson"));
    }

    let filteredTasks = itemJsonArray.filter(
        (task) =>
            task[0].toLowerCase().includes(searchQuery) ||
            task[1].toLowerCase().includes(searchQuery)
    );

    let tableBody = document.getElementById("tableBody");
    let str = "";
    filteredTasks.forEach((element, index) => {
        str += `
    <tr>
    <th scope="row">${index + 1}</th>
    <td>${element[0]}</td>
    <td>${element[1]}</td>
    <td>
        <button class="btn btn-sm btn-primary" 
        onclick="deleteByTask('${element[0]}', '${element[1]}')">
        Delete
        </button>
    </td>

    </tr>`;
    });
    tableBody.innerHTML = str;
}

function deleted(itemIndex) {
    console.log("Delete", itemIndex);
    itemJsonArrayStr = localStorage.getItem('itemsJson')
    itemJsonArray = JSON.parse(itemJsonArrayStr);

    itemJsonArray.splice(itemIndex, 1);
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));
    updatePagination();
}

function deleteByTask(title, description) {
    let itemJsonArray = JSON.parse(localStorage.getItem("itemsJson")) || [];

    const index = itemJsonArray.findIndex(
        (task) => task[0] === title && task[1] === description
    );

    if (index > -1) {
        itemJsonArray.splice(index, 1);
        localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
        updatePagination();
        showToast("Task deleted successfully!", "success");
    }
}

function Clearlist() {
    if (confirm("Do you areally want to clear?")) {
        console.log("Your list Items are Cleared");
        localStorage.clear();
        updatePagination();
    }
}

function showToast(message, type = "success") {
    const toast = document.getElementById("toastMessage");
    toast.className = `alert alert-${type}`;
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}