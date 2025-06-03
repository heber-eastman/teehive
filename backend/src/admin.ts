import express, { Request } from 'express';
import multer from 'multer';
import { parseCSV } from './utils/csvParser';
import { processUpload } from './services/uploadService';
import { Router } from 'express';
import { isAuthenticated } from './auth';
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

interface TeeTimeRow {
  course_name: string;
  date_time: string;
  spots_available: string;
  price_amount: string;
  currency: string;
  holes: string;
  booking_url: string;
}

// Define column definitions for tee time CSV
const teeTimeColumns = [
  { name: 'course_name', validation: { type: 'string' as const, required: true } },
  { name: 'date_time', validation: { type: 'date' as const, required: true } },
  { name: 'spots_available', validation: { type: 'number' as const, required: true } },
  { name: 'price_amount', validation: { type: 'number' as const, required: true } },
  { name: 'currency', validation: { type: 'string' as const, required: true } },
  { name: 'holes', validation: { type: 'number' as const, required: true } },
  { name: 'booking_url', validation: { type: 'string' as const, required: true } },
];

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
          .result {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            background-color: #f8f9fa;
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
          <div id="result" class="result"></div>
        </div>
        <script>
          document.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const resultDiv = document.getElementById('result');
            
            try {
              resultDiv.innerHTML = '<p>Processing...</p>';
              const response = await fetch('/admin', {
                method: 'POST',
                body: formData
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
              }
              
              let html = '<h3>Upload Results:</h3>';
              html += \`<p class="success">\${data.message}</p>\`;
              html += \`<p>Total Records: \${data.totalRows}</p>\`;
              html += \`<p>Valid Records: \${data.validRows}</p>\`;
              html += \`<p>Invalid Records: \${data.skippedRows}</p>\`;
              
              if (data.error) {
                html += \`<p class="error">Error: \${data.error}</p>\`;
              }
              
              resultDiv.innerHTML = html;
            } catch (error) {
              resultDiv.innerHTML = \`<p class="error">Error: \${error.message}</p>\`;
            }
          });
        </script>
      </body>
    </html>
  `);
});

// POST /admin - handle file upload and parse CSV
router.post('/admin', /* isAuthenticated, */ (upload.single('csv') as any), async (req: Request, res) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Parse CSV with validation
    const parseResult = await parseCSV<TeeTimeRow>(file.buffer, teeTimeColumns);

    // Process upload and store in database
    const result = await processUpload('admin', parseResult, file.originalname);

    res.json({
      message: 'CSV file processed and stored successfully',
      totalRows: result.totalRows,
      validRows: result.validRows,
      skippedRows: result.skippedRows,
      error: result.error
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ 
      error: 'Error processing CSV file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Dummy route for testing
router.get('/tee-times', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Tee times endpoint' });
});

export default router; 