const customerService = require('../services/customerService');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

class CustomerController {
  async getCustomers(req, res, next) {
    try {
      const { page, limit, search, riskLevel, contract, sortBy, sortOrder } = req.query;
      const result = await customerService.getCustomers({
        page,
        limit,
        search,
        riskLevel,
        contract,
        sortBy,
        sortOrder,
      });

      return ApiResponse.success(res, result.customers, 'Customers retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) {
        return next(new AppError('Customer not found', 404));
      }
      return ApiResponse.success(res, customer, 'Customer details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      const deleted = await customerService.deleteCustomer(req.params.id);
      if (!deleted) {
        return next(new AppError('Customer not found or already deleted', 404));
      }
      return ApiResponse.success(res, deleted, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
