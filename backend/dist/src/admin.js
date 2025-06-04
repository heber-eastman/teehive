"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const csvParser_1 = require("./utils/csvParser");
const uploadService_1 = require("./services/uploadService");
const auth_1 = require("./auth");
// import { isAuthenticated } from './auth';  // Temporarily comment out
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});
// Define column definitions for tee time CSV
const teeTimeColumns = [
    { name: 'course_name', validation: { type: 'string', required: true } },
    { name: 'date_time', validation: { type: 'date', required: true } },
    { name: 'spots_available', validation: { type: 'number', required: true } },
    { name: 'price_amount', validation: { type: 'number', required: true } },
    { name: 'currency', validation: { type: 'string', required: true } },
    { name: 'holes', validation: { type: 'number', required: true } },
    { name: 'booking_url', validation: { type: 'string', required: true } },
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
router.post('/admin', /* isAuthenticated, */ upload.single('csv'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        // Parse CSV with validation
        const parseResult = await (0, csvParser_1.parseCSV)(file.buffer, teeTimeColumns);
        // Process upload and store in database
        const result = await (0, uploadService_1.processUpload)('admin', parseResult, file.originalname);
        res.json({
            message: 'CSV file processed and stored successfully',
            totalRows: result.totalRows,
            validRows: result.validRows,
            skippedRows: result.skippedRows,
            error: result.error
        });
    }
    catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({
            error: 'Error processing CSV file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Dummy route for testing
router.get('/tee-times', auth_1.isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Tee times endpoint' });
});
exports.default = router;
