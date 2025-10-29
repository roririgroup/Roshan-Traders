const { PrismaClient } = require('@prisma/client');
// Prisma client is typed; cast to any here to avoid TS-checking errors in JS files
const prisma = /** @type {any} */ (new PrismaClient());

class ActingLabourService {
  // Get all acting labours with optional filters
  /**
   * @param {{type?:string,status?:string,assignedToType?:string,search?:string,includeEmployees?:boolean}} filters
   */
  async getAllActingLabours(filters = {}) {
    const transformEmployee = (employee) => {
      let type = 'LOADMAN';
      if (employee.role === 'Driver') type = 'DRIVER';
      else if (employee.role === 'Truck Owner') type = 'TRUCK_OWNER';
      return {
        id: `emp_${employee.id}`,
        name: employee.user.profile?.fullName || 'Unknown',
        type,
        phone: employee.user.phoneNumber,
        email: employee.user.profile?.email || null,
        location: employee.user.profile?.address?.city || 'Unknown',
        status: employee.status === 'Available' ? 'AVAILABLE' : 'BUSY',
        rating: 0.0,
        experience: 0,
        source: 'employee',
        role: employee.role
      };
    };

    



    try {
      const { type, status, assignedToType, search } = filters;

      /** @type {any} */
      const where = {};

      if (type) {
        where.type = type.toUpperCase();
      }

      if (status) {
        where.status = status.toUpperCase();
      }

      if (assignedToType) {
        where.assignedToType = assignedToType;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } }
        ];
      }

      const [actingLabours, employees] = await Promise.all([
        // Fetch acting labours
        prisma.actingLabour.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        }),
        
        // Fetch employees (drivers and truck owners) if requested
        filters.includeEmployees ? prisma.employee.findMany({
          where: {
            OR: [
              { role: 'Driver' },
              { role: 'Truck Owner' }
            ],
            ...(search ? {
              OR: [
                { user: { profile: { fullName: { contains: search, mode: 'insensitive' } } } },
                { user: { phoneNumber: { contains: search } } }
              ]
            } : {}),
            // Match status if specified
            ...(status ? {
              status: status === 'AVAILABLE' ? 'Available' : 'Busy'
            } : {})
          },
          include: {
            user: {
              include: { profile: true }
            }
          }
        }) : Promise.resolve([])
      ]);

      // Transform employees to match acting labour format
      const transformedEmployees = employees.map(transformEmployee);

      // Add source field to acting labours and ensure id is a string
      const transformedActingLabours = actingLabours.map(l => ({
        ...l,
        id: l.id.toString(),
        source: 'acting_labour'
      }));

      // Combine and return both sets
      return [...transformedActingLabours, ...transformedEmployees].map(labour => ({
        ...labour,
        id: labour.id.toString(),
        assignedToId: labour.assignedToId?.toString() || null
      }));

    } catch (error) {
      console.error('Error fetching acting labours:', error);
      throw new Error('Failed to fetch acting labours');
    }
  }

  // Get acting labour by ID
  /** @param {string|number} id */
  async getActingLabourById(id) {
    try {
      const labour = await prisma.actingLabour.findUnique({
        where: { id: Number(id) }
      });

      if (!labour) {
        throw new Error('Acting labour not found');
      }

      return labour;
    } catch (error) {
      console.error('Error fetching acting labour:', error);
      throw error;
    }
  }

  // Create new acting labour
  /** @param {any} labourData */
  async createActingLabour(labourData) {
    try {
      const { name, type, phone, email, location, experience, rating } = labourData;

      if (!name || !type || !phone || !location) {
        throw new Error('Missing required fields: name, type, phone, location');
      }

      const labour = await prisma.actingLabour.create({
        data: {
          name,
          type: type.toUpperCase(),
          phone,
          email,
          location,
          experience: experience || 0,
          rating: rating || 0.0
        }
      });

      return labour;
    } catch (error) {
      console.error('Error creating acting labour:', error);
      throw error;
    }
  }

  // Update acting labour
  /** @param {string|number} id
   *  @param {any} updateData
   */
  async updateActingLabour(id, updateData) {
    try {
      const existingLabour = await this.getActingLabourById(id);

      const updatedLabour = await prisma.actingLabour.update({
  where: { id: Number(id) },
        data: {
          ...updateData,
          type: updateData.type ? updateData.type.toUpperCase() : existingLabour.type,
          status: updateData.status ? updateData.status.toUpperCase() : existingLabour.status,
          updatedAt: new Date()
        }
      });

      return updatedLabour;
    } catch (error) {
      console.error('Error updating acting labour:', error);
      throw error;
    }
  }

  // Delete acting labour
  /** @param {string|number} id */
  async deleteActingLabour(id) {
    try {
      await this.getActingLabourById(id); // Check if exists

      await prisma.actingLabour.delete({
        where: { id: Number(id) }
      });

      return { message: 'Acting labour deleted successfully' };
    } catch (error) {
      console.error('Error deleting acting labour:', error);
      throw error;
    }
  }

  // Assign labour to manufacturer or truck owner
  /** @param {string|number} labourId
   *  @param {{assignedToId: string|number, assignedToType: string}} assignmentData
   */
  async assignLabour(labourId, assignmentData) {
    try {
      const { assignedToId, assignedToType } = assignmentData;

      if (!assignedToId || !assignedToType) {
        throw new Error('Missing assignment data: assignedToId and assignedToType required');
      }

      if (!['manufacturer', 'truck_owner'].includes(assignedToType)) {
        throw new Error('Invalid assignedToType. Must be "manufacturer" or "truck_owner"');
      }

      // Check if labour is available
      const labour = await this.getActingLabourById(labourId);
      if (labour.status !== 'AVAILABLE') {
        throw new Error('Labour is not available for assignment');
      }

      // Check if target exists
      if (assignedToType === 'manufacturer') {
        const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: Number(assignedToId) }
        });
        if (!manufacturer) {
          throw new Error('Manufacturer not found');
        }
        if (!manufacturer.isVerified) {
          throw new Error('Manufacturer is not verified');
        }
      } else if (assignedToType === 'truck_owner') {
        const employee = await prisma.employee.findUnique({
    where: { id: Number(assignedToId) }
        });
        if (!employee) {
          throw new Error('Truck owner not found');
        }
        if (employee.role !== 'Truck Owner') {
          throw new Error('The specified employee is not a truck owner');
        }
      }

      const updatedLabour = await prisma.actingLabour.update({
  where: { id: Number(labourId) },
        data: {
          assignedToId: Number(assignedToId),
          assignedToType,
          status: 'ASSIGNED',
          assignedAt: new Date(),
          updatedAt: new Date()
        }
      });

      return updatedLabour;
    } catch (error) {
      console.error('Error assigning labour:', error);
      throw error;
    }
  }

  // Unassign labour
  /** @param {string|number} labourId */
  async unassignLabour(labourId) {
    try {
      const updatedLabour = await prisma.actingLabour.update({
  where: { id: Number(labourId) },
        data: {
          assignedToId: null,
          assignedToType: null,
          status: 'AVAILABLE',
          assignedAt: null,
          updatedAt: new Date()
        }
      });

      return updatedLabour;
    } catch (error) {
      console.error('Error unassigning labour:', error);
      throw error;
    }
  }

  // Get assigned labours for a manufacturer or truck owner
  /** @param {string|number} targetId
   *  @param {string} targetType
   */
  async getAssignedLabours(targetId, targetType) {
    try {
      if (!['manufacturer', 'truck_owner'].includes(targetType)) {
        throw new Error('Invalid targetType. Must be "manufacturer" or "truck_owner"');
      }

      const labours = await prisma.actingLabour.findMany({
        where: {
          assignedToId: Number(targetId),
          assignedToType: targetType,
          status: 'ASSIGNED'
        },
        orderBy: { assignedAt: 'desc' }
      });

      return labours;
    } catch (error) {
      console.error('Error fetching assigned labours:', error);
      throw error;
    }
  }

  // Get available labours
  /** @param {string|null} type */
  async getAvailableLabours(type = null) {
    try {
    /** @type {any} */
    const where = { status: 'AVAILABLE' };

      if (type) {
        where.type = type.toUpperCase();
      }

      const labours = await prisma.actingLabour.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return labours;
    } catch (error) {
      console.error('Error fetching available labours:', error);
      throw error;
    }
  }
}

module.exports = new ActingLabourService();
