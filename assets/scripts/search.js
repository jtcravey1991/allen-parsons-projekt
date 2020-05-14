jQuery.noConflict();

var ingredientList = [];
var allergies = {
    dairy: false,
    eggs: false,
    gluten: false,
    peanut: false,
    treeNut: false,
    seafood: false,
    shellfish: false,
    soy: false
};
var savedRecipes = [];

var currentResults = {};

var mode;

var ingredientElement = document.getElementById("currentIngredientsList");
var allergyChecks = document.getElementById("allergiesForm");

initialize();

// initializes page with saved ingredients and allergies
function initialize() {
    loadIngredientList();
    loadAllergies();
    renderIngredients();
    renderAllergies();
}

// event listener for add ingredient button
(function ($) {
    $("addButton").addEvent("click", function (event) {
        event.preventDefault();
        var newIngredient = $("addIngredientInput").value;
        checkIngredient(newIngredient);
    });
})(document.id);

// event listener for ingredients delete button
ingredientElement.addEventListener("click", function (event) {
    if (event.target.type === "button") {
        var index = event.target.id;
        ingredientList.splice(index, 1);
        saveIngredientList();
        renderIngredients();
    }
});

// event listener for allergy check boxes
allergyChecks.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
        updateAllergies();
        saveAllergies();
    }
});

// adds event listener for recipe search button
(function ($) {
    $("recipeSearchButton").addEvent("click", function (event) {
        event.preventDefault();
        var queryURL = generateRecipeSearchURL($("recipeSearchInput").value);

        jQuery.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            mode = "recipe";
            currentResults = response;
            renderSearchResults(response);
        })
    });
})(document.id);

(function ($) {
    $("ingredientSearchButton").addEvent("click", function (event) {
        event.preventDefault();
        var queryURL = generateIngredientURL();

        jQuery.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            mode = "ingredient"
            currentResults = response;
            renderSearchResults(response);
        })
    });
})(document.id);

// submits an ajax to check if added ingredient is supported
function checkIngredient(term) {
    var checkedIngredient = term.toLowerCase();
    jQuery.ajax({
        url: "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=4483dfcaf2b64ab798b9683fabb17a1a&query=" + checkedIngredient + "&number=1",
        method: "GET"
    }).then(function (response) {
        if (response.length === 0) {
            wrongIngredient();
        }
        else if (term.toLowerCase() !== response[0].name) {
            wrongIngredient();
        }
        else {
            ingredientList.push(checkedIngredient);
            document.id("addIngredientInput").value = "";
            saveIngredientList();
            renderIngredients();
        }
    })
}

// lets the user know the ingredient they tried to add wasnt found
function wrongIngredient() {
    var $ = document.id;

    $("addIngredientInput").value = "";
    $("addIngredientInput").setProperty("placeholder", "Sorry, not found. Try again.");
    setTimeout(function () {
        $("addIngredientInput").setProperty("placeholder", "Ingredient")
    }, 2000)
}

// renders the ingredient list with delete buttons
function renderIngredients() {
    document.id("currentIngredientsList").empty();
    for (var i = 0; i < ingredientList.length; i++) {
        var li = new Element("li");
        li.textContent = ingredientList[i];

        var deleteButton = new Element("button");
        deleteButton.textContent = "delete";
        deleteButton.id = i;
        deleteButton.set("type", "button");

        li.grab(deleteButton);
        document.id("currentIngredientsList").grab(li);
    }
}

// saves current ingredient list to local storage
function saveIngredientList() {
    localStorage.setItem("ingredientList", JSON.stringify(ingredientList));
}

// loads ingredient list from local storage
function loadIngredientList() {
    var tempList = JSON.parse(localStorage.getItem("ingredientList"));
    if (tempList !== null) {
        ingredientList = tempList;
    }
}

//saves current allergy object to local storage
function saveAllergies() {
    localStorage.setItem("allergies", JSON.stringify(allergies));
}

// loads allergy object from local storage
function loadAllergies() {
    var tempAllergies = JSON.parse(localStorage.getItem("allergies"));
    if (tempAllergies !== null) {
        allergies = tempAllergies;
    }
}

// saves recipes array
function saveRecipes() {
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
}

// loads saved recipes from local storage
function loadRecipes() {
    var tempRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
    if (tempRecipes !== null) {
        savedRecipes = tempRecipes;
    }
}

// updates allergy check boxes to allergy object
function renderAllergies() {
    var $ = document.id;

    $("dairyBox").checked = allergies.dairy;
    $("eggBox").checked = allergies.eggs;
    $("glutenBox").checked = allergies.gluten;
    $("peanutBox").checked = allergies.peanut;
    $("treeNutBox").checked = allergies.treeNut;
    $("seafoodBox").checked = allergies.seafood;
    $("shellfishBox").checked = allergies.shellfish;
    $("soyBox").checked = allergies.soy;
}

// updates allergy object to what is checked on screen
function updateAllergies() {
    var $ = document.id;

    allergies.dairy = $("dairyBox").checked;
    allergies.eggs = $("eggBox").checked;
    allergies.gluten = $("glutenBox").checked;
    allergies.peanut = $("peanutBox").checked;
    allergies.treeNut = $("treeNutBox").checked;
    allergies.seafood = $("seafoodBox").checked;
    allergies.shellfish = $("shellfishBox").checked;
    allergies.soy = $("soyBox").checked;
}

