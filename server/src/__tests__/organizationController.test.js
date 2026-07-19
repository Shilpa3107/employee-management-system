jest.mock('../config/prismaClient', () => ({
  employee: {
    findUnique: jest.fn(),
  },
}));

const prisma = require('../config/prismaClient');

// We can't easily import wouldCreateCycle directly since it isn't exported,
// so we re-require the controller module and test through its exported behavior indirectly
// is not ideal — instead, let's test the algorithm directly by extracting it.
// (See note below the code block.)

describe('wouldCreateCycle (org hierarchy cycle detection)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('detects a direct self-assignment as a cycle', async () => {
    const { wouldCreateCycleForTest } = require('../controllers/organizationController');
    const result = await wouldCreateCycleForTest('emp-1', 'emp-1');
    expect(result).toBe(true);
  });

  test('detects a multi-hop cycle (A -> B -> C -> A)', async () => {
    const { wouldCreateCycleForTest } = require('../controllers/organizationController');

    // Simulate: employee 'B' currently reports to 'C', and 'C' reports to 'A'.
    // We're checking: can 'A' be assigned manager 'B'? Walking up from B: B -> C -> A. That hits A. Cycle.
    prisma.employee.findUnique.mockImplementation(({ where: { id } }) => {
      if (id === 'B') return Promise.resolve({ reportingManagerId: 'C' });
      if (id === 'C') return Promise.resolve({ reportingManagerId: 'A' });
      return Promise.resolve(null);
    });

    const result = await wouldCreateCycleForTest('A', 'B');
    expect(result).toBe(true);
  });

  test('allows a valid, non-circular assignment', async () => {
    const { wouldCreateCycleForTest } = require('../controllers/organizationController');

    // Simulate: 'B' reports to 'C', and 'C' has no manager.
    // Checking: can 'D' be assigned manager 'B'? Walking up: B -> C -> (null). Never hits D. Not a cycle.
    prisma.employee.findUnique.mockImplementation(({ where: { id } }) => {
      if (id === 'B') return Promise.resolve({ reportingManagerId: 'C' });
      if (id === 'C') return Promise.resolve({ reportingManagerId: null });
      return Promise.resolve(null);
    });

    const result = await wouldCreateCycleForTest('D', 'B');
    expect(result).toBe(false);
  });
});