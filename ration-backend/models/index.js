const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String },
  pricePerUnit: { type: Number },
  stock: { type: Number }
}, { timestamps: false });
const Item = mongoose.model('Item', itemSchema);

const rationCardSchema = new mongoose.Schema({
  cardNumber: { type: String, unique: true, required: true },
  holderName: { type: String },
  familyMembers: { type: Number },
  cardType: { type: String }
}, { timestamps: false });
const RationCard = mongoose.model('RationCard', rationCardSchema);

const entitlementSchema = new mongoose.Schema({
  rationCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'RationCard' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  totalQuantity: { type: Number },
  usedQuantity: { type: Number }
}, { timestamps: false });
const Entitlement = mongoose.model('Entitlement', entitlementSchema);

const shopStatusSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
  isOnLeave: { type: Boolean, default: false },
  todayMessage: { type: String, default: 'Welcome!' },
  workingDays: { type: String },
  workingHours: { type: String }
}, { timestamps: false });
const ShopStatus = mongoose.model('ShopStatus', shopStatusSchema);

const transactionSchema = new mongoose.Schema({
  rationCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'RationCard' },
  transactionDate: { type: Date },
  totalAmount: { type: Number }
}, { timestamps: false });
const Transaction = mongoose.model('Transaction', transactionSchema);

const transactionItemSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  quantity: { type: Number },
  amount: { type: Number }
}, { timestamps: false });
const TransactionItem = mongoose.model('TransactionItem', transactionItemSchema);

module.exports = {
  Item,
  RationCard,
  Entitlement,
  ShopStatus,
  Transaction,
  TransactionItem
};
