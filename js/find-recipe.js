// Necessary variables for retrieving info from API
const key = "1";
let searchType = "s";
const baseURL = `https://www.themealdb.com/api/json/v1/${key}/search.php?`

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
    applyFilters();
};
searchCharBtn.onclick = function (event){
    event.preventDefault();
    searchType = "f"
    fetchResults();
};;

function fetchResults() {
    // Use preventDefault() to stop the form submitting
    // Assemble the full URL, checking the search type as to only grab one letter if thats what their after
    url = `${baseURL}${searchType}=${searchType === "s" ? searchBar.value : searchBar.value.charAt(0)}`;
    // Use fetch() to pass the URL that we built as a request to the API service, then pass the JSON to the displayResults() function
    fetch(url)
    .then(result => {return result.json()})
    .then(json => {applyFilters(json);})
    .catch(error => {
        console.log("Error: " + error);
    });
};

// function applyFilters(json){
//     // Will hold all active checkboxes
//     let activeCheckBoxes = document.querySelectorAll("input[type='checkbox']:checked");
//     let filteredResults = [];
//     if(activeCheckBoxes.length > 0){
//         for(checkBox of activeCheckBoxes){
//             url = `${baseURL}c=${checkBox.name}`
//             fetch(url)
//             .then(result => {return result.json()})
//             .then(json => {filteredResults.push(json);})
//             .catch(error => {
//                 console.log("Error: " + error);
//             });
//         }
//     }
    
//     displayResults(filteredResults);
// }

function displayResults(json){
    console.log(json);
}