const { z } = require('zod');

const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a 10-digit number'),
  department: z.string().min(1),
  designation: z.string().min(1),
  salary: z.number().positive(),
  joiningDate: z.string(),
  role: z.enum(['SUPER_ADMIN', 'HR_MANAGER', 'EMPLOYEE']),
  reportingManagerId: z.string().uuid().nullable().optional(),
});

const updateEmployeeSchemaFull = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a 10-digit number').optional(),
  department: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  salary: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  role: z.enum(['SUPER_ADMIN', 'HR_MANAGER', 'EMPLOYEE']).optional(),
  reportingManagerId: z.string().uuid().nullable().optional(),
}).strict();

const updateEmployeeSchemaSelf = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be a 10-digit number').optional(),
  profileImageUrl: z.string().url().optional(),
}).strict();

module.exports = { createEmployeeSchema, updateEmployeeSchemaFull, updateEmployeeSchemaSelf };