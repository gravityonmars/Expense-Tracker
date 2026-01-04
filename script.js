const mockUser = { email: "user@test.com", password: "1234" };
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let myChart = null;

const loginForm = document.getElementById('login-form');
const expenseForm = document.getElementById('expense-form');
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const expenseList = document.getElementById('expense-list');
const logoutBtn = document.getElementById('logout-btn');


window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
});

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('user-display').innerText = `Hello, ${mockUser.email}`;
    renderApp();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    if (email === mockUser.email && pass === mockUser.password) {
        localStorage.setItem('isLoggedIn', 'true');
        showDashboard();
    } else {
        alert("Invalid credentials!");
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    dashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});


expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value.trim();

    const newExpense = {
        id: Date.now(),
        amount: amount,
        category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    };

    expenses.push(newExpense);
    saveAndRender();
    expenseForm.reset();
});

function getCategoryTotals() {
    return expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});
}

function updateChart() {
    const totals = getCategoryTotals();
    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(totals),
            datasets: [{
                data: Object.values(totals),
                backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'],
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderApp() {
    expenseList.innerHTML = expenses.slice().reverse().map(ex => `
        <li>
            <span><strong>${ex.category}</strong></span>
            <span>$${ex.amount.toFixed(2)}</span>
        </li>
    `).join('');
    updateChart();
}

function saveAndRender() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderApp();
}