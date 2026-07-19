const express = require('express');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { assignManager, getDirectReports } = require('../controllers/organizationController');

const router = express.Router();

router.post('/', requireAuth, requireRole('SUPER_ADMIN', 'HR_MANAGER'), createEmployee);
router.get('/', requireAuth, requireRole('SUPER_ADMIN', 'HR_MANAGER'), getAllEmployees);
router.get('/:id', requireAuth, getEmployeeById);
router.put('/:id', requireAuth, updateEmployee);
router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), deleteEmployee);
router.get('/:id/reportees', requireAuth, getDirectReports);
router.patch('/:id/manager', requireAuth, requireRole('SUPER_ADMIN', 'HR_MANAGER'), assignManager);

module.exports = router;