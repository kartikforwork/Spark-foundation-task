const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejsMate = require('ejs-mate')
const app = express()

app.engine('ejs',ejsMate)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/bank')
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.log(e);
    });

const CustomerDetails = require('./models/customer.js');
const TransactionDetails = require('./models/transaction.js');

app.get('/sparkbank', (req, res) => {
    res.render('home')
})

app.get('/sparkbank/oldTransactions', async (req, res) => {
    const TransactionData = await TransactionDetails.find({})
    console.log(TransactionData)
    res.render('history', { TransactionData })
})

app.get('/sparkbank/customers', async (req, res) => {
    const CustomerData = await CustomerDetails.find({})
    res.render('customers', { CustomerData })
})

app.get('/sparkbank/customers/:id', async (req, res) => {
    const oneCustomerData = await CustomerDetails.findById(req.params.id)
    console.log(oneCustomerData)
    res.render('show', { oneCustomerData})
})

app.get('/sparkbank/customers/:id/transfer', async (req, res) => {
    const oneCustomerData = await CustomerDetails.findById(req.params.id)
    const otherCustomerData = await CustomerDetails.find({ _id: { $ne: oneCustomerData._id } });
    res.render('transfer', { oneCustomerData, otherCustomerData })
})

app.post('/sparkbank/customers/:id', async (req, res) => {
    const { customer, amount } = req.body;

    await CustomerDetails.updateOne(
        { _id: req.params.id },
        { $inc: { amountAvailable: -amount } }
    );
    await CustomerDetails.updateOne(
        { _id: customer },
        { $inc: { amountAvailable: +amount } }
    );


    const senderCustomer = await CustomerDetails.findById(req.params.id);
    const receiverCustomer = await CustomerDetails.findById(customer);

    const transactionDetails = new TransactionDetails({
        sender: senderCustomer.name,
        receiver: receiverCustomer.name,
        amount: amount
    });

    await transactionDetails.save();


    res.redirect('/sparkbank/customers')
})

app.listen(3000, () => {
    console.log('connetion open')
})