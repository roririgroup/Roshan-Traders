// Use shared prisma instance when available to avoid multiple clients
let prisma
try {
  prisma = require('../../shared/lib/db.js')
} catch (e) {
  // Fallback to direct PrismaClient if shared instance not available
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
}

class TruckOwnerService {
  // Dashboard Stats - Updated to work with ActingLabour model
  async getDashboardStats(actingLabourId) {
    try {
      console.log('Fetching dashboard stats for acting labour ID:', actingLabourId);

      // Get total orders assigned to this truck owner
      const totalOrders = await prisma.order.count({
        where: {
          assignedTruckOwnerId: actingLabourId
        }
      });

      // Get orders by status
      const completedOrders = await prisma.order.count({
        where: {
          assignedTruckOwnerId: actingLabourId,
          status: 'COMPLETED'
        }
      });

      const pendingOrders = await prisma.order.count({
        where: {
          assignedTruckOwnerId: actingLabourId,
          status: 'PENDING'
        }
      });

      const inProgressOrders = await prisma.order.count({
        where: {
          assignedTruckOwnerId: actingLabourId,
          status: 'IN_PROGRESS'
        }
      });

      // Get total trucks
      const totalTrucks = await prisma.truck.count({
        where: {
          truckOwnerId: actingLabourId
        }
      });

      // Get total trips
      const totalTrips = await prisma.trip.count({
        where: {
          truckOwnerId: actingLabourId
        }
      });

      // Get trips by status
      const runningTrips = await prisma.trip.count({
        where: {
          truckOwnerId: actingLabourId,
          status: 'Running'
        }
      });

      const upcomingTrips = await prisma.trip.count({
        where: {
          truckOwnerId: actingLabourId,
          status: 'Upcoming'
        }
      });

      const completedTrips = await prisma.trip.count({
        where: {
          truckOwnerId: actingLabourId,
          status: 'Completed'
        }
      });

      // Get recent orders
      const recentOrders = await prisma.order.findMany({
        where: {
          assignedTruckOwnerId: actingLabourId
        },
        include: {
          manufacturer: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          },
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          orderDate: 'desc'
        },
        take: 5
      });

      // Get truck owner profile
      const truckOwner = await prisma.actingLabour.findUnique({
        where: {
          id: actingLabourId
        }
      });

      return {
        overview: {
          totalOrders,
          completedOrders,
          pendingOrders,
          inProgressOrders,
          totalTrucks,
          totalTrips,
          runningTrips,
          upcomingTrips,
          completedTrips,
          completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
        },
        recentOrders,
        truckOwner: {
          name: truckOwner?.name || 'Truck Owner',
          rating: truckOwner?.rating || 0,
          status: truckOwner?.status || 'AVAILABLE',
          experience: truckOwner?.experience || 0
        }
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      
      // Return default stats if there's an error (e.g., tables not created yet)
      if (error.code === 'P2021' || error.code === '42P01' || /relation .* does not exist/i.test(error.message || '')) {
        console.log('Database tables not found, returning default stats');
        return {
          overview: {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            inProgressOrders: 0,
            totalTrucks: 0,
            totalTrips: 0,
            runningTrips: 0,
            upcomingTrips: 0,
            completedTrips: 0,
            completionRate: 0
          },
          recentOrders: [],
          truckOwner: {
            name: 'Truck Owner',
            rating: 0,
            status: 'AVAILABLE',
            experience: 0
          }
        };
      }
      
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }

  // Truck CRUD Operations
  async getTrucks(actingLabourId) {
    try {
      return await prisma.truck.findMany({
        where: { truckOwnerId: actingLabourId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error in getTrucks:', error);
      if (error.code === 'P2021' || error.code === '42P01') {
        return [];
      }
      throw new Error(`Failed to get trucks: ${error.message}`);
    }
  }

  async createTruck(actingLabourId, truckData) {
    try {
      // Check for duplicate truck number
      const existingTruck = await prisma.truck.findUnique({
        where: { truckNo: truckData.truckNo }
      });
      
      if (existingTruck) {
        throw new Error('Truck number already exists');
      }

      return await prisma.truck.create({
        data: {
          ...truckData,
          truckOwnerId: actingLabourId
        }
      });
    } catch (error) {
      console.error('Error in createTruck:', error);
      throw new Error(`Failed to create truck: ${error.message}`);
    }
  }

  async updateTruck(truckId, actingLabourId, truckData) {
    try {
      // Verify ownership
      const truck = await prisma.truck.findFirst({
        where: { id: truckId, truckOwnerId: actingLabourId }
      });

      if (!truck) {
        throw new Error('Truck not found or access denied');
      }

      // Check for duplicate truck number if changing
      if (truckData.truckNo && truckData.truckNo !== truck.truckNo) {
        const existingTruck = await prisma.truck.findUnique({
          where: { truckNo: truckData.truckNo }
        });
        
        if (existingTruck) {
          throw new Error('Truck number already exists');
        }
      }

      return await prisma.truck.update({
        where: { id: truckId },
        data: truckData
      });
    } catch (error) {
      console.error('Error in updateTruck:', error);
      throw new Error(`Failed to update truck: ${error.message}`);
    }
  }

  async deleteTruck(truckId, actingLabourId) {
    try {
      // Verify ownership and check for active trips
      const truck = await prisma.truck.findFirst({
        where: { 
          id: truckId, 
          truckOwnerId: actingLabourId 
        },
        include: { 
          trips: {
            where: {
              status: { in: ['Upcoming', 'Running'] }
            }
          }
        }
      });

      if (!truck) {
        throw new Error('Truck not found or access denied');
      }

      if (truck.trips.length > 0) {
        throw new Error('Cannot delete truck with active trips');
      }

      return await prisma.truck.delete({
        where: { id: truckId }
      });
    } catch (error) {
      console.error('Error in deleteTruck:', error);
      throw new Error(`Failed to delete truck: ${error.message}`);
    }
  }

  // Driver Management (Acting Labour with type DRIVER)
  async getDrivers(actingLabourId) {
    try {
      return await prisma.actingLabour.findMany({
        where: {
          type: 'DRIVER',
          assignedToId: actingLabourId,
          assignedToType: 'truck_owner'
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error in getDrivers:', error);
      if (error.code === 'P2021' || error.code === '42P01') {
        return [];
      }
      throw new Error(`Failed to get drivers: ${error.message}`);
    }
  }

  async createDriver(actingLabourId, driverData) {
    try {
      return await prisma.actingLabour.create({
        data: {
          ...driverData,
          type: 'DRIVER',
          assignedToId: actingLabourId,
          assignedToType: 'truck_owner'
        }
      });
    } catch (error) {
      console.error('Error in createDriver:', error);
      throw new Error(`Failed to create driver: ${error.message}`);
    }
  }

  // Order Management
  async getAssignedOrders(actingLabourId) {
    try {
      return await prisma.order.findMany({
        where: { assignedTruckOwnerId: actingLabourId },
        include: {
          items: {
            include: {
              product: true
            }
          },
          manufacturer: {
            include: {
              user: {
                include: {
                  profile: true
                }
              }
            }
          }
        },
        orderBy: { orderDate: 'desc' }
      });
    } catch (error) {
      console.error('Error in getAssignedOrders:', error);
      if (error.code === 'P2021' || error.code === '42P01') {
        return [];
      }
      throw new Error(`Failed to get assigned orders: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId, actingLabourId, status) {
    try {
      // Verify assignment
      const order = await prisma.order.findFirst({
        where: { 
          id: orderId, 
          assignedTruckOwnerId: actingLabourId 
        }
      });

      if (!order) {
        throw new Error('Order not found or not assigned to you');
      }

      return await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Profile Management
  async getProfile(actingLabourId) {
    try {
      const truckOwner = await prisma.actingLabour.findUnique({
        where: { id: actingLabourId }
      });

      if (!truckOwner) {
        throw new Error('Profile not found');
      }

      return {
        id: truckOwner.id,
        name: truckOwner.name,
        type: truckOwner.type,
        phone: truckOwner.phone,
        email: truckOwner.email,
        location: truckOwner.location,
        status: truckOwner.status,
        experience: truckOwner.experience,
        rating: truckOwner.rating,
        assignedToId: truckOwner.assignedToId,
        assignedToType: truckOwner.assignedToType,
        assignedAt: truckOwner.assignedAt,
        createdAt: truckOwner.createdAt,
        updatedAt: truckOwner.updatedAt
      };
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  async updateProfile(actingLabourId, profileData) {
    try {
      const truckOwner = await prisma.actingLabour.findUnique({
        where: { id: actingLabourId }
      });

      if (!truckOwner) {
        throw new Error('Profile not found');
      }

      return await prisma.actingLabour.update({
        where: { id: actingLabourId },
        data: profileData
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Trip Management
  async getTrips(actingLabourId) {
    try {
      return await prisma.trip.findMany({
        where: { truckOwnerId: actingLabourId },
        include: {
          truck: true,
          driver: true,
          order: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error in getTrips:', error);
      if (error.code === 'P2021' || error.code === '42P01') {
        return [];
      }
      throw new Error(`Failed to get trips: ${error.message}`);
    }
  }
}

module.exports = new TruckOwnerService();