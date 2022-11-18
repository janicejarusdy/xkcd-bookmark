$(window).on('load', function(){
    $(".loader").fadeOut(2000)
    $(".content").fadeIn(2000)
})

const searchToolLink = document.querySelector("#searchTool-link")
const faveComicsLink = document.querySelector("#faveComics-link")

//add event listeners for the above two links, making display none for each other
const searchTool = document.querySelector("div .searchTool")
const faveComics = document.querySelector("div #faveComics")
const showBoth = document.querySelector("div #showBoth-link")

searchToolLink.addEventListener("click", () => {
    faveComics.style.display="none"
    searchTool.style.display="block"
})

faveComicsLink.addEventListener("click", () => {
    searchTool.style.display="none"
    faveComics.style.display="block";
})

showBoth.addEventListener("click", () => {
    searchTool.style.display="block"
    faveComics.style.display="block";
})

async function getNumberOfComics() {
    try {
        const numberOfComics = await fetch('https://xkcd.com/info.0.json').then(res => res.json()).then(data => data["num"])
        return numberOfComics
    } catch (error) {
        console.log(error.message)
    }
}

const promises = []

async function getAllComics(comicArray){
    const numberOfComics = await getNumberOfComics()
    for (let i = 1; i <= numberOfComics; i++) {
        fetch(`https://xkcd.com/${i}/info.0.json`)
        .then(res => {
            promises.push(res)
            return res.json()
        })
        .then(data => comicArray.push(data))
        .catch(error => console.log(`error at id ${i}`))
    }
}

const allComics = []
getAllComics(allComics)

const ul = document.querySelector('#searchResults ul')
const inputForm = document.querySelector('form');
  
inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('input#searchByKeyword');
    ul.innerHTML = ''

    filterComics(`${input.value}`)

    input.value = ''
});

async function filterComics(keyword) {

    const searchResults = document.querySelector("#searchResults h4")
    searchResults.innerText = `Search Results for "${keyword}"`

    await Promise.allSettled(promises)
    .then(findMatchingComics(allComics, keyword))
}

function findMatchingComics(comicArray, keyword) {

    comicArray.forEach(comic => {
        const transcript = comic["transcript"]
        const title = comic["safe_title"]
        const transcriptHasKeyword = transcript && transcript.toLowerCase().includes(keyword.toLowerCase())
        const titleHasKeyword = title && title.toLowerCase().includes(keyword.toLowerCase())
        if (transcriptHasKeyword || titleHasKeyword) {
            ul.innerHTML += `
            <li class="search-posts">
                <div class = "container">
                    <div class= "comic" id= ${comic["num"]}>
                    <h2>${comic["safe_title"]}</h2>
                    <img src="${comic["img"]}" alt="${comic["alt"]}/>"
                </div>
                <div class="unsaved-btn searchPosts" data-num="${comic["num"]}">
                  <button class="unsaved-btn" data-title="${title}" data-num="${comic["num"]}" data-img="${comic["img"]}" data-alt="${comic["alt"]}" onClick="toggleFaveComic(event)">Save to Bookmarks</button>
                </div>
            </li>
            `
        }
    })

    ul.innerHTML += '<h3 class="search-posts"> - End of results - </h4>'

    console.log(allComics.length)
            
}

function toggleFaveComic(event) {
    console.log(`the id is: ${event.target.dataset.id}`)
    if (event.target.dataset.id) {
        console.log(`I'm in toggleFaveComic trying to delete ${event.target}`)
        deleteFaveComic(event.target)
    }
    else {
        addFaveComic(event.target)
        console.log(`I'm in toggleFaveComic trying to add ${event.target}`)
    }

    console.log(`the id is now: ${event.target.dataset.id}`)
}


async function addFaveComic(element) {
    const postObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify({
            title: element.dataset.title,
            img: element.dataset.img,
            alt: element.dataset.alt,
            num: element.dataset.num
            
        })
    }

    await fetch('http://localhost:3000/faveComics', postObj)
        .then(res => res.json())
        .then(data => {
            element.dataset.id = data.id

            console.log(`element = ${element}`)
            console.log(`data = ${data}`)
        
            const ulBookmarks = document.querySelector("#faveComics ul")

            ulBookmarks.innerHTML += `
            <li class="bookmarks" data-num="${element.dataset["num"]}}>
                <div class = "container">
                    <div class= "comic" >
                    <h2>${element.dataset["title"]}</h2>
                    <img src="${element.dataset["img"]}" alt="${element.dataset["alt"]}/>"
                </div>
                <div class="saved-btn bookmarks" data-id= "${data.id}" data-num="${element.dataset["num"]}">
                  <button class="saved-btn" onClick="toggleFaveComic(event)">Saved</button>
                </div>
            </li>
            `

            const saveButton = document.querySelector(`div[data-num="${element.dataset["num"]}"]`)
            
            saveButton.innerHTML = `
            <button class="saved-btn" data-id="${data.id}" onClick="toggleFaveComic(event)">Saved</button>
            `
            saveButton.dataset.id = data.id
            saveButton.classList.remove("unsaved-btn")
            saveButton.classList.add("saved-btn")
            saveButton.parentNode.dataset.id = data.id
        })

        const button = document.querySelector('button')
        button.addEventListener("click", ((event)=>console.log(event.target)))
}

// the below function should have a functionality to delete li item
// on FaveComics page based on their "id" number aka db.json id number
function deleteFaveComic(element) {
    const resetComicObj = {
        title: element.dataset.title,
        img: element.dataset.img,
        alt: element.dataset.alt,
        num: element.dataset.num,
        id: 0
    }
    const initObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(
            resetComicObj
        )
            
        
    }

    fetch(`'http://localhost:3000/faveComics/${element.dataset.id}`, initObj)
        .then(res => res.json())
        .then(data => {
            delete data

            const liSaved = document.querySelector(`li[data-num="${element.dataset["num"]}"}`)
            liSaved.innerHTML = ''

            const greenButton = document.querySelector(`div[data-num="${element.dataset["num"]}"]`)
            
            greenButton.classList.remove("saved-btn")
            greenButton.classList.add("unsaved-btn")
            greenButton.innerHTML = `
                <button onClick="toggleFaveComic(event)">Save to Bookmarks</button>
            `
        })

}