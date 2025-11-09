function ajouterCommandeDepuisSelect(categorie, idSelect) {
    const select = document.getElementById(idSelect);
    const [type, prixStr] = select.value.split('-');
    const prix = parseInt(prixStr); // convertir en nombre

    const nomRecette = select.options[select.selectedIndex].text; // ✅ Récupère le texte affiché

    const commandeListe = document.getElementById("CommandeListe");
    const nouvelElement = document.createElement("li");

    // ✅ Affiche correctement le nom de la recette, la catégorie et le prix
    nouvelElement.textContent = `${nomRecette} (${categorie}) - ${prix} $  ✅`;

    commandeListe.appendChild(nouvelElement);

    const totalElement = document.getElementById("totalPrix");
    let totalActuel = parseInt(totalElement.textContent.replace(/[^\d]/g, "")) || 0;
    totalActuel += prix;
    totalElement.textContent = `Total: ${totalActuel} $`;
}

function validerCommande() {
    const totalElement = document.getElementById("total");
    const total = parseFloat(totalElement.textContent);

    if (total === 0) {
        alert("Votre commande est vide !");
    } else {
        window.location.href = "confirmation.html";
    }
}