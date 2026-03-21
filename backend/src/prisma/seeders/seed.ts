#!/usr/bin/env tsx

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';
import { exit } from 'process';

// Load environment variables from .env file
config();

// Create independent Prisma client
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for user input
function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

// Helper function to clear console
function clearConsole(): void {
  console.clear();
}

// Helper function to print header
function printHeader(title: string): void {
  clearConsole();
  console.log('='.repeat(60));
  console.log(title);
  console.log('='.repeat(60));
  console.log();
}

// Helper function to print success message
function printSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

// Helper function to print error message
function printError(message: string): void {
  console.log(`❌ ${message}`);
}

// Helper function to print info message
function printInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

// Function to hash password
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if data exists
async function checkExistingData(): Promise<{ roles: number; users: number }> {
  const roles = await prisma.role.count();
  const users = await prisma.user.count();
  return { roles, users };
}

// Function to view current roles
async function viewCurrentRoles(): Promise<void> {
  printHeader('CURRENT ROLES');
  
  try {
    const roles = await prisma.role.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (roles.length === 0) {
      printInfo('No roles found in the database');
    } else {
      console.log(`Found ${roles.length} role(s):`);
      console.log();
      
      roles.forEach((role: any, index: number) => {
        console.log(`${index + 1}. Role Details:`);
        console.log(`   ID: ${role.id}`);
        console.log(`   Access Level: ${role.access_level}`);
        console.log(`   Access Status: ${role.access_status}`);
        console.log(`   User ID: ${role.user_id}`);
        console.log(`   User Name: ${role.user?.name || 'Unknown'}`);
        console.log(`   User Email: ${role.user?.email || 'Unknown'}`);
        console.log();
      });
    }
    
  } catch (error) {
    printError(`Failed to fetch roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('Press Enter to continue...');
}

// Function to view current users
async function viewCurrentUsers(): Promise<void> {
  printHeader('CURRENT USERS');
  
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            access_level: true,
            access_status: true
          }
        }
      }
    });
    
    if (users.length === 0) {
      printInfo('No users found in the database');
    } else {
      console.log(`Found ${users.length} user(s):`);
      console.log();
      
      users.forEach((user: any, index: number) => {
        console.log(`${index + 1}. User Details:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone_number || 'Not provided'}`);
        console.log(`   Roles: ${user.roles.length} role(s)`);
        
        if (user.roles.length > 0) {
          user.roles.forEach((role: any, roleIndex: number) => {
            console.log(`     ${roleIndex + 1}. ${role.access_level} (${role.access_status})`);
          });
        } else {
          console.log(`     No roles assigned`);
        }
        console.log();
      });
    }
    
  } catch (error) {
    printError(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('Press Enter to continue...');
}

// Function to clear all data
async function clearAllData(): Promise<void> {
  printHeader('CLEAR ALL DATA');
  
  try {
    // Show what will be deleted
    const { roles, users } = await checkExistingData();
    console.log(`This will delete:`);
    console.log(`  - ${users} user(s)`);
    console.log(`  - ${roles} role(s)`);
    console.log();
    
    const confirm = await question('Are you absolutely sure you want to delete ALL data? This cannot be undone (type "DELETE" to confirm): ');
    
    if (confirm === 'DELETE') {
      printInfo('Clearing all existing data...');
      
      // Delete in order to respect foreign key constraints
      await prisma.role.deleteMany();
      await prisma.user.deleteMany();
      
      printSuccess('All data cleared successfully');
    } else {
      printInfo('Operation cancelled - data not deleted');
    }
    
  } catch (error) {
    printError(`Failed to clear data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('Press Enter to continue...');
}

// Function to seed roles
async function seedRoles(): Promise<void> {
  printHeader('SEED ROLES');
  
  try {
    const { roles: existingRoles } = await checkExistingData();
    
    if (existingRoles > 0) {
      printInfo(`Found ${existingRoles} existing roles`);
      const clearRoles = await question('Do you want to clear existing roles? (y/n): ');
      
      if (clearRoles.toLowerCase() === 'y') {
        await prisma.role.deleteMany();
        printSuccess('Existing roles cleared');
      } else {
        printInfo('Keeping existing roles');
        return;
      }
    }
    
    // Create admin role
    const adminUserId = await question('Enter user ID for admin role: ');
    const adminRole = await prisma.role.create({
      data: {
        user_id: adminUserId,
        access_level: 'admin',
        access_status: 'active'
      }
    });
    
    // Create normal user role
    const normalUserId = await question('Enter user ID for normal user role: ');
    const normalRole = await prisma.role.create({
      data: {
        user_id: normalUserId,
        access_level: 'user',
        access_status: 'active'
      }
    });

    // Create company owner role
    const companyOwnerId = await question('Enter user ID for company owner role: ');
    const companyOwnerRole = await prisma.role.create({
      data: {
        user_id: companyOwnerId,
        access_level: 'company',
        access_status: 'active'
      }
    });
    
    printSuccess('Roles seeded successfully:');
    console.log(`  - Admin role: ${adminRole.id} (user: ${adminRole.user_id})`);
    console.log(`  - User role: ${normalRole.id} (user: ${normalRole.user_id})`);
    console.log(`  - Company role: ${companyOwnerRole.id} (user: ${companyOwnerRole.user_id})`);
    
  } catch (error) {
    printError(`Failed to seed roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('\nPress Enter to continue...');
}

// Function to get user details from input
async function getUserDetails(roleType: 'admin' | 'user'): Promise<{
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}> {
  printHeader(`CREATE ${roleType.toUpperCase()} USER`);
  
  let name: string;
  let email: string;
  let password: string;
  let confirmPassword: string;
  let phoneNumber: string;
  
  // Get name
  do {
    name = await question(`Enter ${roleType} user name: `);
    if (name.trim().length < 2) {
      printError('Name must be at least 2 characters long');
    }
  } while (name.trim().length < 2);
  
  // Get email
  do {
    email = await question(`Enter ${roleType} user email: `);
    if (!isValidEmail(email)) {
      printError('Please enter a valid email address');
    }
  } while (!isValidEmail(email));
  
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    const overwrite = await question('Email already exists. Do you want to overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      printInfo('Skipping user creation');
      await question('\nPress Enter to continue...');
      return { name, email, password: '', phoneNumber: '' };
    }
  }
  
  // Get password
  do {
    password = await question(`Enter ${roleType} user password: `);
    if (password.length < 6) {
      printError('Password must be at least 6 characters long');
    }
  } while (password.length < 6);
  
  // Confirm password
  do {
    confirmPassword = await question('Confirm password: ');
    if (password !== confirmPassword) {
      printError('Passwords do not match');
    }
  } while (password !== confirmPassword);
  
  // Get phone number (optional)
  phoneNumber = await question('Enter phone number (optional, press Enter to skip): ');
  
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phoneNumber: phoneNumber.trim() || undefined
  };
}

// Function to seed users
async function seedUsers(): Promise<void> {
  printHeader('SEED USERS');
  
  try {
    const { users: existingUsers } = await checkExistingData();
    
    if (existingUsers > 0) {
      printInfo(`Found ${existingUsers} existing users`);
      const clearUsers = await question('Do you want to clear existing users? (y/n): ');
      
      if (clearUsers.toLowerCase() === 'y') {
        await prisma.user.deleteMany();
        printSuccess('Existing users cleared');
      } else {
        printInfo('Keeping existing users');
      }
    }
    
    // Create admin user
    const adminDetails = await getUserDetails('admin');
    if (adminDetails.password) {
      const hashedPassword = await hashPassword(adminDetails.password);
      const adminUser = await prisma.user.create({
        data: {
          name: adminDetails.name,
          email: adminDetails.email,
          password: hashedPassword,
          phone_number: adminDetails.phoneNumber
        }
      });
      
      // Create admin role for the user
      await prisma.role.create({
        data: {
          user_id: adminUser.id,
          access_level: 'admin',
          access_status: 'active'
        }
      });
      
      printSuccess('Admin user created successfully:');
      console.log(`  - Name: ${adminUser.name}`);
      console.log(`  - Email: ${adminUser.email}`);
      console.log(`  - ID: ${adminUser.id}`);
    }
    
    // Create normal user
    const userDetails = await getUserDetails('user');
    if (userDetails.password) {
      const hashedPassword = await hashPassword(userDetails.password);
      const normalUser = await prisma.user.create({
        data: {
          name: userDetails.name,
          email: userDetails.email,
          password: hashedPassword,
          phone_number: userDetails.phoneNumber
        }
      });
      
      // Create user role for the user
      await prisma.role.create({
        data: {
          user_id: normalUser.id,
          access_level: 'user',
          access_status: 'active'
        }
      });
      
      printSuccess('Normal user created successfully:');
      console.log(`  - Name: ${normalUser.name}`);
      console.log(`  - Email: ${normalUser.email}`);
      console.log(`  - ID: ${normalUser.id}`);
    }
    
  } catch (error) {
    printError(`Failed to seed users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('\nPress Enter to continue...');
}

// Function to seed both roles and users
async function seedBoth(): Promise<void> {
  printHeader('SEED ROLES AND USERS');
  printInfo('This will create both users with their corresponding roles');
  
  // Create admin user and role
  const adminDetails = await getUserDetails('admin');
  if (adminDetails.password) {
    const hashedPassword = await hashPassword(adminDetails.password);
    const adminUser = await prisma.user.create({
      data: {
        name: adminDetails.name,
        email: adminDetails.email,
        password: hashedPassword,
        phone_number: adminDetails.phoneNumber
      }
    });
    
    await prisma.role.create({
      data: {
        user_id: adminUser.id,
        access_level: 'admin',
        access_status: 'active'
      }
    });
    
    printSuccess('Admin user and role created successfully');
  }
  
  // Create normal user and role
  const userDetails = await getUserDetails('user');
  if (userDetails.password) {
    const hashedPassword = await hashPassword(userDetails.password);
    const normalUser = await prisma.user.create({
      data: {
        name: userDetails.name,
        email: userDetails.email,
        password: hashedPassword,
        phone_number: userDetails.phoneNumber
      }
    });
    
    await prisma.role.create({
      data: {
        user_id: normalUser.id,
        access_level: 'user',
        access_status: 'active'
      }
    });
    
    printSuccess('Normal user and role created successfully');
  }
  
  await question('\nPress Enter to continue...');
}

// Function to add a single new user
async function addSingleUser(): Promise<void> {
  printHeader('ADD NEW USER');
  
  try {
    let name: string;
    let email: string;
    let password: string;
    let confirmPassword: string;
    let phoneNumber: string;
    
    // Get name
    do {
      name = await question('Enter user name: ');
      if (name.trim().length < 2) {
        printError('Name must be at least 2 characters long');
      }
    } while (name.trim().length < 2);
    
    // Get email
    do {
      email = await question('Enter user email: ');
      if (!isValidEmail(email)) {
        printError('Please enter a valid email address');
      }
      
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() }
      });
      
      if (existingUser) {
        printError('Email already exists. Please use a different email.');
        email = '';
      }
    } while (!isValidEmail(email) || !email);
    
    // Get password
    do {
      password = await question('Enter password: ');
      if (password.length < 6) {
        printError('Password must be at least 6 characters long');
      }
    } while (password.length < 6);
    
    // Confirm password
    do {
      confirmPassword = await question('Confirm password: ');
      if (password !== confirmPassword) {
        printError('Passwords do not match');
      }
    } while (password !== confirmPassword);
    
    // Get phone number (optional)
    phoneNumber = await question('Enter phone number (optional, press Enter to skip): ');
    
    // Create user
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        phone_number: phoneNumber.trim() || undefined
      }
    });
    
    printSuccess('User created successfully:');
    console.log(`  - Name: ${newUser.name}`);
    console.log(`  - Email: ${newUser.email}`);
    console.log(`  - ID: ${newUser.id}`);
    console.log();
    
    // Ask if they want to assign a role immediately
    const assignRole = await question('Do you want to assign a role to this user now? (y/n): ');
    if (assignRole.toLowerCase() === 'y') {
      await assignRoleToUser(newUser.id);
    }
    
  } catch (error) {
    printError(`Failed to add user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('\nPress Enter to continue...');
}

// Function to select a user from the list
async function selectUser(): Promise<string | null> {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        select: {
          access_level: true,
          access_status: true
        }
      }
    }
  });
  
  if (users.length === 0) {
    printError('No users found in the database');
    return null;
  }
  
  console.log('\nAvailable users:');
  users.forEach((user: any, index: number) => {
    const roles = user.roles.map((r: any) => r.access_level).join(', ') || 'No roles';
    console.log(`${index + 1}. ${user.name} (${user.email}) - Roles: ${roles}`);
  });
  console.log();
  
  let selection: number;
  do {
    const input = await question(`Select user (1-${users.length}): `);
    selection = parseInt(input);
    if (isNaN(selection) || selection < 1 || selection > users.length) {
      printError(`Please enter a number between 1 and ${users.length}`);
    }
  } while (isNaN(selection) || selection < 1 || selection > users.length);
  
  return users[selection - 1].id;
}

// Function to assign a role to a user
async function assignRoleToUser(userId?: string): Promise<void> {
  printHeader('ASSIGN ROLE TO USER');
  
  try {
    let targetUserId: string | undefined = userId;
    
    // If no userId provided, let user select
    if (!targetUserId) {
      const selectedUserId = await selectUser();
      if (!selectedUserId) {
        return;
      }
      targetUserId = selectedUserId;
    }
    
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        roles: {
          select: {
            access_level: true,
            access_status: true
          }
        }
      }
    });
    
    if (!user) {
      printError('User not found');
      return;
    }
    
    console.log(`\nAssigning role to: ${user.name} (${user.email})`);
    console.log(`Current roles: ${user.roles.map((r: any) => r.access_level).join(', ') || 'None'}`);
    console.log();
    
    // Select role type
    console.log('Available role types:');
    console.log('1. admin - Full system access');
    console.log('2. company - Company management access');
    console.log('3. user - Regular user access');
    console.log();
    
    let roleChoice: string;
    do {
      roleChoice = await question('Select role type (1-3): ');
      if (!['1', '2', '3'].includes(roleChoice)) {
        printError('Please enter 1, 2, or 3');
      }
    } while (!['1', '2', '3'].includes(roleChoice));
    
    const roleMap: Record<string, string> = {
      '1': 'admin',
      '2': 'company',
      '3': 'user'
    };
    
    const accessLevel = roleMap[roleChoice];
    
    // Check if user already has this role
    const existingRole = await prisma.role.findUnique({
      where: {
        user_id_access_level: {
          user_id: targetUserId,
          access_level: accessLevel
        }
      }
    });
    
    if (existingRole) {
      printError(`User already has the ${accessLevel} role`);
      return;
    }
    
    // Create the role
    const newRole = await prisma.role.create({
      data: {
        user_id: targetUserId,
        access_level: accessLevel,
        access_status: 'active'
      }
    });
    
    printSuccess(`${accessLevel} role assigned successfully to ${user.name}`);
    console.log(`  - Role ID: ${newRole.id}`);
    
  } catch (error) {
    printError(`Failed to assign role: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('\nPress Enter to continue...');
}

// Function to remove a role from a user
async function removeRoleFromUser(): Promise<void> {
  printHeader('REMOVE ROLE FROM USER');
  
  try {
    const userId = await selectUser();
    if (!userId) {
      return;
    }
    
    // Get user with roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    });
    
    if (!user) {
      printError('User not found');
      return;
    }
    
    if (user.roles.length === 0) {
      printError('User has no roles to remove');
      return;
    }
    
    console.log(`\nRemoving role from: ${user.name} (${user.email})`);
    console.log('\nCurrent roles:');
    user.roles.forEach((role: any, index: number) => {
      console.log(`${index + 1}. ${role.access_level} (${role.access_status})`);
    });
    console.log();
    
    let selection: number;
    do {
      const input = await question(`Select role to remove (1-${user.roles.length}): `);
      selection = parseInt(input);
      if (isNaN(selection) || selection < 1 || selection > user.roles.length) {
        printError(`Please enter a number between 1 and ${user.roles.length}`);
      }
    } while (isNaN(selection) || selection < 1 || selection > user.roles.length);
    
    const roleToRemove = user.roles[selection - 1];
    
    // Confirm deletion
    const confirm = await question(`Are you sure you want to remove the ${roleToRemove.access_level} role? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      printInfo('Operation cancelled');
      return;
    }
    
    await prisma.role.delete({
      where: { id: roleToRemove.id }
    });
    
    printSuccess(`${roleToRemove.access_level} role removed from ${user.name}`);
    
  } catch (error) {
    printError(`Failed to remove role: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  await question('\nPress Enter to continue...');
}

// Main menu
async function showMainMenu(): Promise<void> {
  while (true) {
    printHeader('DATABASE SEEDER TOOL');
    
    // Check existing data
    const { roles, users } = await checkExistingData();
    console.log(`Current database status:`);
    console.log(`  - Roles: ${roles}`);
    console.log(`  - Users: ${users}`);
    console.log();
    
    console.log('Please select an operation:');
    console.log();
    console.log('📋 VIEW DATA:');
    console.log('  1. View current roles');
    console.log('  2. View current users');
    console.log();
    console.log('➕ ADD DATA (Incremental):');
    console.log('  3. Add new user');
    console.log('  4. Assign role to existing user');
    console.log('  5. Remove role from user');
    console.log();
    console.log('🌱 SEED DATA (Bulk):');
    console.log('  6. Seed roles only');
    console.log('  7. Seed users only');
    console.log('  8. Seed both roles and users');
    console.log();
    console.log('🗑️  MANAGE:');
    console.log('  9. Clear all data');
    console.log('  0. Exit');
    console.log();
    
    const choice = await question('Enter your choice: ');
    
    switch (choice) {
      case '1':
        await viewCurrentRoles();
        break;
      case '2':
        await viewCurrentUsers();
        break;
      case '3':
        await addSingleUser();
        break;
      case '4':
        await assignRoleToUser();
        break;
      case '5':
        await removeRoleFromUser();
        break;
      case '6':
        await seedRoles();
        break;
      case '7':
        await seedUsers();
        break;
      case '8':
        await seedBoth();
        break;
      case '9':
        await clearAllData();
        break;
      case '0':
        printInfo('Exiting seeder tool...');
        await cleanup();
        exit(0);
      default:
        printError('Invalid choice. Please enter a valid option.');
        await question('\nPress Enter to continue...');
    }
  }
}

// Cleanup function
async function cleanup(): Promise<void> {
  rl.close();
  await prisma.$disconnect();
  await pool.end();
}

// Handle process termination
process.on('SIGINT', async () => {
  printInfo('\nReceived interrupt signal. Cleaning up...');
  await cleanup();
  exit(0);
});

process.on('SIGTERM', async () => {
  printInfo('\nReceived termination signal. Cleaning up...');
  await cleanup();
  exit(0);
});

// Main execution
async function main(): Promise<void> {
  try {
    printHeader('DATABASE SEEDER TOOL');
    printInfo('Starting database seeder...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      printError('DATABASE_URL environment variable is not set');
      printInfo('Please set up your .env file with the correct database URL');
      printInfo('Example: DATABASE_URL=postgresql://username:password@localhost:5432/database_name');
      await cleanup();
      exit(1);
    }
    
    printInfo(`Database URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
    
    // Test database connection
    await prisma.$connect();
    printSuccess('Database connection established');
    
    await showMainMenu();
  } catch (error) {
    printError(`Failed to start seeder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error instanceof Error) {
      if (error.message.includes('EAI_AGAIN') || error.message.includes('ENOTFOUND')) {
        printError('Database connection error: Unable to resolve database host');
        printInfo('Please check your DATABASE_URL in the .env file');
        printInfo('Make sure PostgreSQL is running and accessible');
      } else if (error.message.includes('authentication failed')) {
        printError('Database authentication failed');
        printInfo('Please check your database credentials in DATABASE_URL');
      } else if (error.message.includes('database') && error.message.includes('does not exist')) {
        printError('Database does not exist');
        printInfo('Please create the database or check the database name in DATABASE_URL');
      }
    }
    
    await cleanup();
    exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  main().catch(async (error) => {
    printError(`Unhandled error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    await cleanup();
    exit(1);
  });
}
