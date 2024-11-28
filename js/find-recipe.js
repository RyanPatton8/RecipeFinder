// Necessary variables for retrieving info from API
const key = "1";
let searchType = "s";
const baseURL = `https://www.themealdb.com/api/json/v1/${key}/`

// A text field to write your query and two search buttons that search differently
const searchBar = document.querySelector("#search-txt");
const searchBtn = document.querySelector("#search-full");
const searchCharBtn = document.querySelector("#search-first-letter");

// Change the search type based on btn clicked and call fetch results
searchBtn.onclick = function (event){
    event.preventDefault();
    searchType = "search.php?s";
    fetchResults();
};
searchCharBtn.onclick = function (event){
    event.preventDefault();
    searchType = "filter.php?i";
    fetchResults();
};

function searchBarPromise() {
    if(searchType === "search.php?s"){
        searchBar.value.trim().length > 1 ? searchType = "search.php?s" : searchType = "search.php?f";
    }
    url = `${baseURL}${searchType}=${searchBar.value.trim()}`;
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
        return new Set(allMeals.map(meal => meal.idMeal));
    }
    else{
        return new Set();
    }
}

async function fetchResults(){
    try{
        let searchBarResults = await searchBarPromise();
        let filterResults = await collectAllFilteredPromise(searchBarResults);
        let finalResults = searchBarResults.filter(meal => filterResults.has(meal.idMeal));
        if(filterResults.size > 0 && searchBarResults.length > 0){
            console.log(finalResults);
        }
        else if(filterResults.size > 0){
            console.log(finalResults);
        }
        else if(searchBarResults.length > 0){
            let finalResults = searchBarResults;
            console.log(finalResults)
        }
        else{
            console.log("No Results Returned");
        }
    }
    catch(error){
        console.log("No Results");
    }
}