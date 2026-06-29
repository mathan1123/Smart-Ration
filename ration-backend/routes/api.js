const express = require('express');
const router = express.Router();
const { Item, RationCard, Entitlement, ShopStatus, Transaction, TransactionItem } = require('../models');
const mongoose = require('mongoose');

// --- TEMPORARY SEED ROUTE (DELETE AFTER USE) ---
router.get('/seed', async (req, res) => {
  try {
    await mongoose.connection.dropDatabase();
    const rice = await Item.create({ name: 'Rice', unit: 'kg', pricePerUnit: 3.0, stock: 500.0 });
    const wheat = await Item.create({ name: 'Wheat', unit: 'kg', pricePerUnit: 2.0, stock: 300.0 });
    const sugar = await Item.create({ name: 'Sugar', unit: 'kg', pricePerUnit: 20.0, stock: 100.0 });
    const kerosene = await Item.create({ name: 'Kerosene', unit: 'L', pricePerUnit: 15.0, stock: 200.0 });
    const dal = await Item.create({ name: 'Dal', unit: 'kg', pricePerUnit: 60.0, stock: 200.0 });
    const card1 = await RationCard.create({ cardNumber: '100000000001', holderName: 'Anita Raj', familyMembers: 4, cardType: 'PHH' });
    await Entitlement.create({ rationCardId: card1._id, itemId: rice._id, totalQuantity: 20.0, usedQuantity: 0.0 });
    await Entitlement.create({ rationCardId: card1._id, itemId: wheat._id, totalQuantity: 10.0, usedQuantity: 0.0 });
    await Entitlement.create({ rationCardId: card1._id, itemId: sugar._id, totalQuantity: 2.0, usedQuantity: 0.0 });
    const card2 = await RationCard.create({ cardNumber: '100000000002', holderName: 'Sunita Devi', familyMembers: 2, cardType: 'AAY' });
    await Entitlement.create({ rationCardId: card2._id, itemId: rice._id, totalQuantity: 35.0, usedQuantity: 5.0 });
    await Entitlement.create({ rationCardId: card2._id, itemId: sugar._id, totalQuantity: 3.0, usedQuantity: 0.0 });
    await Entitlement.create({ rationCardId: card2._id, itemId: kerosene._id, totalQuantity: 5.0, usedQuantity: 0.0 });
    const card3 = await RationCard.create({ cardNumber: '100000000003', holderName: 'Rahul Verma', familyMembers: 3, cardType: 'NPHH' });
    await Entitlement.create({ rationCardId: card3._id, itemId: rice._id, totalQuantity: 10.0, usedQuantity: 2.0 });
    await Entitlement.create({ rationCardId: card3._id, itemId: wheat._id, totalQuantity: 5.0, usedQuantity: 5.0 });
    const card4 = await RationCard.create({ cardNumber: '100000000004', holderName: 'Mohd. Ibrahim', familyMembers: 6, cardType: 'PHH' });
    await Entitlement.create({ rationCardId: card4._id, itemId: rice._id, totalQuantity: 30.0, usedQuantity: 10.0 });
    await Entitlement.create({ rationCardId: card4._id, itemId: wheat._id, totalQuantity: 15.0, usedQuantity: 0.0 });
    await Entitlement.create({ rationCardId: card4._id, itemId: dal._id, totalQuantity: 2.0, usedQuantity: 0.0 });
    const card5 = await RationCard.create({ cardNumber: '100000000005', holderName: 'David John', familyMembers: 1, cardType: 'AAY' });
    await Entitlement.create({ rationCardId: card5._id, itemId: rice._id, totalQuantity: 15.0, usedQuantity: 14.0 });
    await Entitlement.create({ rationCardId: card5._id, itemId: kerosene._id, totalQuantity: 2.0, usedQuantity: 0.0 });
    await ShopStatus.create({ isOpen: true, workingDays: 'Monday - Saturday', workingHours: '9:00 AM - 6:00 PM', todayMessage: 'Welcome!' });
    res.json({ success: true, message: 'Database seeded with 5 ration cards!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Items ---
router.get('/items', async (req, res) => {
  const items = await Item.find();
  // To make ID matching easier for frontend, mongoose returns _id. If frontend expects id, map it:
  res.json(items.map(item => ({ ...item.toObject(), id: item._id })));
});

router.post('/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json({ ...item.toObject(), id: item._id });
});

router.put('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).send();
  res.json({ ...item.toObject(), id: item._id });
});

router.delete('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send();
  res.send();
});

// --- Ration Cards ---
router.get('/ration-cards', async (req, res) => {
  const cards = await RationCard.find();
  res.json(cards.map(card => ({ ...card.toObject(), id: card._id })));
});

router.post('/ration-cards', async (req, res) => {
  const card = await RationCard.create(req.body);
  res.json({ ...card.toObject(), id: card._id });
});

router.get('/ration-cards/:cardNumber', async (req, res) => {
  const card = await RationCard.findOne({ cardNumber: req.params.cardNumber });
  if (!card) return res.status(404).send();
  res.json({ ...card.toObject(), id: card._id });
});

router.put('/ration-cards/:id', async (req, res) => {
  const card = await RationCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!card) return res.status(404).send();
  res.json({ ...card.toObject(), id: card._id });
});

router.delete('/ration-cards/:id', async (req, res) => {
  const card = await RationCard.findByIdAndDelete(req.params.id);
  if (!card) return res.status(404).send();
  res.send();
});

// --- Entitlements ---
router.get('/entitlements/:cardNumber', async (req, res) => {
  const card = await RationCard.findOne({ cardNumber: req.params.cardNumber });
  if (!card) return res.json([]);

  const entitlements = await Entitlement.find({ rationCardId: card._id }).populate('itemId');

  const response = entitlements.map(e => ({
    nameEn: e.itemId ? e.itemId.name : 'Unknown',
    total: e.totalQuantity,
    used: e.usedQuantity,
    unitEn: e.itemId ? e.itemId.unit : '',
    price: e.itemId ? e.itemId.pricePerUnit : 0
  }));

  res.json(response);
});

// --- Shop Status ---
router.get('/shop-status', async (req, res) => {
  let status = await ShopStatus.findOne();
  if (!status) {
    status = { isOpen: true, isOnLeave: false, todayMessage: 'Welcome!', workingDays: 'Monday - Saturday', workingHours: '9:00 AM - 6:00 PM' };
  } else {
    status = { ...status.toObject(), id: status._id };
  }
  res.json(status);
});

router.post('/shop-status/update', async (req, res) => {
  let status = await ShopStatus.findOne();
  if (!status) {
    status = await ShopStatus.create({ isOpen: true, workingDays: 'N/A', workingHours: 'N/A', todayMessage: 'Welcome!' });
  }
  
  const newStatus = req.body;
  if (newStatus.workingDays !== undefined) status.workingDays = newStatus.workingDays;
  if (newStatus.workingHours !== undefined) status.workingHours = newStatus.workingHours;
  if (newStatus.isOnLeave !== undefined) status.isOnLeave = newStatus.isOnLeave;
  if (newStatus.todayMessage !== undefined) status.todayMessage = newStatus.todayMessage;
  
  await status.save();
  res.json({ ...status.toObject(), id: status._id });
});

// --- Transactions ---
router.get('/transactions', async (req, res) => {
  const transactions = await Transaction.find().lean();
  for (let t of transactions) {
    t.id = t._id;
    const items = await TransactionItem.find({ transactionId: t._id }).lean();
    t.items = items.map(item => ({ ...item, id: item._id }));
  }
  res.json(transactions);
});

router.post('/transactions', async (req, res) => {
  try {
    const card = await RationCard.findOne({ cardNumber: req.body.cardNumber });
    if (!card) throw new Error("Card not found");

    const newTransaction = await Transaction.create({
      rationCardId: card._id,
      transactionDate: new Date(),
      totalAmount: req.body.totalAmount
    });

    const items = req.body.items || [];
    for (const itemReq of items) {
      const item = await Item.findOne({ name: itemReq.itemName });
      if (!item) throw new Error("Item not found: " + itemReq.itemName);

      await TransactionItem.create({
        transactionId: newTransaction._id,
        itemId: item._id,
        quantity: itemReq.quantity,
        amount: itemReq.amount
      });

      // Update entitlement
      const entitlement = await Entitlement.findOne({
        rationCardId: card._id, itemId: item._id
      });
      
      if (entitlement) {
        entitlement.usedQuantity += itemReq.quantity;
        await entitlement.save();
      }
    }
    
    // Fetch with items to return
    const finalTx = await Transaction.findById(newTransaction._id).lean();
    finalTx.id = finalTx._id;
    const txItems = await TransactionItem.find({ transactionId: finalTx._id }).lean();
    finalTx.items = txItems.map(item => ({ ...item, id: item._id }));
    res.json(finalTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
