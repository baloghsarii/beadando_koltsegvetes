// Adatok betöltése indításkor
const savedData = JSON.parse(localStorage.getItem('budgetItems')) || [];

// --- 1. KATEGÓRIA ELLENŐRZÉSE ---
function checkCategory() {
    const categorySelect = document.getElementById('itemCategory');
    const otherDiv = document.getElementById('otherInputContainer');
    
    // Ha az "Egyéb" van kiválasztva, megjelenítjük a beviteli mezőt
    if (categorySelect.value === 'other') {
        otherDiv.style.display = 'block';
    } else {
        otherDiv.style.display = 'none';
    }
}

// --- 2. ŰRLAP MENTÉSE ---
const form = document.getElementById('budgetForm');

if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Ne töltődjön újra az oldal

        // Mezők behívása
        const amountInput = document.getElementById('itemAmount');
        const dateInput = document.getElementById('itemDate');
        const catSelect = document.getElementById('itemCategory');
        const customNameInput = document.getElementById('customName');
        const paymentSelect = document.getElementById('paymentMethod');
        const noteInput = document.getElementById('note');
        
        // Rádió gomb értékének megszerzése
        const radios = document.getElementsByName('itemType');
        let typeVal = 'expense';
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                typeVal = radios[i].value;
            }
        }

        // --- VALIDÁLÁS (Hibaellenőrzés) ---
        let hibaVan = false;

        // Összeg ellenőrzés
        if (amountInput.value === '' || amountInput.value <= 0) {
            document.getElementById('err-amount').style.display = 'block';
            amountInput.style.borderColor = '#e57373';
            hibaVan = true;
        } else {
            document.getElementById('err-amount').style.display = 'none';
            amountInput.style.borderColor = '#ffe0e9';
        }

        // Egyéb név ellenőrzés (ha az van kiválasztva)
        if (catSelect.value === 'other' && customNameInput.value.trim() === '') {
            customNameInput.style.borderColor = '#e57373';
            alert('Kérlek írd be az egyéb kategória nevét!'); // Egyszerű hibaüzenet
            hibaVan = true;
        }

        if (hibaVan) return;

        // --- NÉV ÉS KATEGÓRIA MEGHATÁROZÁSA ---
        // Itt történik a varázslat a statisztikához!
        
        let vegsoKategoria = '';
        let vegsoNev = '';

        if (catSelect.value === 'other') {
            // Ha egyéni, akkor a KATEGÓRIA is az lesz, amit beírt (pl. "Ajándék")
            // Így a diagramon külön szelet lesz neki!
            vegsoKategoria = customNameInput.value; 
            vegsoNev = customNameInput.value;
        } else {
            // Ha fix lista, akkor a kód (pl. 'food') a kategória
            vegsoKategoria = catSelect.value;
            // A név pedig a magyar felirat
            vegsoNev = catSelect.options[catSelect.selectedIndex].text;
        }

        const ujTetel = {
            id: Date.now(),
            name: vegsoNev,
            amount: parseInt(amountInput.value),
            date: dateInput.value || new Date().toISOString().split('T')[0],
            type: typeVal,
            payment: paymentSelect.value,
            category: vegsoKategoria // Ez alapján rajzol a diagram
        };

        // Mentés
        savedData.push(ujTetel);
        localStorage.setItem('budgetItems', JSON.stringify(savedData));
        
        // Visszajelzés
        document.getElementById('successMessage').style.display = 'block';
        form.reset();
        checkCategory(); // Visszaállítjuk a mezőt
        
        setTimeout(function() {
            document.getElementById('successMessage').style.display = 'none';
        }, 3000);
    });
}

// --- 3. LISTA GENERÁLÁSA (Lista oldal) ---
const tableBody = document.querySelector('#expenseTable tbody');

if (tableBody) {
    // Dátum szerinti rendezés
    savedData.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    for (let i = 0; i < savedData.length; i++) {
        const item = savedData[i];
        
        const sor = document.createElement('tr');
        
        let szin = '#e57373'; // Pirosas (kiadás)
        let elojel = '-';
        if (item.type === 'income') {
            szin = '#66bb6a'; // Zöldes (bevétel)
            elojel = '+';
        }

        sor.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${item.name}</strong></td>
            <td style="color: ${szin}; font-weight:bold;">${elojel} ${item.amount} Ft</td>
            <td>${item.payment === 'card' ? '💳' : '💵'}</td>
        `;
        
        tableBody.appendChild(sor);
    }
    
    // Törlés gomb funkciója
    const clearBtn = document.getElementById('clearBtn');
    if(clearBtn) {
        clearBtn.onclick = function() {
            if(confirm('Biztosan törölni akarod az összes előzményt?')) {
                localStorage.removeItem('budgetItems');
                location.reload();
            }
        }
    }
}