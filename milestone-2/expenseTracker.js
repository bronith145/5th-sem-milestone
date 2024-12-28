const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
const port = 3000;

app.use(bodyParser.json());


let expenses = [];


const createResponse = (status, data = null, error = null) => ({
    status,
    data,
    error,
});


app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
        return res
            .status(400)
            .json(createResponse('fail', null, 'All fields (category, amount, date) are required.'));
    }

    const newExpense = { id: expenses.length + 1, category, amount: parseFloat(amount), date };
    expenses.push(newExpense);
    res.status(201).json(createResponse('success', newExpense));
});

// GET /expenses - Retrieve expenses with optional filters
app.get('/expenses', (req, res) => {
    const { category, startDate, endDate } = req.query;

    let filteredExpenses = expenses;

    // Filter by category
    if (category) {
        filteredExpenses = filteredExpenses.filter((expense) => expense.category === category);
    }

    // Filter by date range
    if (startDate || endDate) {
        filteredExpenses = filteredExpenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            const isAfterStartDate = startDate ? expenseDate >= new Date(startDate) : true;
            const isBeforeEndDate = endDate ? expenseDate <= new Date(endDate) : true;
            return isAfterStartDate && isBeforeEndDate;
        });
    }

    res.json(createResponse('success', filteredExpenses));
});

app.get('/expenses/analysis', (req, res) => {
    const categoryTotals = expenses.reduce((totals, expense) => {
        if (!totals[expense.category]) {
            totals[expense.category] = 0;
        }
        totals[expense.category] += expense.amount;
        return totals;
    }, {});

    const highestCategory = Object.entries(categoryTotals).reduce(
        (max, [category, total]) => (total > max.total ? { category, total } : max),
        { category: null, total: 0 }
    );

    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json(
        createResponse('success', {
            totalSpending,
            categoryTotals,
            highestCategory,
        })
    );
});

// CRON Job for Weekly Summary
cron.schedule('0 0 * * 0', () => {
    const weeklyExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return expenseDate >= oneWeekAgo;
    });

    const totalWeeklySpending = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    console.log('Weekly Summary:', { totalWeeklySpending, weeklyExpenses });
});

app.listen(port, () => {
    console.log(`Expense Tracker API running on http://localhost:${3000}`);
});
