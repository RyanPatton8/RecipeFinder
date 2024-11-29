// Necessary variables for retrieving info from API
const key = "1";
let searchType = "filter.php?i";
const baseURL = `https://www.themealdb.com/api/json/v1/${key}/`

// A text field to write your query and two search buttons that search differently
const searchBar = document.querySelector("#search-txt");
const searchBtn = document.querySelector("#search-full");

// Change the search type based on btn clicked and call fetch results
searchBtn.onclick = function (event){
    event.preventDefault();
    fetchResults(false);
};

//This function returns a list of detailed meal mealects
async function searchBarPromise() {
        let url = `${baseURL}search.php?s=${searchBar.value.trim()}`;
        let standardSearch = fetch(url)
        .then(result => {return result.json()})
        .then(json => {return json.meals;})
        .catch(error => {
            console.log("Error: " + error);
        });
        url = `${baseURL}filter.php?i=${searchBar.value.trim()}`;
        let ingredientSearch = fetch(url)
        .then(result => {return result.json()})
        .then(json => {return json.meals || [];})
        .catch(error => {
            console.log("Error: " + error);
            return [];
        });
        const results = await Promise.all([standardSearch, ingredientSearch]);
        /*
            In the line below I am taking all results from the flattened list and turning them 
            into key value pairs (the mealID and the meal mealect) using the .map function 
            and storing them in a new Map to remove all duplicates effieciently

            I am then storing all of that back into a list and returning it
        */
        return Array.from(
            new Map(results.flat().map(meal => [meal.idMeal, meal])).values()
        );
}
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
            let url = `${baseURL}filter.php?c=${checkBox.name}`
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
async function fetchResults(searchingByFirstChar = false){
    try{
        let searchBarResults = await searchBarPromise(searchingByFirstChar);
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
        paragraph.setAttribute("id", "no-meals");
        resultSection.appendChild(paragraph);
    }
    else{
        for(meal of results){
            resultSection.innerHTML += `
            <a href="meal.html?id=${meal.idMeal}">
                <div class = "meal-card">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strMeal}</p>
                </div>
            </a>
            `;
        }
    }
}

fetchResults();