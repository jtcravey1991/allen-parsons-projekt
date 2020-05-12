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
        generateURL();
    }
});

// submits an ajax to check if added ingredient is supported
function checkIngredient(term) {
    var checkedIngredient = term.toLowerCase();
    jQuery.ajax({
        url: "https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=4483dfcaf2b64ab798b9683fabb17a1a&query=" + checkedIngredient + "&number=1",
        method: "GET"
    }).then( function (response) {
        console.log(response);
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

//Dark Mode
jQuery(".inner-switch").on("click", function () {
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
    } else {
        jQuery("body").addClass("dark");
        jQuery(".inner-switch").text("ON");
    }
});
function generateURL() {
    var searchURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=4483dfcaf2b64ab798b9683fabb17a1a&ingredients="
    for (var i = 0; i < ingredientList.length; i++) {
        searchURL += (ingredientList[i] + ",+")
    }
    searchURL = searchURL.slice(0, -2);
    searchURL += "&number=10"
    
}
