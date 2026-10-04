const Customer = require('../models/Customer');
const { getDBStatus } = require('../config/db');

// In-memory store fallback if MongoDB is not yet connected
const inMemoryCustomers = [];

class CustomerService {
  async saveCustomer(customerData) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await Customer.create(customerData);
    } else {
      const record = {
        _id: 'MEM-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryCustomers.unshift(record);
      return record;
    }
  }

  async saveBatch(customersData) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await Customer.insertMany(customersData);
    } else {
      const records = customersData.map((c) => ({
        _id: 'MEM-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        ...c,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      inMemoryCustomers.unshift(...records);
      return records;
    }
  }

  async getCustomers({ page = 1, limit = 10, search = '', riskLevel = '', contract = '', sortBy = 'createdAt', sortOrder = 'desc' }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const dbStatus = getDBStatus();

    if (dbStatus.isConnected) {
      const query = {};

      if (search) {
        query.$or = [
          { customerId: { $regex: search, $options: 'i' } },
          { PaymentMethod: { $regex: search, $options: 'i' } },
        ];
      }

      if (riskLevel && riskLevel !== 'all') {
        query.riskLevel = riskLevel;
      }

      if (contract && contract !== 'all') {
        query.Contract = contract;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const total = await Customer.countDocuments(query);
      const customers = await Customer.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean();

      return {
        customers,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    } else {
      let filtered = [...inMemoryCustomers];

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.customerId?.toLowerCase().includes(s) ||
            c.PaymentMethod?.toLowerCase().includes(s)
        );
      }

      if (riskLevel && riskLevel !== 'all') {
        filtered = filtered.filter((c) => c.riskLevel === riskLevel);
      }

      if (contract && contract !== 'all') {
        filtered = filtered.filter((c) => c.Contract === contract);
      }

      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      const total = filtered.length;
      const customers = filtered.slice(skip, skip + limitNum);

      return {
        customers,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    }
  }

  async getCustomerById(id) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await Customer.findById(id);
    } else {
      return inMemoryCustomers.find((c) => c._id === id || c.customerId === id);
    }
  }

  async deleteCustomer(id) {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await Customer.findByIdAndDelete(id);
    } else {
      const idx = inMemoryCustomers.findIndex((c) => c._id === id || c.customerId === id);
      if (idx !== -1) {
        return inMemoryCustomers.splice(idx, 1)[0];
      }
      return null;
    }
  }

  async getAllForAnalytics() {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      return await Customer.find({}).lean();
    } else {
      return inMemoryCustomers;
    }
  }
}

module.exports = new CustomerService();
