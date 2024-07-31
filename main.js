(async function () {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
        const data = await res.json();
        getCategoryData(data.data);
    } catch (error) {
        console.log("error fetching category data ", error);
    }
})();

function getCategoryData(data) {
    console.log(data);
    data.forEach(category => {
        let list = document.createElement("button");
        list.setAttribute("class", "btn menu-btn btn-sm mx-2 category");
        list.setAttribute("id", category.category_id);
        list.innerText = category.category;
        document.querySelector("#navbar-menu").append(list);
    });
    let menu_list = document.querySelectorAll(".menu-btn");
    getMenuList(menu_list);
}

function getMenuList(menu_list) {
    let prevItem = null;
    menu_list.forEach(menu_item => {
        menu_item.addEventListener("click", (evt) => {
            if (prevItem) {
                prevItem.style.backgroundColor = "";
            }
            menu_item.style.backgroundColor = "red";
            prevItem = menu_item;

            let id = menu_item.getAttribute("id");
            setCatId(id);
            console.log(id);
        });
    });
}

async function setCatId(id) {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
        const data = await res.json();
        document.querySelector("#sortBtn").onclick = () => {
            sortVideosByViews(data.data);
        };
        getVideoInfo(data.data);
        console.log("done");
    } catch (error) {
        console.log("error fetching category data ", error);
    }
}

function sortVideosByViews(data) {
    data.sort((a, b) => parseInt(b.others.views.replace(/[^0-9]/g, '')) - parseInt(a.others.views.replace(/[^0-9]/g, '')));
    getVideoInfo(data);
}

function getVideoInfo(data) {
    document.querySelector("#allVideo").innerHTML = '';
    if (data.length) {
        console.log(data);
        document.querySelector(".empty").style.display = "none";
        data.forEach(singleData => {
            let video = document.createElement("div");
            video.setAttribute("class", "video-box rounded-md my-5");

            video.innerHTML = `
                <div class="thumbnail relative">
                    <img class="w-100" src="${singleData.thumbnail}" alt="">
                    <p class="time absolute inter-regular" >${(singleData.others.posted_date!="") ? makeTimeAgo(singleData.others.posted_date):''}</p>
                </div>
                <div class="flex gap-1">
                    <div class="pp w-3/12">
                       
                            <img src="${singleData.authors[0].profile_picture}" />
                    </div>
                    <div class="content w-9/12">
                        <h3 class="inter-bold text-2xl">${singleData.title}</h3>
                        <div class="author inter-regular text-md">
                            <p>${singleData.authors[0].profile_name} 
                                ${singleData.authors[0].verified ? 
                                    `<svg id="blue-tic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline size-5 text-[#2568EF]">
                                        <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd"/>
                                    </svg>` 
                                    : ''}
                            </p> 
                        </div>
                        <p class="text-sm inter-regular">${singleData.others.views} views </p>
                    </div>
                </div>`;
            document.querySelector("#allVideo").append(video);
        });
    } else {
        document.querySelector(".empty").style.display = "flex";
    }
}

function makeTimeAgo(seconds) {
    let years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds %= 365 * 24 * 60 * 60;

    let months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds %= 30 * 24 * 60 * 60;

    let days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;

    let hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;

    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if (years >= 1) return `${years} Year${years > 1 ? 's' : ''} Ago`;
    else if (months >= 1) return `${months} Month${months > 1 ? 's' : ''} Ago`;
    else if (days >= 1) return `${days} Day${days > 1 ? 's' : ''} Ago`;
    else if (hours >= 1) return `${hours} Hour${hours > 1 ? 's' : ''} Ago`;
    else if (minutes >= 1) return `${minutes} Minute${minutes > 1 ? 's' : ''} Ago`;
    else return `${seconds} Second${seconds > 1 ? 's' : ''} Ago`;
}


/*
{
    "category_id": "1001",
    "thumbnail": "https://i.ibb.co/QPNzYVy/moonlight.jpg",
    "title": "Midnight Serenade",
    "authors": [
        {
            "profile_picture": "https://i.ibb.co/fDbPv7h/Noha.jpg",
            "profile_name": "Noah Walker",
            "verified": false
        }
    ],
    "others": {
        "views": "543K",
        "posted_date": ""
    }
}

*/