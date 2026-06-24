const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  name: { type: DataTypes.STRING, allowNull: false },
  unit: { type: DataTypes.STRING },
  pricePerUnit: { type: DataTypes.DOUBLE },
  stock: { type: DataTypes.DOUBLE }
}, { timestamps: false, tableName: 'items' });

const RationCard = sequelize.define('RationCard', {
  cardNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  holderName: { type: DataTypes.STRING },
  familyMembers: { type: DataTypes.INTEGER },
  cardType: { type: DataTypes.STRING }
}, { timestamps: false, tableName: 'ration_cards' });

const Entitlement = sequelize.define('Entitlement', {
  totalQuantity: { type: DataTypes.DOUBLE },
  usedQuantity: { type: DataTypes.DOUBLE }
}, { timestamps: false, tableName: 'entitlements' });

RationCard.hasMany(Entitlement, { foreignKey: 'rationCardId' });
Entitlement.belongsTo(RationCard, { foreignKey: 'rationCardId' });

Item.hasMany(Entitlement, { foreignKey: 'itemId' });
Entitlement.belongsTo(Item, { foreignKey: 'itemId' });

const ShopStatus = sequelize.define('ShopStatus', {
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  isOnLeave: { type: DataTypes.BOOLEAN, defaultValue: false },
  todayMessage: { type: DataTypes.STRING, defaultValue: 'Welcome!' },
  workingDays: { type: DataTypes.STRING },
  workingHours: { type: DataTypes.STRING }
}, { timestamps: false, tableName: 'shop_status' });

const Transaction = sequelize.define('Transaction', {
  transactionDate: { type: DataTypes.DATE },
  totalAmount: { type: DataTypes.DOUBLE }
}, { timestamps: false, tableName: 'transactions' });

RationCard.hasMany(Transaction, { foreignKey: 'rationCardId' });
Transaction.belongsTo(RationCard, { foreignKey: 'rationCardId' });

const TransactionItem = sequelize.define('TransactionItem', {
  quantity: { type: DataTypes.DOUBLE },
  amount: { type: DataTypes.DOUBLE }
}, { timestamps: false, tableName: 'transaction_items' });

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId' });

Item.hasMany(TransactionItem, { foreignKey: 'itemId' });
TransactionItem.belongsTo(Item, { foreignKey: 'itemId' });

module.exports = {
  sequelize,
  Item,
  RationCard,
  Entitlement,
  ShopStatus,
  Transaction,
  TransactionItem
};
