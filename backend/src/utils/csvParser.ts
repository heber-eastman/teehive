import { parse } from 'csv-parse';
import { Readable } from 'stream';

export interface ValidationRule {
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ColumnDefinition {
  name: string;
  validation: ValidationRule;
}

export interface ParseResult<T> {
  validRows: T[];
  invalidRows: {
    row: number;
    errors: string[];
  }[];
  totalRows: number;
}

export class CSVParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVParseError';
  }
}

export async function parseCSV<T extends Record<string, any>>(
  buffer: Buffer,
  columns: ColumnDefinition[]
): Promise<ParseResult<T>> {
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const validRows: T[] = [];
  const invalidRows: { row: number; errors: string[] }[] = [];
  let rowNumber = 1;

  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    const results: ParseResult<T> = {
      validRows,
      invalidRows,
      totalRows: 0,
    };

    stream
      .pipe(parser)
      .on('data', (row: any) => {
        rowNumber++;
        const errors: string[] = [];

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
              } else {
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
          validRows.push(row as T);
        } else {
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