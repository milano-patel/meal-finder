const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading');
    single_mealEl = document.getElementById('single-meal');

// Search meals and fetch from API
function searchMeal(e) {
    e.preventDefault();


    //Clear Single Meal
    single_mealEl.innerHTML = '';

    //Get Search item
    const term = search.value;
    
    //Check for empty
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

                if(data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try Again!</p>`;
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `).join('');
                }
            });
            search.value = '';
    } else {
        alert('Please enter a search term');
    }
}

//Get Single Meal
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const foodItem = data.meals[0];

        addMealToDOM(foodItem);

    })
}

//Get Random Meal
function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const foodItem = data.meals[0];

        addMealToDOM(foodItem);
    });
}


//Add meal to DOM
function addMealToDOM(foodItem) {

    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
        if(foodItem[`strIngredient${i}`]) {
            ingredients.push(`${foodItem[`strIngredient${i}`]} - ${foodItem[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    console.log(ingredients);

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h2>${foodItem.strMeal}</h2>
        <img src="${foodItem.strMealThumb}" alt="${foodItem.strMeal}" />
        <div class="single-meal-info">
            <p>Main Ingredient: ${foodItem.strCategory}</p>
            <p>Originaly: ${foodItem.strArea}</p>
        </div>
        <div class="main">
            <p>${foodItem.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;

}

 
//Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
    if(e.target.classList.contains('meal-info')){
        const mealID = e.target.getAttribute('data-mealid');
        getMealById(mealID);
    }

});