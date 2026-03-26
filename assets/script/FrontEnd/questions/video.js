import { getElement } from "./getElement";

const path = path.join(app.getPath("documents", "psy/mes-donnees"));

const baliseVideo = document.getElementById("baliseVideo");
baliseVideo.src = getElement(path, getTitle, "video");

const btnVideo = document.getElementById("video");
btnVideo.addEventListener("click", (event) => {});
