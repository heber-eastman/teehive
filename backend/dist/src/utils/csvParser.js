"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVParseError = void 0;
exports.parseCSV = parseCSV;
const csv_parse_1 = require("csv-parse");
const stream_1 = require("stream");
class CSVParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CSVParseError';
    }
}
exports.CSVParseError = CSVParseError;
async function parseCSV(buffer, columns) {
    const parser = (0, csv_parse_1.parse)({
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const validRows = [];
    const invalidRows = [];
    let rowNumber = 1;
    return new Promise((resolve, reject) => {
        const stream = stream_1.Readable.from(buffer);
        const results = {
            validRows,
            invalidRows,
            totalRows: 0,
        };
        stream
            .pipe(parser)
            .on('data', (row) => {
            rowNumber++;
            const errors = [];
            // Validate each column
            for (const column of columns) {
                const value = row[column.name];
                const validation = column.validation;
                // Check required
                if (validation.required && (value === undefined || value === '')) {
                    errors.push(`${column.name} is required`);
                    continue;
                }
                // Skip validation if value is empty and not required
                if (!validation.required && (value === undefined || value === '')) {
                    continue;
                }
                // Type validation
                switch (validation.type) {
                    case 'number':
                        const num = Number(value);
                        if (isNaN(num)) {
                            errors.push(`${column.name} must be a number`);
                        }
                        else {
                            if (validation.min !== undefined && num < validation.min) {
                                errors.push(`${column.name} must be greater than or equal to ${validation.min}`);
                            }
                            if (validation.max !== undefined && num > validation.max) {
                                errors.push(`${column.name} must be less than or equal to ${validation.max}`);
                            }
                        }
                        break;
                    case 'boolean':
                        if (!['true', 'false', '0', '1'].includes(String(value).toLowerCase())) {
                            errors.push(`${column.name} must be a boolean`);
                        }
                        break;
                    case 'date':
                        const date = new Date(value);
                        if (isNaN(date.getTime())) {
                            errors.push(`${column.name} must be a valid date`);
                        }
                        break;
                    case 'string':
                        if (validation.pattern && !validation.pattern.test(String(value))) {
                            errors.push(`${column.name} must match the required pattern`);
                        }
                        break;
                }
                // Custom validation
                if (validation.custom && !validation.custom(value)) {
                    errors.push(`${column.name} failed custom validation`);
                }
            }
            if (errors.length === 0) {
                validRows.push(row);
            }
            else {
                invalidRows.push({ row: rowNumber, errors });
            }
            results.totalRows++;
        })
            .on('end', () => {
            resolve(results);
        })
            .on('error', (error) => {
            reject(new CSVParseError(`Failed to parse CSV: ${error.message}`));
        });
    });
}
