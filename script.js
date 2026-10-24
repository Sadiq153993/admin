
const api = "https://6ad0ef90addc5b5cb1428a40.mockapi.io/product/news";

let allNews = [];

function loadNews() {
    fetch(api)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Xəbərlər yüklənmədi");
            }

            return response.json();
        })
        .then(function(data) {
            allNews = data;

            showNews(data);
        })
        .catch(function(error) {
            document.getElementById("newsList").innerText = error.message;
            document.getElementById("latestNewsList").innerText = error.message;
        });
}

function showNews(data) {
    let newsList = document.getElementById("newsList");
    let latestNewsList = document.getElementById("latestNewsList");

    newsList.innerHTML = "";
    latestNewsList.innerHTML = "";

    if (data.length === 0) {
        newsList.innerText = "Xəbər tapılmadı";
        latestNewsList.innerText = "Xəbər tapılmadı";
        return;
    }

    data.forEach(function(item, index) {
        if (index < 4) {
            let card = document.createElement("div");
            card.className = "news-card";

            let img = document.createElement("img");
            img.src = item.image || "https://placehold.co/400x300?text=Xeber";
            img.alt = item.title || "Xəbər";

            let text = document.createElement("div");
            text.className = "news-text";

            let title = document.createElement("h3");
            title.innerText = item.title || "Başlıqsız xəbər";

            text.appendChild(title);
            card.appendChild(img);
            card.appendChild(text);

            newsList.appendChild(card);
        }

        let latestCard = document.createElement("div");
        latestCard.className = "latest-card";

        let image = document.createElement("img");
        image.src = item.image || "https://placehold.co/500x300?text=Xeber";
        image.alt = item.title || "Xəbər";

        let category = document.createElement("span");
        category.innerText = item.category || "XƏBƏR";

        let heading = document.createElement("h3");
        heading.innerText = item.title || "Başlıqsız xəbər";

        let date = document.createElement("p");

        if (item.date) {
            let newsDate = new Date(item.date);

            if (!isNaN(newsDate.getTime())) {
                date.innerText = newsDate.toLocaleDateString("az-AZ");
            } else {
                date.innerText = "";
            }
        }

        latestCard.appendChild(image);
        latestCard.appendChild(category);
        latestCard.appendChild(heading);
        latestCard.appendChild(date);

        latestNewsList.appendChild(latestCard);
    });
}

function searchNews() {
    let input = document.getElementById("searchInput").value.toLowerCase();

    let filteredNews = allNews.filter(function(item) {
        return (item.title || "").toLowerCase().includes(input);
    });

    showNews(filteredNews);
}

let categories = document.querySelectorAll(".nav-content a");

categories.forEach(function(category) {
    category.addEventListener("click", function(event) {
        event.preventDefault();

        categories.forEach(function(item) {
            item.classList.remove("active");
        });

        category.classList.add("active");

        let selectedCategory = category.innerText.trim();

        if (selectedCategory === "Ana səhifə") {
            showNews(allNews);
        } else {
            let filteredNews = allNews.filter(function(item) {
                return (item.category || "").toLowerCase() === selectedCategory.toLowerCase();
            });

            showNews(filteredNews);
        }
    });
});

loadNews();
