function loadPage(page) {
    let iframe = document.getElementById("contentFrame");
    iframeaElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}