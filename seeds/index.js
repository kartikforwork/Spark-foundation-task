const mongoose = require('mongoose');
const customers = require('./customers');
const CustomerDetails = require('../models/customer');
const TransactionDetails = require('../models/transaction');
mongoose.connect('mongodb://127.0.0.1:27017/bank')
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.log(e);
    });



const seedDB = async () => {
    await CustomerDetails.deleteMany({})
    await TransactionDetails.deleteMany({})
    for (let customerData of customers) {
        const customer = new CustomerDetails({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            amountAvailable: customerData.amountAvailable,
            account:customerData.account,
            img:customerData.img
        });
        console.log(customer)
        await customer.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
