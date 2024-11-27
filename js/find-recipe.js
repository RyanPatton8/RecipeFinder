// Necessary variables for retrieving info from API
const key = "1";
let searchType = "s";
const baseURL = `https://www.themealdb.com/api/json/v1/${key}/`
//               https://www.themealdb.com/api/json/v1/1/list.php?c=list

// A text field to write your query and two search buttons that search differently
const searchBar = document.querySelector("#search-txt");
const searchBtn = document.querySelector("#search-full");
const searchCharBtn = document.querySelector("#search-first-letter");

// Change the search type based on btn clicked and call fetch results
// searchBtn.onclick = function (event){
//     event.preventDefault();
//     searchType = "s"
//     fetchResults();
// };
searchBtn.onclick = function (event){
    event.preventDefault();
    fetchResults();
};
searchCharBtn.onclick = function (event){
    event.preventDefault();
    searchType = "f"
    fetchResults();
};

function searchBarPromise() {
    url = `${baseURL}search.php?${searchType}=${searchType === "s" ? searchBar.value : searchBar.value.charAt(0)}`;
    return fetch(url)
    .then(result => {return result.json()})
    .then(json => {return json.meals;})
    .catch(error => {
        console.log("Error: " + error);
    });
};

async function collectAllFilteredPromise(){
    let activeCheckBoxes = document.querySelectorAll("input[type='checkbox']:checked");
    let promiseList = [];
    if(activeCheckBoxes.length > 0){
        for(checkBox of activeCheckBoxes){
            url = `${baseURL}filter.php?c=${checkBox.name}`
            let promise = fetch(url)
                .then(result => {return result.json()})
                .then(json => {return json.meals;})
                .catch(error => {
                    console.log("Error: " + error);
                });
            promiseList.push(promise);
        }

        const results = await Promise.all(promiseList);
        const allMeals = results.flat();
        return new Set(allMeals);
    }
}

async function fetchResults(){
    let searchBarResults = await searchBarPromise();
    let filterResults = await collectAllFilteredPromise();
    console.log(searchBarResults);
}

function displayResults(json){
    console.log(json);
}

function applyFilters(json){
    // Will hold all active checkboxes
    
}