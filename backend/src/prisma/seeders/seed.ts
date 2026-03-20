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
    
    printSuccess('Roles seeded successfully:');
    console.log(`  - Admin role: ${adminRole.id} (user: ${adminRole.user_id})`);
    console.log(`  - User role: ${normalRole.id} (user: ${normalRole.user_id})`);
    
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
    console.log('1. View current roles');
    console.log('2. View current users');
    console.log('3. Seed roles only');
    console.log('4. Seed users only');
    console.log('5. Seed both roles and users');
    console.log('6. Clear all data');
    console.log('7. Exit');
    console.log();
    
    const choice = await question('Enter your choice (1-7): ');
    
    switch (choice) {
      case '1':
        await viewCurrentRoles();
        break;
      case '2':
        await viewCurrentUsers();
        break;
      case '3':
        await seedRoles();
        break;
      case '4':
        await seedUsers();
        break;
      case '5':
        await seedBoth();
        break;
      case '6':
        await clearAllData();
        break;
      case '7':
        printInfo('Exiting seeder tool...');
        await cleanup();
        exit(0);
      default:
        printError('Invalid choice. Please enter a number between 1 and 7.');
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
