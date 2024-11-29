const urlParams = new URLSearchParams(window.location.search);
const mealID = urlParams.get("id");
const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
function getItem(){
    fetch(url)
        .then(result => {return result.json()})
        .then(json => {return json.meals})
        .then(meals => {displayMeal(meals[0])})
        .catch(error => {
            console.log("Error: " + error);
        });
}

function displayMeal(meal){
    console.log(meal);
    let mealName = document.querySelector("h1");
    let country = document.querySelector("#country-origin");
    let ul = document.querySelector("#ingredients");
    let instructions = document.querySelector("#instructions");
    let mealImg = document.querySelector("img");
    mealName.textContent = meal.strMeal;
    country.textContent = meal.strArea;
    for(let i = 1; i <= 20; i++){
        if(meal[`strMeasure${i}`].trim() === ""){
            break;
        }
        let li = document.createElement("li");
        li.textContent = meal[`strIngredient${i}`] +": "+ meal[`strMeasure${i}`];
        ul.appendChild(li);
    }
    instructions.textContent = meal.strInstructions;
    mealImg.setAttribute("src", meal.strMealThumb);
    mealImg.setAttribute("alt", meal.strMeal);
}

getItem();