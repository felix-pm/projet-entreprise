export function sortJSON(itemName, yieldNumber) {
  if (!itemName) {
    return [];
  }

  //   Filtre selon le numéro du Yield puis la fonction sort tri dans l'ordre croissant,
  return Object.keys(itemName)
    .filter((key) => key.startsWith(yieldNumber))
    .sort((a, b) => {
      // L'expression régulière cherche une suite de chiffre à la fin de la chaine de caractères puis le transforme en int
      const numberA = parseInt(a.match(/\d+$/));
      const numberB = parseInt(b.match(/\d+$/));

      return numberA - numberB;
    });
}
