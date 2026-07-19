const { requireRole } = require('../middleware/authMiddleware');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('requireRole middleware', () => {
  test('allows a user whose role is in the allowed list', () => {
    const req = { user: { role: 'SUPER_ADMIN' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('SUPER_ADMIN', 'HR_MANAGER')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('blocks a user whose role is not in the allowed list', () => {
    const req = { user: { role: 'EMPLOYEE' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('SUPER_ADMIN')(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient permissions' });
  });

  test('blocks a request with no user attached at all', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    requireRole('SUPER_ADMIN')(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});