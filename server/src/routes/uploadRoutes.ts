import express, { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router: Router = express.Router();

// Upload single document
router.post('/', auth, upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    };

    res.json({ message: 'File uploaded successfully', file: fileInfo });
  } catch (error: any) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload multiple documents
router.post('/multiple', auth, upload.array('documents', 5), async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      filename: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    }));

    res.json({ message: 'Files uploaded successfully', files });
  } catch (error: any) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
