import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Protect all document routes with Supabase JWT auth middleware
router.use(requireAuth);

// Document upload & analysis
router.post('/upload', upload.single('file'), documentController.uploadDocument);

// Demo sample route
router.get('/demo-sample', documentController.getDemoSample);

// Document CRUD
router.get('/', documentController.listDocuments);
router.get('/:id', documentController.getDocument);
router.delete('/:id', documentController.deleteDocument);

// Document interactive Q&A
router.post('/:id/chat', documentController.chatWithDocument);
router.get('/:id/chat', documentController.getChatHistory);

export default router;
