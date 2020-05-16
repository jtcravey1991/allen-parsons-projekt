// global and DOM variables
var savedRecipes = [];
var savedRecipeDisplay = document.getElementById("savedRecipeDisplay");

initialize();

// initializes nav bar
jQuery(document).ready(function(){
    jQuery('.sidenav').sidenav();
  });

// initializes the page
function initialize() {
    loadRecipes();
    renderRecipes();
    if (localStorage.getItem("switch") == "light" ){
        if (jQuery("body").hasClass("dark")) {
            jQuery("body").removeClass("dark");
            jQuery(".inner-switch").text("OFF");
        }
    }
    else if (localStorage.getItem("switch") == "dark"){
        jQuery("body").addClass("dark");
        jQuery(".inner-switch").text("ON");
    }
    
    else {
        if (jQuery("body").hasClass("dark")) {
            jQuery("body").removeClass("dark");
            jQuery(".inner-switch").text("OFF");
        }
    }
}

// listener for deleting recipes
savedRecipeDisplay.addEventListener("click", function () {
    if (event.target.type === "button") {
        event.preventDefault();
        var index = event.target.id;
        savedRecipes.splice(index, 1);
        saveRecipes();
        renderRecipes();
    }
})

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

// renders saved recipes to the page
function renderRecipes() {
    document.id("savedRecipeDisplay").empty();
    if (savedRecipes.length !== 0) {
        document.id("noRecipes").empty();
    }
    if (savedRecipes.length === 0) {
        document.id("noRecipes").firstElementChild.textContent = ("You have no saved recipes.");
    }
    for (var i = 0; i < savedRecipes.length; i++) {
        var recipeDiv = new Element("div.row");
        recipeDiv.addClass("savedRecipe");

        var recipeImg = new Element("img");
        recipeImg.addClass("col s12 m4 l3");
        recipeImg.set("src", (savedRecipes[i].img));
        recipeImg.set("alt", savedRecipes[i].title);
        recipeDiv.grab(recipeImg);

        var recipeTitleDiv = new Element("div");
        recipeTitleDiv.addClass("col s12 m6")
        var recipeTitleA = new Element("a");
        recipeTitleA.set("href", savedRecipes[i].source);
        var recipeTitleH = new Element("h5");
        recipeTitleH.textContent = savedRecipes[i].title;
        recipeTitleA.grab(recipeTitleH);
        recipeTitleDiv.grab(recipeTitleA);

        var saveButton = new Element("button.saveButton");
        saveButton.addClass("btn")
        saveButton.set("type", "button");
        saveButton.set("id", i);
        saveButton.textContent = "delete";
        recipeTitleDiv.grab(saveButton);

        recipeDiv.grab(recipeTitleDiv);

        document.id("savedRecipeDisplay").grab(recipeDiv);
    }
}

jQuery(".inner-switch").on("click", function () {
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
        localStorage.setItem("switch", "light")

    } else {
        jQuery("body").addClass("dark");
        jQuery(".inner-switch").text("ON");
        localStorage.setItem("switch", "dark")

    }
});