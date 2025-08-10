import { verifyAdmin } from '../middleware/verifyAdmin.js';

// Promote to admin
router.put('/users/:id/promote', verifyAdmin, promoteToAdmin);

// Demote admin
router.put('/users/:id/demote', verifyAdmin, demoteToUser);
