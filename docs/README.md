# TEMBERA Project Documentation - Quick Start Guide

## 📋 Overview

This folder contains comprehensive documentation for the TEMBERA Tourism Platform, including:

1. **Detailed Project Report** - Complete documentation of the system
2. **Architecture Diagrams** - Visual representations using Mermaid syntax
3. **Database Documentation** - Schema and data models

---

## 📁 Documentation Files

### Main Report
- **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** - Complete project report including:
  - 3.1 Introduction
  - 3.2 Research Design (SDLC Model)
  - 3.3 Functional and Non-functional Requirements
  - 3.4 System Architecture
  - 3.5 Diagrams (with links to individual files)
  - 3.6 Development Tools

### Diagrams (Mermaid Syntax)

All diagrams are located in the `diagrams/` subdirectory:

1. **[Use Case Diagram](./diagrams/use-case-diagram.md)**
   - Shows interactions between actors (Visitor, User, Company, Admin) and system
   - 30+ use cases documented
   - Actor descriptions and permissions

2. **[Entity-Relationship Diagram (ERD)](./diagrams/erd-diagram.md)**
   - Complete database schema
   - 8 main entities (User, Role, Company, Itinerary, Booking, etc.)
   - Relationships, constraints, and indexes
   - Data integrity rules

3. **[Class Diagram](./diagrams/class-diagram.md)**
   - Backend architecture classes
   - Controllers, Services, Repositories layers
   - Design patterns and relationships
   - Object-oriented structure

4. **[System Architecture Diagram](./diagrams/system-architecture-diagram.md)**
   - High-level system overview
   - Three-tier architecture
   - Data flow sequences
   - Deployment and security architecture
   - Technology stack details

5. **[Proposed Model Diagram](./diagrams/proposed-model-diagram.md)**
   - System workflows (Registration, Booking, Itinerary Creation)
   - Layered architecture model
   - MVC pattern implementation
   - Role-based access control
   - Design patterns used

### Supporting Documents
- **[DIAGRAMS_SUMMARY.md](./DIAGRAMS_SUMMARY.md)** - Quick reference for all diagrams
- **[DATABASE.doc.md](../DATABASE.doc.md)** - Database documentation
- **[DATABASE.spec.md](../DATABASE.spec.md)** - Database specifications
- **[api.md](./api.md)** - API documentation

---

## 🎯 For Academic Submission

When submitting your project report, include the following sections from PROJECT_REPORT.md:

✅ **Section 3.1**: Introduction (Problem Statement, Solution, Objectives)  
✅ **Section 3.2**: Research Design & SDLC Model (Agile Methodology)  
✅ **Section 3.3**: Functional & Non-functional Requirements  
✅ **Section 3.4**: System Architecture (Detailed architecture description)  
✅ **Section 3.5**: All Diagrams (Reference the individual diagram files)  
✅ **Section 3.6**: Development Tools (Complete technology stack)

---

## 🔍 Quick Reference

### Project Information
- **Name**: TEMBERA Tourism Platform
- **Team**: Team 3 (6 members)
- **Purpose**: Tourism booking and management system
- **Architecture**: Three-tier layered architecture
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express 5 + TypeScript

### Key Features
- User authentication and role management
- Company registration and management
- Itinerary creation with image upload
- Personal and group booking system
- Role-based access control (Admin, Company, User, Visitor)
- RESTful API with Swagger documentation
- Responsive UI for all devices

### Technologies Used

**Frontend:**
- React 19, TypeScript, Vite
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Axios (HTTP Client)

**Backend:**
- Node.js, Express 5, TypeScript
- Prisma 7 (ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- bcrypt (Password Hashing)
- Cloudinary (Image Storage)

**Development Tools:**
- Git (Version Control)
- Swagger (API Documentation)
- Postman (API Testing)
- Winston (Logging)

---

## 📊 Viewing Diagrams

### Option 1: GitHub
Simply view the markdown files on GitHub - Mermaid diagrams render automatically.

### Option 2: Mermaid Live Editor
1. Copy the Mermaid code from any diagram file
2. Go to [https://mermaid.live](https://mermaid.live)
3. Paste the code to see the rendered diagram
4. Export as PNG/SVG if needed

### Option 3: VS Code
1. Install extension: "Markdown Preview Mermaid Support"
2. Open any diagram `.md` file
3. Press `Ctrl+Shift+V` to preview

### Option 4: PyCharm/IntelliJ
1. Install "Mermaid" plugin
2. Open diagram files to see rendered preview

---

## 📝 How to Use This Documentation

### For Report Writing
1. Open **PROJECT_REPORT.md** for the complete report structure
2. Copy sections needed for your submission
3. Reference individual diagram files as needed
4. Customize the content based on your specific requirements

### For Presentations
1. Use diagrams from the `diagrams/` folder
2. Export diagrams as images using Mermaid Live Editor
3. Reference the architecture and workflow diagrams
4. Use the technology stack summary

### For Development
1. Refer to the architecture diagrams for system understanding
2. Use the ERD for database queries and relationships
3. Follow the class diagram for code structure
4. Reference the API documentation for endpoints

---

## 🚀 Next Steps

1. **Review the main report**: Start with PROJECT_REPORT.md
2. **Understand the architecture**: Review system-architecture-diagram.md
3. **Study the database**: Check erd-diagram.md
4. **Learn the workflows**: See proposed-model-diagram.md
5. **Explore use cases**: Read use-case-diagram.md

---

## 📞 Support

For questions or clarifications about this documentation:
- Review the inline comments in code
- Check the Swagger API documentation at `/api/docs`
- Refer to the README files in backend and frontend folders

---

**Last Updated**: March 29, 2026  
**Version**: 1.0  
**Status**: Complete and Ready for Submission

