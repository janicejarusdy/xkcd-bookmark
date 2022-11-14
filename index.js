async function getNumberOfComics() {
    try {
        const numberOfComics = await fetch('https://xkcd.com/info.0.json').then(res => res.json()).then(data => data["num"])
        return numberOfComics
    } catch (error) {
        console.log(error.message)
    }
}

const ul = document.querySelector('#searchResults ul')

const inputForm = document.querySelector('form');
  
inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('input#searchByKeyword');
    ul.innerHTML = ''

    filterComics(`${input.value}`)
});

async function filterComics(keyword) {

    const numberOfComics = await getNumberOfComics()
    console.log(numberOfComics)

    const searchResults = document.querySelector("#searchResults h4")
    searchResults.innerText = `Search Results for "${keyword}"`
    for (let i = 1; i <= numberOfComics; i++) {
        fetch(`https://xkcd.com/${i}/info.0.json`)
        .then(res => res.json())
        .then(data => {
            const transcript = data["transcript"]
            const title = data["safe_title"]
            const transcriptHasKeyword = transcript && transcript.includes(keyword)
            const titleHasKeyword = title && title.includes(keyword)
            if (transcriptHasKeyword || titleHasKeyword) {
              ul.innerHTML += `
              <li>
                <div id= ${i}>
                  <h2>${data["safe_title"]}</h2>
                  <img src="${data["img"]}" alt="${data["alt"]}/>"
                </div>
              </li>
              `
            }
        })
        .catch(error => console.log(`error at id ${i}`))
    }
}