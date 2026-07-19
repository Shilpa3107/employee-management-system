const bcrypt = require('bcryptjs');
const prisma = require('../config/prismaClient');
const {
  createEmployeeSchema,
  updateEmployeeSchemaFull,
  updateEmployeeSchemaSelf,
} = require('../validation/employeeValidation');

async function createEmployee(req, res) {
  try {
    const parsed = createEmployeeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
    }

    const { password, ...rest } = parsed.data;

    // HR cannot create a Super Admin
    if (req.user.role === 'HR_MANAGER' && rest.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'HR cannot assign Super Admin role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: {
        ...rest,
        joiningDate: new Date(rest.joiningDate),
        passwordHash,
      },
    });

    const { passwordHash: _, ...safeEmployee } = employee;
    res.status(201).json(safeEmployee);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Employee code or email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error creating employee' });
  }
}

async function getAllEmployees(req, res) {
  try {
    const employees = await prisma.employee.findMany({
      where: { isDeleted: false },
      select: {
        id: true, employeeCode: true, name: true, email: true, phone: true,
        department: true, designation: true, salary: true, joiningDate: true,
        status: true, role: true, profileImageUrl: true, reportingManagerId: true,
      },
    });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
}

async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role === 'EMPLOYEE' && req.user.id !== id) {
      return res.status(403).json({ message: 'You can only view your own profile' });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true, employeeCode: true, name: true, email: true, phone: true,
        department: true, designation: true, salary: true, joiningDate: true,
        status: true, role: true, profileImageUrl: true, reportingManagerId: true,
        isDeleted: true,
      },
    });

    if (!employee || employee.isDeleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching employee' });
  }
}

async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const isSelf = req.user.id === id;
    const isPrivileged = req.user.role === 'SUPER_ADMIN' || req.user.role === 'HR_MANAGER';

    if (!isSelf && !isPrivileged) {
      return res.status(403).json({ message: 'Not allowed to update this employee' });
    }

    const schema = isPrivileged ? updateEmployeeSchemaFull : updateEmployeeSchemaSelf;
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
    }

    if (req.user.role === 'HR_MANAGER' && parsed.data.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'HR cannot assign Super Admin role' });
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: parsed.data,
    });

    const { passwordHash: _, ...safeEmployee } = updated;
    res.json(safeEmployee);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error updating employee' });
  }
}

async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    const deleted = await prisma.employee.update({
      where: { id },
      data: { isDeleted: true, status: 'INACTIVE' },
    });

    res.json({ message: 'Employee soft-deleted', id: deleted.id });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
}

module.exports = { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee };