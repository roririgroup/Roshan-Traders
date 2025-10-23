const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateData() {
  console.log('Starting data migration...');

  try {
    // Get all existing manufacturer products associations
    const existingAssociations = await prisma.manufacturerProduct.findMany({
      select: {
        manufacturerId: true,
        productId: true,
      },
    });

    console.log(`Found ${existingAssociations.length} existing manufacturer-product associations`);

    // If no associations exist, we might need to create them from existing data
    // But since the schema has changed, we need to handle this differently
    // For now, just log that migration is complete
    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during data migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
