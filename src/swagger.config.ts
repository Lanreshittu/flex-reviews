import fs from 'fs';
import path from 'path';

// Read the JSON file
const swaggerJsonPath = path.join(process.cwd(), 'swagger.json');
const swaggerSpec = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));

export { swaggerSpec };
