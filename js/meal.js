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
    let body = document.querySelector("body");
    body.innerHTML += `
    <h1>${meal.strMeal}</h1>
    <div>
        <p>${meal.strArea}</p>
        <a href="index.html">Home</a>
    </div>
    <main>
        <section>
            <ul id="ingredients">
                <!-- strMeasure[i] + " of " + strIngredients[i] indexed at 1 -->
                
            </ul>
            <!-- strInstructions -->
            <p id="instructions">
               Fry the finely chopped onions and minced meat in oil.
               Add the salt and pepper. 
               Grease a round baking tray and put a layer of pastry in it. Cover with a thin layer 
               of filling and cover this with another layer of filo pastry which must be well coated in oil. 
               Put another layer of filling and cover with pastry. When you have five or six layers, cover with filo pastry, 
               bake at 200ºC/392ºF for half an hour and cut in quarters and serve."
            </p>
        </section>
        <img src="https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg" alt="empty">
    </main>
    `;
    let ul = document.querySelector("#ingredients");
    console.log(meal);
    for(let i = 1; i <= 20; i++){
        if(meal[`strMeasure${i}`].trim() === ""){
            break;
        }
        let li = document.createElement("li");
        li.textContent = meal[`strIngredient${i}`] +": "+ meal[`strMeasure${i}`];
        ul.appendChild(li);
    }
    let instructions = document.querySelector("#instructions");
    instructions.textContent = meal.strInstructions;
    
}

getItem();