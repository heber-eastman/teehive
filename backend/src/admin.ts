import express, { Request } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';
// import { isAuthenticated } from './auth';  // Temporarily comment out

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// GET /admin - HTML form
router.get('/admin', /* isAuthenticated, */ (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>CSV Upload</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
          }
          .upload-container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 1.5rem;
          }
          .file-input-container {
            margin-bottom: 1rem;
          }
          .file-input {
            display: block;
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border: 2px dashed #ccc;
            border-radius: 4px;
          }
          .submit-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          .submit-button:hover {
            background-color: #0056b3;
          }
          .error {
            color: #dc3545;
            margin-top: 1rem;
          }
          .success {
            color: #28a745;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="upload-container">
          <h1>Upload CSV File</h1>
          <form action="/admin" method="post" enctype="multipart/form-data">
            <div class="file-input-container">
              <input type="file" name="csv" accept=".csv" class="file-input" required />
            </div>
            <button type="submit" class="submit-button">Upload CSV</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// POST /admin - handle file upload and parse CSV
router.post('/admin', /* isAuthenticated, */ upload.single('csv'), async (req: Request, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const records: any[] = [];
    const parser = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    for await (const record of parser) {
      records.push(record);
    }

    // For now, just return the parsed data
    // In a real application, you would process this data further
    res.json({
      message: 'CSV file processed successfully',
      recordCount: records.length,
      preview: records.slice(0, 5), // Show first 5 records as preview
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ 
      error: 'Error processing CSV file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 