function generateIngredientURL() {
    var searchURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=4483dfcaf2b64ab798b9683fabb17a1a&ingredients="
    for (var i = 0; i < ingredientList.length; i++) {
        searchURL += (ingredientList[i] + ",+")
    }
    searchURL = searchURL.slice(0, -2);
    searchURL += "&number=10"
    return searchURL;
}

function generateRecipeSearchURL(searchTerm) {
    var searchURL = "https://api.spoonacular.com/recipes/search?apiKey=4483dfcaf2b64ab798b9683fabb17a1a&query=" + searchTerm
    var hasAllergies = false;

    Object.keys(allergies).forEach(function (key) {
        if (allergies[key] === true) {
            hasAllergies = true;
        }
    });

    if (hasAllergies === true) {
        searchURL += "&intolerances="
        if (allergies.dairy === true) {
            searchURL += "dairy,+"
        }
        if (allergies.eggs === true) {
            searchURL += "egg,+"
        }
        if (allergies.gluten === true) {
            searchURL += "gluten,+"
        }
        if (allergies.peanut === true) {
            searchURL += "peanut,+"
        }
        if (allergies.treeNut === true) {
            searchURL += "tree+nut,+"
        }
        if (allergies.seafood === true) {
            searchURL += "seafood,+"
        }
        if (allergies.shellfish === true) {
            searchURL += "shellfish,+"
        }
        if (allergies.soy === true) {
            searchURL += "soy,+"
        }
        searchURL = searchURL.slice(0, -2);
    }

    return searchURL;
}

function renderSearchResults(recipes) {
    document.id("searchResults").empty();
    console.log(recipes);

    if (mode === "recipe") {
        for (var i = 0; i < recipes.results.length; i++) {

            var recipeDiv = new Element("div");
            recipeDiv.set("recipeId")
            recipeDiv.addClass("row recipe")

            var recipeImg = new Element("img");
            recipeImg.addClass("col s12 m4 l3");
            recipeImg.set("src", (recipes.baseUri + recipes.results[i].image));
            recipeImg.set("alt", recipes.results[i].title);
            recipeDiv.grab(recipeImg);
            console.log(recipeDiv);

            var recipeTitleDiv = new Element("div");
            recipeTitleDiv.addClass("col s12 m6")
            var recipeTitleA = new Element("a");
            recipeTitleA.set("href", recipes.results[i].sourceUrl);
            var recipeTitleH = new Element("h5");
            recipeTitleH.textContent = recipes.results[i].title;
            recipeTitleA.grab(recipeTitleH);
            recipeTitleDiv.grab(recipeTitleA);

            var saveButton = new Element("button.saveButton");
            saveButton.set("type", "button");
            saveButton.set("index", i);
            saveButton.textContent = "save";
            recipeTitleDiv.grab(saveButton);

            var readyIn = new Element("p");
            readyIn.textContent = ("Ready In: " + recipes.results[i].readyInMinutes + " minutes");
            recipeTitleDiv.grab(readyIn);

            var serves = new Element("p");
            serves.textContent = ("Serves " + recipes.results[i].servings);
            recipeTitleDiv.grab(serves);

            recipeDiv.grab(recipeTitleDiv);

            document.id("searchResults").grab(recipeDiv);
        }
    }

    if (mode === "ingredient") {
        for (var i = 0; i < recipes.length; i++) {
            var queryURL = "https://api.spoonacular.com/recipes/" + recipes[i].id + "/information?apiKey=4483dfcaf2b64ab798b9683fabb17a1a";
            var recipe;
            jQuery.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);
                var recipeDiv = new Element("div");
                recipeDiv.set("recipeId")
                recipeDiv.addClass("row recipe")

                var recipeImg = new Element("img");
                recipeImg.addClass("col s12 m4 l3");
                recipeImg.set("src", (response.image));
                recipeImg.set("alt", response.title);
                recipeDiv.grab(recipeImg);
                console.log(recipeDiv);

                var recipeTitleDiv = new Element("div");
                recipeTitleDiv.addClass("col s12 m6")
                var recipeTitleA = new Element("a");
                recipeTitleA.set("href", response.sourceUrl);
                var recipeTitleH = new Element("h5");
                recipeTitleH.textContent = response.title;
                recipeTitleA.grab(recipeTitleH);
                recipeTitleDiv.grab(recipeTitleA);

                var saveButton = new Element("button.saveButton");
                saveButton.set("type", "button");
                saveButton.set("index", i);
                saveButton.textContent = "save";
                recipeTitleDiv.grab(saveButton);

                var readyIn = new Element("p");
                readyIn.textContent = ("Ready In: " + response.readyInMinutes + " minutes");
                recipeTitleDiv.grab(readyIn);

                var serves = new Element("p");
                serves.textContent = ("Serves " + response.servings);
                recipeTitleDiv.grab(serves);

                recipeDiv.grab(recipeTitleDiv);

                document.id("searchResults").grab(recipeDiv);
            });
        }
    }
}