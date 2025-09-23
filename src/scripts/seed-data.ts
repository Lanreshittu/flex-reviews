// src/scripts/seed-data.ts
import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { HostawayService } from "../services/hostaway.service";
import { GoogleService } from "../services/google.service";

async function seedAllData() {
  try {
    console.log("🚀 Starting data seeding...");
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    // Seed Hostaway reviews
    console.log("📊 Seeding Hostaway reviews...");
    await HostawayService.seedFromMock();
    console.log("✅ Hostaway reviews seeded");

    // Seed Google reviews
    console.log("🔍 Seeding Google reviews...");
    await GoogleService.seedMockGoogleReviews();
    console.log("✅ Google reviews seeded");

    console.log("🎉 All data seeded successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Start the server: npm run dev");
    console.log("2. Open dashboard: http://localhost:3000/public/index.html");
    console.log("3. View property page: http://localhost:3000/public/property.html");
    console.log("4. Test API: http://localhost:3000/api/reviews/hostaway");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  seedAllData();
}

export { seedAllData };
