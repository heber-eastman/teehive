import { parseCSV, ColumnDefinition, CSVParseError } from '../src/utils/csvParser';

describe('CSV Parser', () => {
  const columns: ColumnDefinition[] = [
    {
      name: 'name',
      validation: {
        type: 'string',
        required: true,
        pattern: /^[A-Za-z\s]+$/,
      },
    },
    {
      name: 'age',
      validation: {
        type: 'number',
        required: true,
        min: 0,
        max: 120,
      },
    },
    {
      name: 'email',
      validation: {
        type: 'string',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'isActive',
      validation: {
        type: 'boolean',
        required: false,
      },
    },
  ];

  it('should parse valid CSV data correctly', async () => {
    const csvData = Buffer.from(
      'name,age,email,isActive\n' +
      'John Doe,30,john@example.com,true\n' +
      'Jane Smith,25,jane@example.com,false'
    );

    const result = await parseCSV(csvData, columns);

    expect(result.validRows).toHaveLength(2);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.totalRows).toBe(2);
    expect(result.validRows[0]).toEqual({
      name: 'John Doe',
      age: '30',
      email: 'john@example.com',
      isActive: 'true',
    });
  });

  it('should handle invalid rows and skip them', async () => {
    const csvData = Buffer.from(
      'name,age,email,isActive\n' +
      'John Doe,30,john@example.com,true\n' +
      'Invalid Name!,25,invalid-email,maybe\n' +
      'Jane Smith,150,jane@example.com,false\n' +
      'Bob Wilson,45,bob@example.com,true'
    );

    const result = await parseCSV(csvData, columns);

    expect(result.validRows).toHaveLength(2);
    expect(result.invalidRows).toHaveLength(2);
    expect(result.totalRows).toBe(4);

    // Check invalid rows
    expect(result.invalidRows[0].row).toBe(3); // Invalid Name! row
    expect(result.invalidRows[0].errors).toContain('name must match the required pattern');
    expect(result.invalidRows[0].errors).toContain('email must match the required pattern');

    expect(result.invalidRows[1].row).toBe(4); // Jane Smith row
    expect(result.invalidRows[1].errors).toContain('age must be less than or equal to 120');
  });

  it('should handle empty values for optional fields', async () => {
    const csvData = Buffer.from(
      'name,age,email,isActive\n' +
      'John Doe,30,john@example.com,\n' +
      'Jane Smith,25,jane@example.com,false'
    );

    const result = await parseCSV(csvData, columns);

    expect(result.validRows).toHaveLength(2);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.totalRows).toBe(2);
  });

  it('should reject rows with missing required fields', async () => {
    const csvData = Buffer.from(
      'name,age,email,isActive\n' +
      'John Doe,,john@example.com,true\n' +
      ',25,jane@example.com,false\n' +
      'Bob Wilson,45,,true'
    );

    const result = await parseCSV(csvData, columns);

    expect(result.validRows).toHaveLength(0);
    expect(result.invalidRows).toHaveLength(3);
    expect(result.totalRows).toBe(3);

    // Check error messages
    expect(result.invalidRows[0].errors).toContain('age is required');
    expect(result.invalidRows[1].errors).toContain('name is required');
    expect(result.invalidRows[2].errors).toContain('email is required');
  });

  it('should handle malformed CSV data', async () => {
    const csvData = Buffer.from(
      'name,age,email,isActive\n' +
      'John Doe,30,john@example.com,true\n' +
      'Jane Smith,25,"jane@example.com,false\n' + // Unclosed quote
      'Bob Wilson,45,bob@example.com,true'
    );

    await expect(parseCSV(csvData, columns)).rejects.toThrow(CSVParseError);
  });
}); 