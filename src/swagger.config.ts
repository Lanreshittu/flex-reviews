import fs from 'fs';
import path from 'path';

// Read the JSON file with fallback for Vercel
let swaggerSpec: any;
try {
  const swaggerJsonPath = path.join(process.cwd(), 'swagger.json');
  swaggerSpec = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));
} catch (error) {
  // Fallback for Vercel serverless environment
  console.warn('Could not read swagger.json, using fallback configuration');
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Flex Living Reviews API",
      version: "1.0.0",
      description: "API for managing property reviews and dashboard functionality"
    },
    paths: {},
    components: {}
  };
}

export { swaggerSpec };
