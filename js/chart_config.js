document.addEventListener('DOMContentLoaded', function() {
    const items = JSON.parse(localStorage.getItem('budgetItems')) || [];
    
    const expenses = items.filter(function(item) {
        return item.type === 'expense';
    });

    if (expenses.length === 0) {
        document.querySelector('.chart-container').innerHTML = 
            '<p style="text-align:center; color:#888;">Még nincs rögzített kiadásod! 🌸<br>Adj hozzá tételeket a Kalkulátor oldalon.</p>';
        return;
    }

    const categories = {};
    let totalExpense = 0;

    expenses.forEach(function(item) {
        if (!categories[item.category]) {
            categories[item.category] = 0;
        }
        categories[item.category] += item.amount;
        totalExpense += item.amount;
    });

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

    const listDiv = document.getElementById('percentageList');
    listDiv.innerHTML = '<h3 style="color:var(--header-footer-bg); margin-bottom:15px;">Részletek:</h3>';

    for (const key in categories) {
        const amount = categories[key];
        
        const labelName = names[key] || key; 
        
        labels.push(labelName);
        dataValues.push(amount);

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
        type: 'doughnut', 
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#ffab91', 
                    '#b39ddb', 
                    '#80cbc4', 
                    '#fff59d', 
                    '#90caf9', 
                    '#f48fb1', 
                    '#bcaaa4', 
                    '#ffe082', 
                    '#ce93d8'  
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