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
    //Store their current formatting
    let h1FontSize = h1.style.fontSize;
    let countryFontSize = country.style.fontSize;
    let mainFlexDir = main.style.flexDirection;
    let imgWidth = img.style.width;
    let ingredientFontSize = ingredients.style.fontSize;
    let instructionFontSize = instructions.style.fontSize;
    //reformat for pdf
    h1.style.fontSize = "30px";
    country.style.fontSize = "20px";
    main.style.flexDirection = "column-reverse";
    img.style.width = "200px";
    ingredients.style.fontSize = "13px";
    instructions.style.fontSize = "15px";
    printBtn.style.display = "none";
    homebtn.style.display = "none";
    document.querySelector("#flex-holder").appendChild(img);
    //open pdf screen for print or save
    print();
    //fix formatting
    h1.style.fontSize = h1FontSize;
    country.style.fontSize = countryFontSize;
    main.style.flexDirection = mainFlexDir;
    img.style.width = imgWidth;
    ingredients.style.fontSize = ingredientFontSize;
    instructions.style.fontSize = instructionFontSize;
    printBtn.style.display = "block";
    homebtn.style.display = "block";
    imgContainer.appendChild(img);
}