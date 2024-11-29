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

let printBtn = document.querySelector("#printBtn");
printBtn.onclick = function(){
    //Gather necessary references
    let h1 = document.querySelector("h1");
    let country = document.querySelector("#country-origin");
    let main = document.querySelector("main");
    let imgContainer = document.querySelector("#img-container");
    let img = document.querySelector("img");
    let ingredients = document.querySelector("#ingredients");
    let instructions = document.querySelector("#instructions");
    let homebtn = document.querySelector("a");
    //reformat for pdf
    h1.style.fontSize = "30px";
    country.style.fontSize = "20px";
    main.style.flexDirection = "column-reverse";
    img.style.width = "200px";
    printBtn.style.display = "none";
    ingredients.style.fontSize = "13px";
    instructions.style.fontSize = "15px";
    document.querySelector("#flex-holder").appendChild(img);
    homebtn.style.display = "none";
    //open pdf screen for print or save
    print();
    //fix formatting
    h1.style.fontSize = "3em";
    country.style.fontSize = "1.7em";
    main.style.flexDirection = "row";
    img.style.width = "auto";
    ingredients.style.fontSize = "1.2rem";
    instructions.style.fontSize = "1.2rem";
    printBtn.style.display = "block";
    homebtn.style.display = "block";
    imgContainer.appendChild(img);
}