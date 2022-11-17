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
});



function filterComics(keyword) {

    const searchResults = document.querySelector("#searchResults h4")
    searchResults.innerText = `Search Results for "${keyword}"`

    Promise.allSettled(promises).then(findMatchingComics(allComics, keyword))
}

function findMatchingComics(comicArray, keyword) {

    comicArray.forEach(comic => {
        const transcript = comic["transcript"]
        const title = comic["safe_title"]
        const transcriptHasKeyword = transcript && transcript.toLowerCase().includes(keyword.toLowerCase())
        const titleHasKeyword = title && title.toLowerCase().includes(keyword.toLowerCase())
        if (transcriptHasKeyword || titleHasKeyword) {
            ul.innerHTML += `
            <li>
                <div class= "comic container" id= ${comic["num"]}>
                  <h2>${comic["safe_title"]}</h2>
                  <img src="${comic["img"]}" alt="${comic["alt"]}/>"
                </div>
                <div class= "btn">
                    <button id="saveToBookmarks" onClick="toggleFaveComic(event)">Save to Bookmarks</button>
                </div>
            </li>
            `
        }
    })

    ul.innerHTML += '<h3> - End of results - </h4>'

    console.log(allComics.length)
            
}

function toggleFaveComic(event) {
    // console.log("Has Data-ID? ", event.target.dataset.id)
    console.log("hello")
    if (event.target.dataset['id']) deleteFaveComic(event.target)
    else addFaveComic(event.target)
}

// function likeCallback(e) {
//     const heart = e.target;
//     mimicServerCall("bogusUrl")
//       .then(function(){
//         if ( heart.innerText === EMPTY_HEART) {
//           heart.innerText = FULL_HEART;
//           heart.className = "activated-heart";
//         } else {
//           heart.innerText = EMPTY_HEART;
//           heart.className = "";
//         }
//       })
//       .catch(function(error) {
//         const modal = document.getElementById("modal");
//         modal.className = "";
//         modal.innerText = error;
//         setTimeout(() =>  modal.className = "hidden", 3000);
//       });
//   }
  
//   for (const glyph of articleHearts) {
//     glyph.addEventListener("click", likeCallback);
//   }


// function addFavePokemon(elem) {
//     const initObj = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accepts": "application/json"
//         },
//         body: JSON.stringify({
//             name: event.target.dataset.pokemon
//         })
//     }

//     fetch('http://localhost:3000/favePokemons', initObj)
//         .then(res => res.json())
//         .then(data => {
//             elem.dataset['id'] = data.id

//             if (elem.tagName !== "DIV") {
//                 elem.parentNode.dataset['id'] = data.id
//                 elem.parentNode.classList.toggle("saved")
//                 elem.parentNode.childNodes.forEach(c => {
//                     console.log(c)
//                     if (c.nodeName !== "#text") c.dataset['id'] = data.id
//                 })
//             } else {
//                 elem.dataset['id'] = data.id
//                 elem.classList.toggle("saved")
//                 elem.childNodes.forEach(c => {
//                     console.log(c)
//                     if (c.nodeName !== "#text") c.dataset['id'] = data.id
//                 })
//             }
//         })
// }


// function deleteFavePokemon(elem) {
//     const initObj = {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//             "Accepts": "application/json"
//         },
//     }

//     fetch(`http://localhost:3000/favePokemons/${elem.dataset['id']}`, initObj)
//         .then(res => res.json())
//         .then(data => {
//             if (elem.tagName !== "DIV") {
//                 delete elem.parentNode.dataset['id']
//                 elem.parentNode.classList.toggle("saved")
//                 elem.parentNode.childNodes.forEach(c => {
//                     if (c.nodeName !== "#text") delete c.dataset['id']
//                 })
//             } else {
//                 delete elem.dataset['id']
//                 elem.classList.toggle("saved")
//                 elem.childNodes.forEach(c => {
//                     if (c.nodeName !== "#text") delete c.dataset['id']
//                 })
//             }
//         })
// }

//     fetch('http://localhost:3000/favePokemons', initObj)
//         .then(res => res.json())
//         .then(data => {
//             elem.dataset['id'] = data.id

//             if (elem.tagName !== "DIV") {
//                 elem.parentNode.dataset['id'] = data.id
//                 elem.parentNode.classList.toggle("saved")
//                 elem.parentNode.childNodes.forEach(c => {
//                     console.log(c)
//                     if (c.nodeName !== "#text") c.dataset['id'] = data.id
//                 })
//             } else {
//                 elem.dataset['id'] = data.id
//                 elem.classList.toggle("saved")
//                 elem.childNodes.forEach(c => {
//                     console.log(c)
//                     if (c.nodeName !== "#text") c.dataset['id'] = data.id
//                 })
//             }
//         })
// }