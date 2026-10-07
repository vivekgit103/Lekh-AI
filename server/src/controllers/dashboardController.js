import { documentService } from '../services/documentService.js';

export const dashboardController = {
  // GET /api/dashboard/stats
  async getStats(req, res) {
    try {
      const stats = await documentService.getDashboardStats(req.user.id);
      return res.json({ stats });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      return res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
    }
  },
};
