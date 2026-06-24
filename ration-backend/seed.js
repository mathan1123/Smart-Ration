const { sequelize, Item, RationCard, Entitlement, ShopStatus } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // Reset DB

  // Create Ration Items
  const rice = await Item.create({ name: 'Rice', unit: 'kg', pricePerUnit: 3.0, stock: 500.0 });
  const wheat = await Item.create({ name: 'Wheat', unit: 'kg', pricePerUnit: 2.0, stock: 300.0 });
  const sugar = await Item.create({ name: 'Sugar', unit: 'kg', pricePerUnit: 20.0, stock: 100.0 });
  const kerosene = await Item.create({ name: 'Kerosene', unit: 'L', pricePerUnit: 15.0, stock: 200.0 });
  const dal = await Item.create({ name: 'Dal', unit: 'kg', pricePerUnit: 60.0, stock: 200.0 });

  // 1. PHH Card (Standard)
  const card1 = await RationCard.create({ cardNumber: '100000000001', holderName: 'Anita Raj', familyMembers: 4, cardType: 'PHH' });
  await Entitlement.create({ rationCardId: card1.id, itemId: rice.id, totalQuantity: 20.0, usedQuantity: 0.0 });
  await Entitlement.create({ rationCardId: card1.id, itemId: wheat.id, totalQuantity: 10.0, usedQuantity: 0.0 });
  await Entitlement.create({ rationCardId: card1.id, itemId: sugar.id, totalQuantity: 2.0, usedQuantity: 0.0 });

  // 2. AAY Card (High Subsidy)
  const card2 = await RationCard.create({ cardNumber: '100000000002', holderName: 'Sunita Devi', familyMembers: 2, cardType: 'AAY' });
  await Entitlement.create({ rationCardId: card2.id, itemId: rice.id, totalQuantity: 35.0, usedQuantity: 5.0 });
  await Entitlement.create({ rationCardId: card2.id, itemId: wheat.id, totalQuantity: 0.0, usedQuantity: 0.0 });
  await Entitlement.create({ rationCardId: card2.id, itemId: sugar.id, totalQuantity: 3.0, usedQuantity: 0.0 });
  await Entitlement.create({ rationCardId: card2.id, itemId: kerosene.id, totalQuantity: 5.0, usedQuantity: 0.0 });

  // 3. NPHH Card (General)
  const card3 = await RationCard.create({ cardNumber: '100000000003', holderName: 'Rahul Verma', familyMembers: 3, cardType: 'NPHH' });
  await Entitlement.create({ rationCardId: card3.id, itemId: rice.id, totalQuantity: 10.0, usedQuantity: 2.0 });
  await Entitlement.create({ rationCardId: card3.id, itemId: wheat.id, totalQuantity: 5.0, usedQuantity: 5.0 }); // Fully used

  // 4. Large Family (PHH)
  const card4 = await RationCard.create({ cardNumber: '100000000004', holderName: 'Mohd. Ibrahim', familyMembers: 6, cardType: 'PHH' });
  await Entitlement.create({ rationCardId: card4.id, itemId: rice.id, totalQuantity: 30.0, usedQuantity: 10.0 });
  await Entitlement.create({ rationCardId: card4.id, itemId: wheat.id, totalQuantity: 15.0, usedQuantity: 0.0 });
  await Entitlement.create({ rationCardId: card4.id, itemId: dal.id, totalQuantity: 2.0, usedQuantity: 0.0 });

  // 5. Single Member (AAY)
  const card5 = await RationCard.create({ cardNumber: '100000000005', holderName: 'David John', familyMembers: 1, cardType: 'AAY' });
  await Entitlement.create({ rationCardId: card5.id, itemId: rice.id, totalQuantity: 15.0, usedQuantity: 14.0 }); // Almost finished
  await Entitlement.create({ rationCardId: card5.id, itemId: kerosene.id, totalQuantity: 2.0, usedQuantity: 0.0 });

  // Initialize Shop Status
  const statusCount = await ShopStatus.count();
  if (statusCount === 0) {
    await ShopStatus.create({ isOpen: true, workingDays: 'Monday - Saturday', workingHours: '9:00 AM - 6:00 PM', todayMessage: 'Welcome!' });
  }

  console.log("Backend: Database initialized with 5 sample cards.");
}

seed().catch(err => {
  console.error("Failed to seed database:", err);
});
