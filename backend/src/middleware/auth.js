const prisma = require('../prisma');

// Stub auth middleware
// To be updated com o card 3.1 
// For now it picks the first municipality in the DB so all routes work locally.

const auth = async (req, res, next) => {
  const municipality = await prisma.municipality.findFirst();

  if (!municipality) {
    return res.status(500).json({
      error: 'No seed data found. Run: npm run seed',
    });
  }

  req.user = {
    id:             'stub-user',
    municipalityId: municipality.id,
  };

  next();
};

module.exports = auth;