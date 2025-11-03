const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ManufacturerEmployeeService {
  // Helper function to serialize BigInt values
  serializeEmployee(employee) {
    return {
      ...employee,
      id: employee.id.toString(),
      manufacturerId: employee.manufacturerId.toString(),
    };
  }
  

  // Get all employees for a manufacturer
  async getAllEmployees(manufacturerId) {
    try {
      const employees = await prisma.manufacturerEmployee.findMany({
        where: {
          manufacturerId: parseInt(manufacturerId)
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return employees.map(this.serializeEmployee);
    } catch (error) {
      throw new Error(`Error fetching employees: ${error.message}`);
    }
  }
  

  // Get employees by role for a manufacturer
  async getEmployeesByRole(manufacturerId, role) {
    try {
      const employees = await prisma.manufacturerEmployee.findMany({
        where: {
          manufacturerId: parseInt(manufacturerId),
          role: role
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return employees.map(this.serializeEmployee);
    } catch (error) {
      throw new Error(`Error fetching employees by role: ${error.message}`);
    }
  }

  // Get employee by ID
  async getEmployeeById(employeeId) {
    try {
      const employee = await prisma.manufacturerEmployee.findUnique({
        where: {
          id: parseInt(employeeId)
        }
      });
      if (!employee) {
        throw new Error('Employee not found');
      }
      return this.serializeEmployee(employee);
    } catch (error) {
      throw new Error(`Error fetching employee: ${error.message}`);
    }
  }

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const employee = await prisma.manufacturerEmployee.create({
        data: {
          manufacturerId: parseInt(employeeData.manufacturerId),
          name: employeeData.name,
          address: employeeData.address,
          phone: employeeData.phone,
          role: employeeData.role,
          status: employeeData.status || 'active'
        }
      });
      return this.serializeEmployee(employee);
    } catch (error) {
      throw new Error(`Error creating employee: ${error.message}`);
    }
  }

  // Update employee
  async updateEmployee(employeeId, updateData) {
    try {
      const employee = await prisma.manufacturerEmployee.update({
        where: {
          id: parseInt(employeeId)
        },
        data: {
          name: updateData.name,
          address: updateData.address,
          phone: updateData.phone,
          role: updateData.role,
          status: updateData.status
        }
      });
      return this.serializeEmployee(employee);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Employee not found');
      }
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }

  // Delete employee
  async deleteEmployee(employeeId) {
    try {
      await prisma.manufacturerEmployee.delete({
        where: {
          id: parseInt(employeeId)
        }
      });
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Employee not found');
      }
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  // Get employee statistics for a manufacturer
  async getEmployeeStats(manufacturerId) {
    try {
      const stats = await prisma.manufacturerEmployee.groupBy({
        by: ['role', 'status'],
        where: {
          manufacturerId: parseInt(manufacturerId)
        },
        _count: {
          id: true
        }
      });

      const totalEmployees = await prisma.manufacturerEmployee.count({
        where: {
          manufacturerId: parseInt(manufacturerId)
        }
      });

      const activeEmployees = await prisma.manufacturerEmployee.count({
        where: {
          manufacturerId: parseInt(manufacturerId),
          status: 'active'
        }
      });

      return {
        totalEmployees,
        activeEmployees,
        inactiveEmployees: totalEmployees - activeEmployees,
        roleBreakdown: stats
      };
    } catch (error) {
      throw new Error(`Error fetching employee stats: ${error.message}`);
    }
  }
}

module.exports = new ManufacturerEmployeeService();
