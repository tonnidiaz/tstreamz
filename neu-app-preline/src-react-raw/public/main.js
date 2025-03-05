console.log("Hello main.js")
const str = `<script src="http://localhost:40247/__neutralino_globals.js"></script>`
const tempDiv = document.createElement("div");
tempDiv.innerHTML = str; // Convert string to HTML

const scriptTag = tempDiv.querySelector("script"); 
if (scriptTag) {
    const sc = document.createElement("script")
    sc.src = scriptTag.src;
    document.head.appendChild(sc)
}