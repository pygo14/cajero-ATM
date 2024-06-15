const accounts = {
    'pedro': { password: '123456', balance: 500, transactions: [] },
    'juan': { password: '78910', balance: 300, transactions: [] }
};

let currentAccount = null;

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const account = document.getElementById('account').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    
    if (accounts[account] && accounts[account].password === password) {
        currentAccount = account;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('atmContainer').style.display = 'block';
        updateBalance();
    } else {
        message.style.color = 'red';
        message.textContent = 'Cuenta o contraseña incorrecta. Inténtalo de nuevo.';
    }
});

function updateBalance() {
    document.getElementById('balance').textContent = `$${accounts[currentAccount].balance}`;
}

document.getElementById('depositBtn').addEventListener('click', function() {
    showTransactionForm('deposit');
});

document.getElementById('withdrawBtn').addEventListener('click', function() {
    showTransactionForm('withdraw');
});

document.getElementById('transferBtn').addEventListener('click', function() {
    showTransferForm();
});

document.getElementById('balanceBtn').addEventListener('click', function() {
    alert(`Tu saldo actual es: $${accounts[currentAccount].balance}`);
});

document.getElementById('statementBtn').addEventListener('click', function() {
    showStatement();
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('atmContainer').style.display = 'none';
    document.getElementById('account').value = '';
    document.getElementById('password').value = '';
    document.getElementById('message').textContent = '';
    currentAccount = null;
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const action = document.getElementById('transactionForm').dataset.action;

    if (action === 'deposit') {
        accounts[currentAccount].balance += amount;
        accounts[currentAccount].transactions.push({ type: 'Depósito', amount: amount, date: new Date().toLocaleString() });
    } else if (action === 'withdraw') {
        if (amount <= accounts[currentAccount].balance) {
            accounts[currentAccount].balance -= amount;
            accounts[currentAccount].transactions.push({ type: 'Retiro', amount: amount, date: new Date().toLocaleString() });
        } else {
            alert('Fondos insuficientes');
            return;
        }
    }

    updateBalance();
    document.getElementById('transactionForm').style.display = 'none';
    document.getElementById('amount').value = '';
});

document.getElementById('transferForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const transferAccount = document.getElementById('transferAccount').value;
    const transferAmount = parseFloat(document.getElementById('transferAmount').value);

    if (accounts[transferAccount] && transferAmount <= accounts[currentAccount].balance) {
        accounts[currentAccount].balance -= transferAmount;
        accounts[transferAccount].balance += transferAmount;
        const date = new Date().toLocaleString();
        accounts[currentAccount].transactions.push({ type: 'Transferencia Enviada', amount: transferAmount, to: transferAccount, date: date });
        accounts[transferAccount].transactions.push({ type: 'Transferencia Recibida', amount: transferAmount, from: currentAccount, date: date });
        updateBalance();
        document.getElementById('transferForm').style.display = 'none';
        document.getElementById('transferAccount').value = '';
        document.getElementById('transferAmount').value = '';
        alert('Transferencia exitosa');
    } else {
        alert('Cuenta destino inválida o fondos insuficientes');
    }
});

function showTransactionForm(action) {
    document.getElementById('transactionForm').dataset.action = action;
    document.getElementById('transactionForm').style.display = 'block';
    document.getElementById('transferForm').style.display = 'none';
    document.getElementById('statementContainer').style.display = 'none';
}

function showTransferForm() {
    document.getElementById('transferForm').style.display = 'block';
    document.getElementById('transactionForm').style.display = 'none';
    document.getElementById('statementContainer').style.display = 'none';
}

function showStatement() {
    document.getElementById('statementContainer').style.display = 'block';
    document.getElementById('transactionForm').style.display = 'none';
    document.getElementById('transferForm').style.display = 'none';
    
    const statementList = document.getElementById('statementList');
    statementList.innerHTML = '';

    const transactions = accounts[currentAccount].transactions;
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        if (transaction.type.includes('Transferencia')) {
            li.textContent = `${transaction.date} - ${transaction.type} de $${transaction.amount} ${transaction.to ? 'a la cuenta ' + transaction.to : 'de la cuenta ' + transaction.from}`;
        } else {
            li.textContent = `${transaction.date} - ${transaction.type} de $${transaction.amount}`;
        }
        statementList.appendChild(li);
    });
}
