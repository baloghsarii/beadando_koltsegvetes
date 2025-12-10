document.addEventListener('DOMContentLoaded', function() {
    // Adatok betöltése
    const items = JSON.parse(localStorage.getItem('budgetItems')) || [];
    
    // Csak a KIADÁSOKAT nézzük
    const expenses = items.filter(function(item) {
        return item.type === 'expense';
    });

    // Ha nincs adat
    if (expenses.length === 0) {
        document.querySelector('.chart-container').innerHTML = 
            '<p style="text-align:center; color:#888;">Még nincs rögzített kiadásod! 🌸<br>Adj hozzá tételeket a Kalkulátor oldalon.</p>';
        return;
    }

    // Összegzés kategóriák szerint
    const categories = {};
    let totalExpense = 0;

    expenses.forEach(function(item) {
        // Most már az item.category tartalmazza a saját nevet is (pl. "Ajándék")
        if (!categories[item.category]) {
            categories[item.category] = 0;
        }
        categories[item.category] += item.amount;
        totalExpense += item.amount;
    });

    // Fordító szótár a fix kategóriákhoz
    const names = {
        'food': 'Élelmiszer',
        'entertainment': 'Szórakozás',
        'housing': 'Lakhatás',
        'fuel': 'Üzemanyag',
        'travel': 'Utazás',
        'beauty': 'Szépségápolás',
        'subscriptions': 'Előfizetések'
    };

    const labels = [];
    const dataValues = [];

    // Lista előkészítése a diagram alá
    const listDiv = document.getElementById('percentageList');
    listDiv.innerHTML = '<h3 style="color:var(--header-footer-bg); margin-bottom:15px;">Részletek:</h3>';

    for (const key in categories) {
        const amount = categories[key];
        
        // Ha benne van a szótárban, akkor magyar nevét használjuk,
        // ha nincs (mert egyéni), akkor magát a kulcsot (pl. "Ajándék")
        const labelName = names[key] || key; 
        
        labels.push(labelName);
        dataValues.push(amount);

        // Százalék
        const percent = (amount / totalExpense * 100).toFixed(1);

        listDiv.innerHTML += `
            <div class="stat-item">
                <span style="font-weight:500;">${labelName}</span>
                <strong style="color:var(--header-footer-bg);">${percent}%</strong>
            </div>
        `;
    }

    // Diagram
    const ctx = document.getElementById('myChart');
    
    new Chart(ctx, {
        type: 'doughnut', // Fánk diagram (modernebb)
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                // Sok pasztell szín, hogy az egyéni kategóriáknak is jusson
                backgroundColor: [
                    '#ffab91', // Barack
                    '#b39ddb', // Lila
                    '#80cbc4', // Türkiz
                    '#fff59d', // Sárga
                    '#90caf9', // Kék
                    '#f48fb1', // Rózsaszín
                    '#e6ee9c', // Lime
                    '#bcaaa4', // Barna
                    '#ffe082', // Narancs
                    '#ce93d8'  // Mályva
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Quicksand'
                        }
                    }
                }
            }
        }
    });
});