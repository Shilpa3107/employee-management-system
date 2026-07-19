const prisma = require('../config/prismaClient');

async function wouldCreateCycle(employeeId, newManagerId) {
  if (employeeId === newManagerId) return true;

  let currentId = newManagerId;
  const visited = new Set();

  while (currentId) {
    if (currentId === employeeId) return true;
    if (visited.has(currentId)) break; // safety net against pre-existing bad data
    visited.add(currentId);

    const current = await prisma.employee.findUnique({
      where: { id: currentId },
      select: { reportingManagerId: true },
    });

    if (!current) break;
    currentId = current.reportingManagerId;
  }

  return false;
}

async function assignManager(req, res) {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee || employee.isDeleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (managerId !== null) {
      const manager = await prisma.employee.findUnique({ where: { id: managerId } });
      if (!manager || manager.isDeleted) {
        return res.status(400).json({ message: 'Reporting manager does not exist' });
      }

      const cycle = await wouldCreateCycle(id, managerId);
      if (cycle) {
        return res.status(400).json({ message: 'This assignment would create a circular reporting chain' });
      }
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: { reportingManagerId: managerId },
    });

    res.json({ id: updated.id, reportingManagerId: updated.reportingManagerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error assigning manager' });
  }
}

async function getDirectReports(req, res) {
  try {
    const { id } = req.params;

    const reports = await prisma.employee.findMany({
      where: { reportingManagerId: id, isDeleted: false },
      select: {
        id: true, employeeCode: true, name: true, designation: true, department: true, role: true,
      },
    });

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching direct reports' });
  }
}

async function getOrgTree(req, res) {
  try {
    const employees = await prisma.employee.findMany({
      where: { isDeleted: false },
      select: {
        id: true, employeeCode: true, name: true, designation: true, department: true, role: true, reportingManagerId: true,
      },
    });

    const byId = new Map(employees.map((e) => [e.id, { ...e, directReports: [] }]));
    const roots = [];

    for (const emp of byId.values()) {
      if (emp.reportingManagerId && byId.has(emp.reportingManagerId)) {
        byId.get(emp.reportingManagerId).directReports.push(emp);
      } else {
        roots.push(emp);
      }
    }

    res.json(roots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error building org tree' });
  }
}

module.exports = { assignManager, getDirectReports, getOrgTree, wouldCreateCycleForTest: wouldCreateCycle };