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
  // Dashboard Stats
  async getDashboardStats(truckOwnerId) {
    try {
      // Some environments may not have the generated Prisma client methods (e.g., prisma.truck)
      // In that case, fallback to raw SQL queries to compute basic stats.
      let truckStats = []
      let tripStats = []
      let earnings = { _count: 0 }

      if (prisma.truck && typeof prisma.truck.groupBy === 'function') {
        truckStats = await prisma.truck.groupBy({ by: ['status'], where: { truckOwnerId }, _count: true })
      } else {
        // Raw SQL fallback
        truckStats = await prisma.$queryRaw`
          SELECT status, COUNT(*) as _count FROM trucks WHERE "truckOwnerId" = ${truckOwnerId} GROUP BY status`
      }

      if (prisma.trip && typeof prisma.trip.groupBy === 'function') {
        tripStats = await prisma.trip.groupBy({ by: ['status'], where: { truckOwnerId }, _count: true })
      } else {
        tripStats = await prisma.$queryRaw`
          SELECT status, COUNT(*) as _count FROM trips WHERE "truckOwnerId" = ${truckOwnerId} GROUP BY status`
      }

      if (prisma.trip && typeof prisma.trip.aggregate === 'function') {
        earnings = await prisma.trip.aggregate({ where: { truckOwnerId, status: 'Completed' }, _count: true })
      } else {
        const res = await prisma.$queryRaw`
          SELECT COUNT(*) as _count FROM trips WHERE "truckOwnerId" = ${truckOwnerId} AND status = 'Completed'`
        earnings = { _count: Array.isArray(res) ? Number(res[0]._count) : Number(res._count) }
      }

      const totalTrucks = truckStats.reduce ? truckStats.reduce((sum, stat) => sum + Number(stat._count), 0) : 0
      const activeTrucks = (truckStats.find && (truckStats.find(s => s.status === 'Active')?._count)) || 0
      const inactiveTrucks = (truckStats.find && (truckStats.find(s => s.status === 'Inactive')?._count)) || 0

      const runningTrips = (tripStats.find && (tripStats.find(s => s.status === 'Running')?._count)) || 0
      const upcomingTrips = (tripStats.find && (tripStats.find(s => s.status === 'Upcoming')?._count)) || 0
      const completedTrips = (tripStats.find && (tripStats.find(s => s.status === 'Completed')?._count)) || 0

      return {
        totalTrucks,
        activeTrucks,
        inactiveTrucks,
        runningTrips,
        upcomingTrips,
        completedTrips,
        monthlyEarnings: 125000, // Mock data - implement payment tracking
        yearlyEarnings: 1500000  // Mock data - implement payment tracking
      }
    } catch (error) {
      // If DB table not found (e.g., migrations not applied), return empty/default stats
      if (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message || ''))) {
        return {
          totalTrucks: 0,
          activeTrucks: 0,
          inactiveTrucks: 0,
          runningTrips: 0,
          upcomingTrips: 0,
          completedTrips: 0,
          monthlyEarnings: 0,
          yearlyEarnings: 0
        }
      }
      throw new Error(`Failed to get dashboard stats: ${error.message}`)
    }
  }

  // Truck CRUD Operations
  async getTrucks(truckOwnerId) {
    try {
      if (prisma.truck && typeof prisma.truck.findMany === 'function') {
        return await prisma.truck.findMany({ where: { truckOwnerId }, orderBy: { createdAt: 'desc' } })
      }

      // Raw SQL fallback
      return await prisma.$queryRaw`
        SELECT * FROM trucks WHERE "truckOwnerId" = ${truckOwnerId} ORDER BY "createdAt" DESC`
    } catch (error) {
      if (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message || ''))) {
        return []
      }
      throw new Error(`Failed to get trucks: ${error.message}`)
    }
  }

  async createTruck(truckOwnerId, truckData) {
    try {
      // Check for duplicate truck number
      if (prisma.truck && typeof prisma.truck.findUnique === 'function') {
        const existingTruck = await prisma.truck.findUnique({ where: { truckNo: truckData.truckNo } })
        if (existingTruck) throw new Error('Truck number already exists')

        return await prisma.truck.create({ data: { ...truckData, truckOwnerId } })
      }

      // Raw SQL fallback: insert row and return the created record
      const insert = await prisma.$queryRaw`
        INSERT INTO trucks ("truckOwnerId", "truckNo", type, capacity, "rcDetails", status, documents, "nextService", "createdAt", "updatedAt")
        VALUES (${truckOwnerId}, ${truckData.truckNo}, ${truckData.type || null}, ${truckData.capacity || null}, ${truckData.rcDetails || null}, ${truckData.status || 'Active'}, ${truckData.documents ? JSON.stringify(truckData.documents) : null}, ${truckData.nextService || null}, now(), now())
        RETURNING *`
      return Array.isArray(insert) ? insert[0] : insert
    } catch (error) {
      throw new Error(`Failed to create truck: ${error.message}`)
    }
  }

  async updateTruck(truckId, truckOwnerId, truckData) {
    try {
      // Verify ownership
        let truck
        if (prisma.truck && typeof prisma.truck.findFirst === 'function') {
          truck = await prisma.truck.findFirst({
        where: { id: truckId, truckOwnerId }
      })
        } else {
          const rows = await prisma.$queryRaw`
            SELECT * FROM trucks WHERE id = ${truckId} AND "truckOwnerId" = ${truckOwnerId} LIMIT 1`
          truck = Array.isArray(rows) ? rows[0] : rows
        }

      if (!truck) {
        throw new Error('Truck not found or access denied')
      }

      // Check for duplicate truck number if changing
      if (truckData.truckNo && truckData.truckNo !== truck.truckNo) {
        if (prisma.truck && typeof prisma.truck.findUnique === 'function') {
          const existingTruck = await prisma.truck.findUnique({ where: { truckNo: truckData.truckNo } })
          if (existingTruck) throw new Error('Truck number already exists')
        } else {
          const existing = await prisma.$queryRaw`
            SELECT * FROM trucks WHERE "truckNo" = ${truckData.truckNo} LIMIT 1`
          if (Array.isArray(existing) && existing.length > 0) throw new Error('Truck number already exists')
        }
      }

      if (prisma.truck && typeof prisma.truck.update === 'function') {
        return await prisma.truck.update({ where: { id: truckId }, data: truckData })
      }

      // Raw SQL fallback for update
      const setClauses = Object.keys(truckData).map((k, i) => `"${k}" = $${i + 2}`).join(', ')
      const values = [truckId, ...Object.values(truckData)]
      const updated = await prisma.$queryRawUnsafe(
        `UPDATE trucks SET ${setClauses}, "updatedAt" = now() WHERE id = $1 RETURNING *`,
        ...values
      )
      return Array.isArray(updated) ? updated[0] : updated
    } catch (error) {
      throw new Error(`Failed to update truck: ${error.message}`)
    }
  }

  async deleteTruck(truckId, truckOwnerId) {
    try {
      // Verify ownership and check for active trips
      let truck
      if (prisma.truck && typeof prisma.truck.findFirst === 'function') {
        truck = await prisma.truck.findFirst({ where: { id: truckId, truckOwnerId }, include: { trips: { where: { status: { in: ['Upcoming', 'Running'] } } } } })
      } else {
        const rows = await prisma.$queryRaw`
          SELECT t.*, (SELECT COUNT(*) FROM trips tr WHERE tr."truckId" = t.id AND tr.status IN ('Upcoming','Running')) as active_trips
          FROM trucks t WHERE t.id = ${truckId} AND t."truckOwnerId" = ${truckOwnerId} LIMIT 1`
        truck = Array.isArray(rows) ? rows[0] : rows
        truck.trips = truck.active_trips ? Array.from({ length: Number(truck.active_trips) }) : []
      }

      if (!truck) {
        throw new Error('Truck not found or access denied')
      }

      if (truck.trips.length > 0) {
        throw new Error('Cannot delete truck with active trips')
      }

      if (prisma.truck && typeof prisma.truck.delete === 'function') {
        return await prisma.truck.delete({ where: { id: truckId } })
      }

      await prisma.$queryRaw`
        DELETE FROM trucks WHERE id = ${truckId}`
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete truck: ${error.message}`)
    }
  }

  // Driver Management (Acting Labour with type DRIVER)
  async getDrivers(truckOwnerId) {
    try {
      return await prisma.actingLabour.findMany({
        where: {
          type: 'DRIVER',
          assignedToId: truckOwnerId,
          assignedToType: 'truck_owner'
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      if (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message || ''))) {
        return []
      }
      throw new Error(`Failed to get drivers: ${error.message}`)
    }
  }

  async createDriver(truckOwnerId, driverData) {
    try {
      return await prisma.actingLabour.create({
        data: {
          ...driverData,
          type: 'DRIVER',
          assignedToId: truckOwnerId,
          assignedToType: 'truck_owner'
        }
      })
    } catch (error) {
      throw new Error(`Failed to create driver: ${error.message}`)
    }
  }

  async updateDriver(driverId, truckOwnerId, driverData) {
    try {
      // Verify ownership
      const driver = await prisma.actingLabour.findFirst({
        where: {
          id: driverId,
          type: 'DRIVER',
          assignedToId: truckOwnerId,
          assignedToType: 'truck_owner'
        }
      })

      if (!driver) {
        throw new Error('Driver not found or access denied')
      }

      return await prisma.actingLabour.update({
        where: { id: driverId },
        data: driverData
      })
    } catch (error) {
      throw new Error(`Failed to update driver: ${error.message}`)
    }
  }

  async deleteDriver(driverId, truckOwnerId) {
    try {
      // Verify ownership
      const driver = await prisma.actingLabour.findFirst({
        where: {
          id: driverId,
          type: 'DRIVER',
          assignedToId: truckOwnerId,
          assignedToType: 'truck_owner'
        }
      })

      if (!driver) {
        throw new Error('Driver not found or access denied')
      }

      // Check if driver has active trips
      const activeTrips = await prisma.trip.findMany({
        where: {
          driverId: driverId,
          status: { in: ['Upcoming', 'Running'] }
        }
      })

      if (activeTrips.length > 0) {
        throw new Error('Cannot delete driver with active trips')
      }

      return await prisma.actingLabour.delete({
        where: { id: driverId }
      })
    } catch (error) {
      throw new Error(`Failed to delete driver: ${error.message}`)
    }
  }

  async assignDriverToTruck(driverId, truckId, truckOwnerId) {
    try {
      // Verify ownership
      const [driver, truck] = await Promise.all([
        prisma.actingLabour.findFirst({
          where: {
            id: driverId,
            type: 'DRIVER',
            assignedToId: truckOwnerId,
            assignedToType: 'truck_owner'
          }
        }),
        prisma.truck.findFirst({
          where: { id: truckId, truckOwnerId }
        })
      ])

      if (!driver) {
        throw new Error('Driver not found or access denied')
      }

      if (!truck) {
        throw new Error('Truck not found or access denied')
      }

      // Update driver assignment
      return await prisma.actingLabour.update({
        where: { id: driverId },
        data: {
          status: 'ASSIGNED',
          assignedAt: new Date()
        }
      })
    } catch (error) {
      throw new Error(`Failed to assign driver: ${error.message}`)
    }
  }

  // Trip Management
  async getTrips(truckOwnerId) {
    try {
      return await prisma.trip.findMany({
        where: { truckOwnerId },
        include: {
          truck: true,
          driver: true,
          order: true
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      if (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message || ''))) {
        return []
      }
      throw new Error(`Failed to get trips: ${error.message}`)
    }
  }

  async createTrip(truckOwnerId, tripData) {
    try {
      // Verify truck ownership
      const truck = await prisma.truck.findFirst({
        where: { id: tripData.truckId, truckOwnerId }
      })

      if (!truck) {
        throw new Error('Truck not found or access denied')
      }

      // If driver is assigned, verify ownership
      if (tripData.driverId) {
        const driver = await prisma.actingLabour.findFirst({
          where: {
            id: tripData.driverId,
            type: 'DRIVER',
            assignedToId: truckOwnerId,
            assignedToType: 'truck_owner'
          }
        })

        if (!driver) {
          throw new Error('Driver not found or access denied')
        }
      }

      return await prisma.trip.create({
        data: {
          ...tripData,
          truckOwnerId
        },
        include: {
          truck: true,
          driver: true
        }
      })
    } catch (error) {
      throw new Error(`Failed to create trip: ${error.message}`)
    }
  }

  async updateTripStatus(tripId, truckOwnerId, status, additionalData = {}) {
    try {
      // Verify ownership
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, truckOwnerId }
      })

      if (!trip) {
        throw new Error('Trip not found or access denied')
      }

      const updateData = { status }

      if (status === 'Running' && !trip.startTime) {
        updateData.startTime = new Date()
      } else if (status === 'Completed' && !trip.actualArrival) {
        updateData.actualArrival = new Date()
      }

      return await prisma.trip.update({
        where: { id: tripId },
        data: { ...updateData, ...additionalData }
      })
    } catch (error) {
      throw new Error(`Failed to update trip status: ${error.message}`)
    }
  }

  // Order Management
  async getAssignedOrders(truckOwnerId) {
    try {
      return await prisma.order.findMany({
        where: { assignedTruckOwnerId: truckOwnerId },
        include: {
          items: {
            include: {
              product: true
            }
          },
          manufacturer: true
        },
        orderBy: { orderDate: 'desc' }
      })
    } catch (error) {
      if (error && (error.code === '42P01' || /relation .* does not exist/i.test(error.message || ''))) {
        return []
      }
      throw new Error(`Failed to get assigned orders: ${error.message}`)
    }
  }

  async updateOrderStatus(orderId, truckOwnerId, status) {
    try {
      // Verify assignment
      const order = await prisma.order.findFirst({
        where: { id: orderId, assignedTruckOwnerId: truckOwnerId }
      })

      if (!order) {
        throw new Error('Order not found or not assigned to you')
      }

      return await prisma.order.update({
        where: { id: orderId },
        data: { status }
      })
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`)
    }
  }

  // Profile Management
  async getProfile(truckOwnerId) {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: truckOwnerId },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      })

      if (!employee) {
        throw new Error('Profile not found')
      }

      return {
        id: employee.id,
        employeeCode: employee.employeeCode,
        role: employee.role,
        status: employee.status,
        salary: employee.salary,
        hireDate: employee.hireDate,
        user: employee.user,
        profile: employee.user.profile
      }
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`)
    }
  }

  async updateProfile(truckOwnerId, profileData) {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: truckOwnerId },
        include: { user: true }
      })

      if (!employee) {
        throw new Error('Profile not found')
      }

      // Update user profile if provided
      if (profileData.userProfile) {
        await prisma.userProfile.upsert({
          where: { userId: employee.userId },
          update: profileData.userProfile,
          create: {
            userId: employee.userId,
            ...profileData.userProfile
          }
        })
      }

      // Update employee data if provided
      if (profileData.employeeData) {
        await prisma.employee.update({
          where: { id: truckOwnerId },
          data: profileData.employeeData
        })
      }

      return await this.getProfile(truckOwnerId)
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
  }
}

module.exports = new TruckOwnerService()
