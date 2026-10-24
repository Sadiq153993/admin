
const api = "https://6ad0ef90addc5b5cb1428a40.mockapi.io/product/news";

let news = [];

function showForm() {
    document.getElementById("listPage").style.display = "none";
    document.getElementById("formPage").style.display = "block";
}

function showList() {
    document.getElementById("formPage").style.display = "none";
    document.getElementById("listPage").style.display = "block";

    document.getElementById("newsForm").reset();
    document.getElementById("newsId").value = "";
    document.getElementById("formTitle").innerText = "Yeni xəbər əlavə et";
}

function loadNews() {
    fetch(api)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Xəbərlər yüklənmədi");
            }
            return response.json();
        })
        .then(function(data) {
            news = data;

            let table = document.getElementById("newsTable");
            table.innerHTML = "";

            data.forEach(function(item) {
                let row = document.createElement("tr");

                let idCell = document.createElement("td");
                idCell.innerText = item.id;

                let titleCell = document.createElement("td");
                titleCell.innerText = item.title;

                let dateCell = document.createElement("td");
                dateCell.innerText = item.date
                    ? new Date(item.date).toLocaleDateString("az-AZ")
                    : "-";

                let editCell = document.createElement("td");
                let editButton = document.createElement("button");
                editButton.className = "edit-btn";
                editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
                editButton.onclick = function() {
                    editNews(item.id);
                };
                editCell.appendChild(editButton);

                let deleteCell = document.createElement("td");
                let deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
                deleteButton.onclick = function() {
                    deleteNews(item.id);
                };
                deleteCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(titleCell);
                row.appendChild(dateCell);
                row.appendChild(editCell);
                row.appendChild(deleteCell);

                table.appendChild(row);
            });
        })
        .catch(function(error) {
            alert(error.message);
        });
}

document.getElementById("newsForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.getElementById("newsId").value;

    let newsData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
        category: document.getElementById("category").value,
        date: new Date().toISOString()
    };

    let url = api;
    let method = "POST";
    if (id !== "") {
        url = api + "/" + id;
        method = "PUT";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newsData)
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Xəbər yadda saxlanılmadı");
            }
            return response.json();
        })
        .then(function() {
            alert("Xəbər yadda saxlanıldı");
            showList();
            loadNews();
        })
        .catch(function(error) {
            alert(error.message);
        });
});

function editNews(id) {
    let item = news.find(function(value) {
        return value.id == id;
    });

    if (!item) {
        return;
    }

    document.getElementById("newsId").value = item.id;
    document.getElementById("title").value = item.title || "";
    document.getElementById("description").value = item.description || "";
    document.getElementById("image").value = item.image || "";
    document.getElementById("category").value = item.category || "Ölkə";

    document.getElementById("formTitle").innerText = "Xəbəri redaktə et";
    showForm();
}

function deleteNews(id) {
    let confirmDelete = confirm("Bu xəbəri silmək istəyirsən?");

    if (confirmDelete) {
        fetch(api + "/" + id, {
            method: "DELETE"
        })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Xəbər silinmədi");
                }
                return response.json();
            })
            .then(function() {
                alert("Xəbər silindi");
                loadNews();
            })
            .catch(function(error) {
                alert(error.message);
            });
    }
}

loadNews();
