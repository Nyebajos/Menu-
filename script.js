// Mot de passe admin (simple pour démonstration)
const ADMIN_PASSWORD = "admin123";

// Fonction pour obtenir la date du jour au format YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Fonction pour sauvegarder une commande dans l'historique
function saveOrderToHistory(order, total) {
    const today = getTodayDate();
    let dailyOrders = JSON.parse(localStorage.getItem('dailyOrders') || '{}');
    
    if (!dailyOrders[today]) {
        dailyOrders[today] = [];
    }
    
    dailyOrders[today].push({
        items: order,
        total: total,
        timestamp: new Date().toLocaleTimeString()
    });
    
    localStorage.setItem('dailyOrders', JSON.stringify(dailyOrders));
}

// Fonction pour charger l'historique des commandes du jour
function loadTodayOrders() {
    const today = getTodayDate();
    const dailyOrders = JSON.parse(localStorage.getItem('dailyOrders') || '{}');
    return dailyOrders[today] || [];
}

function showUserView() {
    document.getElementById('user-view').style.display = 'block';
    document.getElementById('admin-view').style.display = 'none';
    document.getElementById('btn-user').disabled = true;
    document.getElementById('btn-admin').disabled = false;
}

function showAdminView() {
    document.getElementById('user-view').style.display = 'none';
    document.getElementById('admin-view').style.display = 'block';
    document.getElementById('btn-user').disabled = false;
    document.getElementById('btn-admin').disabled = true;
    
    // Charger toutes les commandes du jour
    const adminList = document.getElementById('adminCommandeListe');
    const todayOrders = loadTodayOrders();
    
    adminList.innerHTML = '';
    let totalJour = 0;
    
    todayOrders.forEach((order, index) => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-entry';
        orderElement.innerHTML = `
            <h4>Commande #${index + 1} (${order.timestamp})</h4>
            <ul>${order.items}</ul>
            <div class="order-total">Total: ${order.total}</div>
            <hr>
        `;
        adminList.appendChild(orderElement);
        totalJour += parseFloat(order.total.replace(/[^\d.]/g, ''));
    });
    
    // Mettre à jour le total journalier
    const adminTotal = document.getElementById('adminTotal');
    adminTotal.innerHTML = `Total journalier: ${totalJour.toFixed(2)} $<br>Nombre de commandes: ${todayOrders.length}`;
}

function adminLogin() {
    const password = prompt("Entrez le mot de passe admin:");
    if (password === ADMIN_PASSWORD) {
        showAdminView();
    } else {
        alert("Mot de passe incorrect!");
    }
}

function clearOrders() {
    if (confirm("Voulez-vous vraiment vider l'historique des commandes du jour ?")) {
        // Vider l'historique du jour dans le localStorage
        const today = getTodayDate();
        let dailyOrders = JSON.parse(localStorage.getItem('dailyOrders') || '{}');
        dailyOrders[today] = [];
        localStorage.setItem('dailyOrders', JSON.stringify(dailyOrders));
        
        // Rafraîchir l'affichage admin
        document.getElementById('adminCommandeListe').innerHTML = '';
        document.getElementById('adminTotal').textContent = 'Total journalier: 0 $\nNombre de commandes: 0';
    }
}

function ajouterCommandeDepuisSelect(categorie, idSelect) {
    const select = document.getElementById(idSelect);
    const [type, prixStr] = select.value.split('-');
    const prix = parseInt(prixStr);

    const nomRecette = select.options[select.selectedIndex].text;

    const commandeListe = document.getElementById("CommandeListe");
    const nouvelElement = document.createElement("li");
    nouvelElement.textContent = `${nomRecette} (${categorie}) - ${prix} $  ✅`;
    commandeListe.appendChild(nouvelElement);

    const totalElement = document.getElementById("totalPrix");
    let totalActuel = parseInt(totalElement.textContent.replace(/[^\d]/g, "")) || 0;
    totalActuel += prix;
    totalElement.textContent = `Total: ${totalActuel} $`;
}

function validerCommande() {
    const totalElement = document.getElementById("totalPrix");
    const commandeList = document.getElementById("CommandeListe");
    const total = parseInt(totalElement.textContent.replace(/[^\d]/g, "")) || 0;

    if (total === 0) {
        alert("Votre commande est vide !");
        return;
    }

    // Sauvegarder la commande dans l'historique
    saveOrderToHistory(commandeList.innerHTML, totalElement.textContent);
    
    // Vider la commande actuelle
    commandeList.innerHTML = '';
    totalElement.textContent = 'Total: 0 $';
    
    // Rediriger vers la confirmation
    window.location.href = "confirmation.html";
}
