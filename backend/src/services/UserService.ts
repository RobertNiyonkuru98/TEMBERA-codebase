import { UserRepository } from '../repositories/implementations/UserRepository';
import { Prisma, User, Role } from '@prisma/client';

type UserWithRoles = User & { roles: Role[] };

export class UserService {
  private userRepository = new UserRepository();

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    try {
      return await this.userRepository.update(id, data);
    } catch {
      return null;
    }
  }
  async updateRole(
    id: string,
    data: { role: string; accessStatus: string },
  ): Promise<UserWithRoles | null> {
    return await this.userRepository.updateRole(id, data.role, data.accessStatus);
  }

  async getRoles(id: string): Promise<Role[]> {
    return await this.userRepository.findRolesByUserId(id);
  }

  async switchRole(id: string, role: string): Promise<string> {
    return await this.userRepository.switchRole(id, role);
  }
  async delete(id: string): Promise<void> {
      return await this.userRepository.delete(id);
  }
}
