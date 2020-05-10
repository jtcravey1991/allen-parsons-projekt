jQuery.noConflict();

var ingredientList = [];


(function ($) {
    $("addButton").addEvent("click", function (event) {
        event.preventDefault();
        var newIngredient = $("addIngredientInput").value;
        checkIngredient(newIngredient);
    });
})(document.id);

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
            ingredientList.push(document.id("addIngredientInput").value);
            document.id("addIngredientInput").value = "";
            renderIngredients();
        }
    })
}

function wrongIngredient() {
    var $ = document.id;

    $("addIngredientInput").value = "";
    $("addIngredientInput").setProperty("placeholder", "Sorry, not found. Try again.");
    setTimeout(function () {
        $("addIngredientInput").setProperty("placeholder", "Ingredient")
    }, 2000)
}

function renderIngredients() {
    document.id("currentIngredientsList").empty();
    for (var i = 0; i < ingredientList.length; i++) {
        var li = new Element("li");
        li.textContent = ingredientList[i];
        
        var deleteButton = new Element("button");
        deleteButton.textContent = "delete";
        deleteButton.id = i;

        li.grab(deleteButton);
        document.id("currentIngredientsList").grab(li);
    }
}