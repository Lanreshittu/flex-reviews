// src/server.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config";
import { AppDataSource } from "./data-source";
import hostawayRoutes from "./routes/hostaway.routes";
import reviewsRoutes from "./routes/reviews.routes";
import adminRoutes from "./routes/admin.routes";
import googleRoutes from "./routes/google.routes";
import propertyRoutes from "./routes/property.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Flex Living Reviews API',
  swaggerOptions: {
    url: '/api-docs.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    layout: "StandaloneLayout"
  }
}));

app.get("/health", (_req: any, res: any) => res.json({ ok: true }));

// Swagger JSON endpoint for debugging
app.get("/api-docs.json", (_req: any, res: any) => {
  res.json(swaggerSpec);
});

app.use("/api/reviews/hostaway", hostawayRoutes); // <-- assessed endpoint
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/analytics", analyticsRoutes);

AppDataSource.initialize().then(() => {
  const port = parseInt(process.env.PORT || '4000', 10);
  const host = process.env.HOST || 'localhost';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = process.env.BASE_URL || `${protocol}://${host}:${port}`;
  
  app.listen(port, host, () => {
    console.log(`🚀 PostgreSQL server listening on ${host}:${port}`);
    console.log(`📊 Health check: ${baseUrl}/health`);
    console.log(`📋 API endpoint: ${baseUrl}/api/reviews/hostaway`);
    console.log(`📚 API Documentation: ${baseUrl}/api-docs`);
    console.log(`🏠 Dashboard: ${baseUrl}/index.html`);
    console.log(`🏡 Property page: ${baseUrl}/property.html`);
    console.log(`💾 Database: PostgreSQL with TypeORM`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((error) => {
  console.error("❌ Database connection failed:", error.message);
  console.log("\n🔧 Troubleshooting suggestions:");
  console.log("1. Make sure PostgreSQL is running");
  console.log("2. Check if the database 'flex' exists");
  console.log("3. Verify credentials in env file");
  console.log("4. Try creating the database: CREATE DATABASE flex;");
  process.exit(1);
});

export default app;
