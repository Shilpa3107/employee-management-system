require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./config/prismaClient');

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-0001',
      name: 'Super Admin',
      email: 'admin@ems.com',
      passwordHash,
      phone: '9999999999',
      department: 'Management',
      designation: 'Super Admin',
      salary: 100000,
      joiningDate: new Date(),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('Seeded Super Admin:', admin.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());