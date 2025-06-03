import { parseCSV, ColumnDefinition } from '../src/utils/csvParser';

describe('CSV Parser', () => {
  const columns: ColumnDefinition[] = [
    {
      name: 'date',
      validation: { type: 'date', required: true }
    },
    {
      name: 'time',
      validation: { type: 'string', required: true }
    },
    {
      name: 'available',
      validation: { type: 'boolean', required: true }
    }
  ];

  it('should parse valid CSV data correctly', async () => {
    const csvData = `date,time,available
2024-03-20,08:00,true
2024-03-20,08:30,false
2024-03-20,09:00,true`;

    const result = await parseCSV(Buffer.from(csvData), columns);
    
    expect(result.validRows).toHaveLength(3);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.totalRows).toBe(3);
    expect(result.validRows[0]).toEqual({
      date: '2024-03-20',
      time: '08:00',
      available: 'true'
    });
    expect(result.validRows[1]).toEqual({
      date: '2024-03-20',
      time: '08:30',
      available: 'false'
    });
    expect(result.validRows[2]).toEqual({
      date: '2024-03-20',
      time: '09:00',
      available: 'true'
    });
  });

  it('should handle empty CSV data', async () => {
    const csvData = '';
    const result = await parseCSV(Buffer.from(csvData), columns);
    expect(result.validRows).toHaveLength(0);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.totalRows).toBe(0);
  });

  it('should handle CSV data with only headers', async () => {
    const csvData = 'date,time,available';
    const result = await parseCSV(Buffer.from(csvData), columns);
    expect(result.validRows).toHaveLength(0);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.totalRows).toBe(0);
  });

  it('should handle invalid CSV format', async () => {
    const csvData = `invalid,format
not,csv,data`;
    
    await expect(parseCSV(Buffer.from(csvData), columns)).rejects.toThrow();
  });

  it('should validate required fields', async () => {
    const csvData = `date,time,available
2024-03-20,,true
,08:30,false
2024-03-20,09:00,`;

    const result = await parseCSV(Buffer.from(csvData), columns);
    
    expect(result.validRows).toHaveLength(0);
    expect(result.invalidRows).toHaveLength(3);
    expect(result.totalRows).toBe(3);
    expect(result.invalidRows[0].errors).toContain('time is required');
    expect(result.invalidRows[1].errors).toContain('date is required');
    expect(result.invalidRows[2].errors).toContain('available is required');
  });
}); 