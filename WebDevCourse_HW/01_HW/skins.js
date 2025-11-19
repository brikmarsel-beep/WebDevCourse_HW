// A list of all available SKIN CSS files
const skins = [
    "SKINS/skin1.css",
    "SKINS/skin2.css"
    // You can add more skins here, e.g. "SKINS/skin3.css"
];

let currentSkinIndex = 0;

function changeSkin() {
    // Get the <link> element that controls the page stylesheet
    const link = document.getElementById("skinStylesheet");

    // Move to the next skin (and loop back to the first)
    currentSkinIndex = (currentSkinIndex + 1) % skins.length;

    // Replace the CSS file by updating the href attribute
    link.href = skins[currentSkinIndex];
}

// Wait until the page is fully loaded, then connect the button
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("changeSkinBtn");
    btn.addEventListener("click", changeSkin);
});
