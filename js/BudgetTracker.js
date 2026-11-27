
const BUDGET_KEY = "lakbay-budget";
const EXPENSES_KEY = "lakbay-expenses";

// Get saved budget
export function getBudget() {
    return Number(localStorage.getItem(BUDGET_KEY)) || 0;
}

// Save budget
export function saveBudget(amount) {
    localStorage.setItem(BUDGET_KEY, amount);
}

// Get saved expenses
export function getExpenses() {
    return JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [];
}

// Add expense
export function addExpense(name, amount) {
    const expenses = getExpenses();

    const expense = {
        id: crypto.randomUUID(),
        name,
        amount: Number(amount),
        date: new Date().toLocaleDateString()
    };

    expenses.push(expense);

    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));

    return expense;
}

// Delete expense
export function deleteExpense(id) {
    const expenses = getExpenses().filter(
        (expense) => expense.id !== id
    );

    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

// Calculate total expenses
export function getTotalExpenses() {
    return getExpenses().reduce(
        (total, expense) => total + expense.amount,
        0
    );
}

// Calculate remaining budget
export function getRemainingBudget() {
    return getBudget() - getTotalExpenses();
}
