const express = require('express');
const router = express.Router();
const { Item, RationCard, Entitlement, ShopStatus, Transaction, TransactionItem, sequelize } = require('../models');

// --- Items ---
router.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

router.post('/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

router.put('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).send();
  await item.update(req.body);
  res.json(item);
});

router.delete('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).send();
  await item.destroy();
  res.send();
});

// --- Ration Cards ---
router.get('/ration-cards', async (req, res) => {
  const cards = await RationCard.findAll();
  res.json(cards);
});

router.post('/ration-cards', async (req, res) => {
  const card = await RationCard.create(req.body);
  res.json(card);
});

router.get('/ration-cards/:cardNumber', async (req, res) => {
  const card = await RationCard.findOne({ where: { cardNumber: req.params.cardNumber } });
  if (!card) return res.status(404).send();
  res.json(card);
});

router.put('/ration-cards/:id', async (req, res) => {
  const card = await RationCard.findByPk(req.params.id);
  if (!card) return res.status(404).send();
  await card.update(req.body);
  res.json(card);
});

router.delete('/ration-cards/:id', async (req, res) => {
  const card = await RationCard.findByPk(req.params.id);
  if (!card) return res.status(404).send();
  await card.destroy();
  res.send();
});

// --- Entitlements ---
router.get('/entitlements/:cardNumber', async (req, res) => {
  const card = await RationCard.findOne({ where: { cardNumber: req.params.cardNumber } });
  if (!card) return res.json([]);

  const entitlements = await Entitlement.findAll({
    where: { rationCardId: card.id },
    include: [Item]
  });

  const response = entitlements.map(e => ({
    nameEn: e.Item.name,
    total: e.totalQuantity,
    used: e.usedQuantity,
    unitEn: e.Item.unit,
    price: e.Item.pricePerUnit
  }));

  res.json(response);
});

// --- Shop Status ---
router.get('/shop-status', async (req, res) => {
  let status = await ShopStatus.findOne();
  if (!status) {
    status = { isOpen: true, isOnLeave: false, todayMessage: 'Welcome!', workingDays: 'Monday - Saturday', workingHours: '9:00 AM - 6:00 PM' };
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
  res.json(status);
});

// --- Transactions ---
router.get('/transactions', async (req, res) => {
  const transactions = await Transaction.findAll({ include: ['items'] });
  res.json(transactions);
});

router.post('/transactions', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const card = await RationCard.findOne({ where: { cardNumber: req.body.cardNumber }, transaction: t });
    if (!card) throw new Error("Card not found");

    const newTransaction = await Transaction.create({
      rationCardId: card.id,
      transactionDate: new Date(),
      totalAmount: req.body.totalAmount
    }, { transaction: t });

    const items = req.body.items || [];
    for (const itemReq of items) {
      const item = await Item.findOne({ where: { name: itemReq.itemName }, transaction: t });
      if (!item) throw new Error("Item not found: " + itemReq.itemName);

      await TransactionItem.create({
        transactionId: newTransaction.id,
        itemId: item.id,
        quantity: itemReq.quantity,
        amount: itemReq.amount
      }, { transaction: t });

      // Update entitlement
      const entitlement = await Entitlement.findOne({
        where: { rationCardId: card.id, itemId: item.id },
        transaction: t
      });
      
      if (entitlement) {
        await entitlement.update({
          usedQuantity: entitlement.usedQuantity + itemReq.quantity
        }, { transaction: t });
      }
    }

    await t.commit();
    
    // Fetch with items to return
    const finalTx = await Transaction.findByPk(newTransaction.id, { include: ['items'] });
    res.json(finalTx);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
