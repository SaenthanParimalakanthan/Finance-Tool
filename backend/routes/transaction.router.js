let Transaction = require('../models/transaction.model');

const router = require('express').Router();

const axios = require('axios');





router.get('/getHistory', async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id });


  return res.json(transactions);

});

router.post('/addTransaction', async (req, res) => {
  try {
    let { transactionTitle, transactionAmount,transactionDate, transactionType } = req.body;
    console.log(transactionAmount+" "+transactionTitle+" "+transactionDate+" "+transactionType);
    if (!transactionTitle || !transactionType || !transactionAmount || !transactionDate) {
      return res.status(400).json({ Error: "Not all fields have been entered" });

    }
    // if(typeof transactionAmount != 'number'){
    //   return res.status(400).json({ Error: "Enter amount as a number" });

    // }

    const newTransaction = new Transaction({
      userId: req.user._id,
      transactionTitle,
      transactionType,
      transactionAmount,
      transactionDate,
    });

    newTransaction.save()
      .then(transaction => res.json(transaction))
      .catch(err => res.status(400).json({ Error: err }));
  } catch (err) {
    return res.status(500).json({ Error: err });

  }

});

router.delete('/deleteTransaction/:id', async (req, res) => {
  const transactionToDelete = await Transaction.findOne({ _id: req.params.id });
  if (!transactionToDelete) {
    return res.status(400).json({ Error: "Transaction not found" });
  }


  const deletedTransaction = await Transaction.findByIdAndDelete(transactionToDelete._id);
  const transactions = await Transaction.find({ userId: req.user._id });
  return res.json(transactions);
});



router.put('/editTransaction', async (req, res) => {
  let { transactionTitle, transactionType, transactionAmount, transactionDate, _id } = req.body;

  // const updatedTransaction = new Transaction({
  //   userId: req.user._id,
 
  // });
// console.log(updatedTransaction);
  await Transaction.updateOne({_id:_id,   transactionTitle,
    transactionType,
    transactionAmount,
    transactionDate })
    .then(transaction => res.json(transaction))
    .catch(err => res.status(400).json({ Error: err }));
});




module.exports = router;