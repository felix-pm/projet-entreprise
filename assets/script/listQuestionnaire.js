const container = document.querySelector(".allQuestionnaire");

function getQuestionnaire() {
  const listQuestionnaire = JSON.parse(data.json);
  if (!listQuestionnaire) {
    return;
  }
  return listQuestionnaire;
}

function createLinkQuestionnaire(container, listQuestionnaire) {
  listQuestionnaire.forEach((questionnaire) => {
    const link = document.createElement("a");
    link.textContent = questionnaire["Title"];
    link.href = "questionnaire.html";
    container.appendChild(link);
  });
}

const list = getQuestionnaire();
createLinkQuestionnaire(container, list);
