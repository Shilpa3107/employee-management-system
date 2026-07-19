require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./config/prismaClient');

async function main() {
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const empHash = await bcrypt.hash('Employee@123', 10);

  const admin = await prisma.employee.upsert({
    where: { email: 'admin@ems.com' },
    update: {},
    create: {
      employeeCode: 'EMP-0001',
      name: 'Super Admin',
      email: 'admin@ems.com',
      passwordHash: adminHash,
      phone: '9999999999',
      department: 'Management',
      designation: 'Super Admin',
      salary: 100000,
      joiningDate: new Date(),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  const employee = await prisma.employee.upsert({
    where: { email: 'employee@ems.com' },
    update: {},
    create: {
      employeeCode: 'EMP-0002',
      name: 'Test Employee',
      email: 'employee@ems.com',
      passwordHash: empHash,
      phone: '8888888888',
      department: 'Engineering',
      designation: 'Software Engineer',
      salary: 50000,
      joiningDate: new Date(),
      role: 'EMPLOYEE',
      status: 'ACTIVE',
    },
  });

  console.log('Seeded:', admin.email, '/', employee.email);
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());