// Necessary variables for retrieving info from API
const key = "1";
let searchType = "filter.php?i";
const baseURL = `https://www.themealdb.com/api/json/v1/${key}/`

// A text field to write your query and two search buttons that search differently
const searchBar = document.querySelector("#search-txt");
const searchBtn = document.querySelector("#search-full");
const searchCharBtn = document.querySelector("#search-first-letter");
const searchIngrBtn = document.querySelector("#search-ingredient");


// Change the search type based on btn clicked and call fetch results
searchBtn.onclick = function (event){
    event.preventDefault();
    searchType = "search.php?s";
    fetchResults();
};
searchCharBtn.onclick = function (event){
    event.preventDefault();
    searchType = "search.php?f";
    fetchResults();
};
searchIngrBtn.onclick = function (event){
    event.preventDefault();
    searchType = "filter.php?i";
    fetchResults();
};

//This function returns a list of detailed meal objects checking to see if it is a first letter only search using a terinary operator
function searchBarPromise() {
    url = `${baseURL}${searchType}=${searchType === "search.php?f" ? searchBar.value.trim().charAt(0) : searchBar.value.trim()}`;
    return fetch(url)
    .then(result => {return result.json()})
    .then(json => {return json.meals;})
    .catch(error => {
        console.log("Error: " + error);
    });
};
/*
    This function gets a list of all active checkboxes in the form and loops through each of them creating future promises that are stored
    in a list.

    Each individual promise returns all of the meals in its respective category.
    
    Afterwards it takes all those promises and gathers all the results from them and flattens them into a single list of meals
    and then turns that list into a set of all of the meal ids ensuring easy look up in constant time without duplicates
*/
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
/*
    After getting the detailed search results and the filtered meal id's we actually filter out any meals from our 
    search that werent in the filtered meals list and then print the results
*/
async function fetchResults(){
    try{
        let searchBarResults = await searchBarPromise();
        let filterResults = await collectAllFilteredPromise(searchBarResults);
        let finalResults = searchBarResults.filter(meal => filterResults.has(meal.idMeal));
        let wasFiltered = filterResults.size > 0;
        let wasStrInputted = searchBarResults.length > 0;
        let wasResults = finalResults.length > 0;
        if(wasResults){
            displayResults(finalResults);
        }
        else if(wasStrInputted && wasFiltered){
            displayResults("No results in category");
        }
        else if(wasStrInputted){
            displayResults(searchBarResults);
        }
    }
    catch(error){
        console.log(error);
        displayResults("No results in category");
    }
}

function displayResults(results){
    console.log(results);
    // Section that holds all results
    const resultSection = document.querySelector("#meals");

    while (resultSection.firstChild) {
        resultSection.removeChild(resultSection.firstChild);
    }

    if(typeof results === "string"){
        const paragraph = document.createElement("p");
        paragraph.textContent = "No results in category";
        resultSection.appendChild(paragraph);
    }
    else{
        for(obj of results){
            resultSection.innerHTML += `
            <div class = "meal-card">
                <img src="${obj.strMealThumb}" alt="${obj.strMeal}">
                <p>${obj.strMeal}</p>
            </div>
            `;
        }
    }
}

fetchResults();