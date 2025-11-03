// // const { PrismaClient } = require('@prisma/client');
// // const prisma = new PrismaClient();

// async function main() {
//   console.log("✅ Seed script is running...");


// // async function main() {
// //   console.log("✅ Seed script is running...");

// //   // -------------------- MANUFACTURERS --------------------
// //   const manufacturer1User = await prisma.user.upsert({
// //     where: { phoneNumber: '0000000001' },
// //     update: {},
// //     create: {
// //       phoneNumber: '0000000001',
// //       userType: 'MANUFACTURER',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'RN Tiles Owner' },
// //       },
// //     },
// //   });


// //   await prisma.manufacturer.upsert({
// //     where: { userId: manufacturer1User.id },
// //     update: {},
// //     create: {
// //       userId: manufacturer1User.id,
// //       companyName: 'rn tiles',
// //       location: 'nallanathapuram',
// //       isVerified: true,
// //     },
// //   });

// //   const manufacturer2User = await prisma.user.upsert({
// //     where: { phoneNumber: '0000000002' },
// //     update: {},
// //     create: {
// //       phoneNumber: '0000000002',
// //       userType: 'MANUFACTURER',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'RKS Bricks Owner' },
// //       },
// //     },
// //   });

// //   await prisma.manufacturer.upsert({
// //     where: { userId: manufacturer2User.id },
// //     update: {},
// //     create: {
// //       userId: manufacturer2User.id,
// //       companyName: 'rks bricks',
// //       location: 'chambar',
// //       isVerified: true,
// //     },
// //   });

// //   // -------------------- AGENTS --------------------
// //   const agent1User = await prisma.user.upsert({
// //     where: { phoneNumber: '0000000003' },
// //     update: {},
// //     create: {
// //       phoneNumber: '0000000003',
// //       userType: 'AGENT',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'David' },
// //       },
// //     },
// //   });

// //   await prisma.agent.upsert({
// //     where: { userId: agent1User.id },
// //     update: {},
// //     create: {
// //       userId: agent1User.id,
// //       agentCode: 'AGT001',
// //       assignedArea: 'pudhur',
// //       isApproved: true,
// //     },
// //   });

// //   const agent2User = await prisma.user.upsert({
// //     where: { phoneNumber: '0000000004' },
// //     update: {},
// //     create: {
// //       phoneNumber: '0000000004',
// //       userType: 'AGENT',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'iyappan' },
// //       },
// //     },
// //   });

// //   await prisma.agent.upsert({
// //     where: { userId: agent2User.id },
// //     update: {},
// //     create: {
// //       userId: agent2User.id,
// //       agentCode: 'AGT002',
// //       assignedArea: 'mavadi',
// //       isApproved: true,
// //     },
// //   });

// //   // -------------------- TRUCK OWNERS --------------------
// //   const truckOwner1User = await prisma.user.upsert({
// //     where: { phoneNumber: '6379001161' },
// //     update: {},
// //     create: {
// //       phoneNumber: '6379001161',
// //       userType: 'ADMIN',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'raja', address: { city: 'pudhur' } },
// //       },
// //     },
// //   });

// //   await prisma.employee.upsert({
// //     where: { userId: truckOwner1User.id },
// //     update: {},
// //     create: {
// //       userId: truckOwner1User.id,
// //       employeeCode: 'EMP001',
// //       role: 'Truck Owner',
// //     },
// //   });

// //   const truckOwner2User = await prisma.user.upsert({
// //     where: { phoneNumber: '6374932516' },
// //     update: {},
// //     create: {
// //       phoneNumber: '6374932516',
// //       userType: 'ADMIN',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'arul', address: { city: 'pothaisuthi' } },
// //       },
// //     },
// //   });

// //   await prisma.employee.upsert({
// //     where: { userId: truckOwner2User.id },
// //     update: {},
// //     create: {
// //       userId: truckOwner2User.id,
// //       employeeCode: 'EMP002',
// //       role: 'Truck Owner',
// //     },
// //   });

// //   // -------------------- DRIVERS --------------------
// //   const driver1User = await prisma.user.upsert({
// //     where: { phoneNumber: '8760231148' },
// //     update: {},
// //     create: {
// //       phoneNumber: '8760231148',
// //       userType: 'ADMIN',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'jebamani', address: { city: 'pudhur' } },
// //       },
// //     },
// //   });

// //   await prisma.employee.upsert({
// //     where: { userId: driver1User.id },
// //     update: {},
// //     create: {
// //       userId: driver1User.id,
// //       employeeCode: 'EMP003',
// //       role: 'Driver',
// //     },
// //   });

// //   const driver2User = await prisma.user.upsert({
// //     where: { phoneNumber: '0000000005' },
// //     update: {},
// //     create: {
// //       phoneNumber: '0000000005',
// //       userType: 'ADMIN',
// //       isVerified: true,
// //       isActive: true,
// //       profile: {
// //         create: { fullName: 'selvaraj', address: { city: 'mavadi' } },
// //       },
// //     },
// //   });

// //   await prisma.employee.upsert({
// //     where: { userId: driver2User.id },
// //     update: {},
// //     create: {
// //       userId: driver2User.id,
// //       employeeCode: 'EMP004',
// //       role: 'Driver',
// //     },
// //   });

// //   console.log("✅ Seed data created successfully!");
// // }

// // // -------------------- EXECUTION HANDLER --------------------
// // main()
// //   .then(async () => {
// //     await prisma.$disconnect();
// //   })
// //   .catch(async (e) => {
// //     console.error("❌ Error while seeding:", e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });
// const prisma = new PrismaClient();
