import { connectDB } from "../database/config";
import BaseUser, { IBaseUser } from "../database/models/BaseUser";
import { UserRole } from "../database/types";
import bcrypt from "bcrypt";
import * as documentQuery from "../database/query/document";
import * as tagQuery from "../database/query/tag";
import * as documentTagQuery from "../database/query/documentTag";
import mongoose from "mongoose";
import "../env";

// Helper function to create a mock file object
const createMockFile = (filename: string, content: string, mimeType: string = "text/plain") => {
  return {
    originalname: filename,
    mimetype: mimeType,
    buffer: Buffer.from(content, "utf-8"),
    size: Buffer.from(content, "utf-8").length,
  } as Express.Multer.File;
};

async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database!");

    // Create all 4 user types
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: UserRole.admin,
      },
      {
        name: "Support User",
        email: "support@example.com",
        password: hashedPassword,
        role: UserRole.support,
      },
      {
        name: "Moderator User",
        email: "moderator@example.com",
        password: hashedPassword,
        role: UserRole.moderator,
      },
      {
        name: "Regular User 1",
        email: "user1@example.com",
        password: hashedPassword,
        role: UserRole.user,
      },
      {
        name: "Regular User 2",
        email: "user2@example.com",
        password: hashedPassword,
        role: UserRole.user,
      },
    ];

    console.log("\nCreating users...");
    const createdUsers: IBaseUser[] = [];
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await BaseUser.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
      } else {
        const user = new BaseUser(userData);
        await user.save();
        console.log(`✓ Created ${userData.role} user: ${userData.email}`);
        createdUsers.push(user);
      }
    }

    // Get the two users we'll use for document uploads (USER role)
    const user1 = createdUsers.find(u => u.email === "user1@example.com");
    const user2 = createdUsers.find(u => u.email === "user2@example.com");

    if (!user1 || !user2) {
      throw new Error("Could not find users for document upload");
    }

    console.log("\nUploading documents...");

    // Upload documents for User 1 (user@example.com)
    console.log(`\nUploading documents for ${user1.email}...`);
    
    const doc1File = createMockFile(
      "project-requirements.txt",
      "This document contains the project requirements.\n\nKey Features:\n- User authentication\n- Document management\n- Tag-based organization\n- Full-text search",
      "text/plain"
    );
    const doc1 = await documentQuery.addDocument({
      ownerId: user1._id.toString(),
      filename: doc1File.originalname,
      mime: doc1File.mimetype,
      textContent: doc1File.buffer.toString("utf-8"),
    });
    const primaryTag1 = await tagQuery.findOrCreateTag("Projects", user1._id.toString());
    await documentTagQuery.createDocumentTag({
      documentId: doc1._id.toString(),
      tagId: primaryTag1._id.toString(),
      isPrimary: true,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc1._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("requirements", user1._id.toString()))._id.toString(),
      isPrimary: false,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc1._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("planning", user1._id.toString()))._id.toString(),
      isPrimary: false,
    });
    console.log(`✓ Created document: ${doc1File.originalname} with primary tag "Projects" and secondary tags: requirements, planning`);

    const doc2File = createMockFile(
      "meeting-notes-2024.md",
      "# Meeting Notes - January 2024\n\n## Agenda\n1. Review project progress\n2. Discuss new features\n3. Plan next sprint\n\n## Action Items\n- Complete API documentation\n- Set up testing environment",
      "text/markdown"
    );
    const doc2 = await documentQuery.addDocument({
      ownerId: user1._id.toString(),
      filename: doc2File.originalname,
      mime: doc2File.mimetype,
      textContent: doc2File.buffer.toString("utf-8"),
    });
    const primaryTag2 = await tagQuery.findOrCreateTag("Meetings", user1._id.toString());
    await documentTagQuery.createDocumentTag({
      documentId: doc2._id.toString(),
      tagId: primaryTag2._id.toString(),
      isPrimary: true,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc2._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("notes", user1._id.toString()))._id.toString(),
      isPrimary: false,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc2._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("2024", user1._id.toString()))._id.toString(),
      isPrimary: false,
    });
    console.log(`✓ Created document: ${doc2File.originalname} with primary tag "Meetings" and secondary tags: notes, 2024`);

    const doc3File = createMockFile(
      "api-documentation.json",
      JSON.stringify({
        endpoints: [
          { path: "/api/v1/search", method: "GET", description: "Search documents and folders" },
          { path: "/api/v1/folders", method: "GET", description: "List all folders" },
          { path: "/api/v1/document", method: "POST", description: "Upload document" },
        ],
        version: "1.0.0",
      }, null, 2),
      "application/json"
    );
    const doc3 = await documentQuery.addDocument({
      ownerId: user1._id.toString(),
      filename: doc3File.originalname,
      mime: doc3File.mimetype,
      textContent: doc3File.buffer.toString("utf-8"),
    });
    const primaryTag3 = await tagQuery.findOrCreateTag("Documentation", user1._id.toString());
    await documentTagQuery.createDocumentTag({
      documentId: doc3._id.toString(),
      tagId: primaryTag3._id.toString(),
      isPrimary: true,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc3._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("api", user1._id.toString()))._id.toString(),
      isPrimary: false,
    });
    console.log(`✓ Created document: ${doc3File.originalname} with primary tag "Documentation" and secondary tags: api, documentation`);

    // Upload documents for User 2 (support@example.com)
    console.log(`\nUploading documents for ${user2.email}...`);
    
    const doc4File = createMockFile(
      "troubleshooting-guide.txt",
      "Troubleshooting Guide\n\nCommon Issues:\n1. Connection timeout - Check network settings\n2. Authentication error - Verify credentials\n3. Document not found - Check document ID\n\nSolutions:\n- Clear browser cache\n- Restart the application\n- Contact support if issue persists",
      "text/plain"
    );
    const doc4 = await documentQuery.addDocument({
      ownerId: user2._id.toString(),
      filename: doc4File.originalname,
      mime: doc4File.mimetype,
      textContent: doc4File.buffer.toString("utf-8"),
    });
    const primaryTag4 = await tagQuery.findOrCreateTag("Support", user2._id.toString());
    await documentTagQuery.createDocumentTag({
      documentId: doc4._id.toString(),
      tagId: primaryTag4._id.toString(),
      isPrimary: true,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc4._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("guide", user2._id.toString()))._id.toString(),
      isPrimary: false,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc4._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("troubleshooting", user2._id.toString()))._id.toString(),
      isPrimary: false,
    });
    console.log(`✓ Created document: ${doc4File.originalname} with primary tag "Support" and secondary tags: guide, troubleshooting`);

    const doc5File = createMockFile(
      "customer-feedback.csv",
      "Customer ID,Feedback,Rating,Date\n1,Great service!,5,2024-01-15\n2,Needs improvement,3,2024-01-16\n3,Excellent product,5,2024-01-17",
      "text/csv"
    );
    const doc5 = await documentQuery.addDocument({
      ownerId: user2._id.toString(),
      filename: doc5File.originalname,
      mime: doc5File.mimetype,
      textContent: doc5File.buffer.toString("utf-8"),
    });
    const primaryTag5 = await tagQuery.findOrCreateTag("Feedback", user2._id.toString());
    await documentTagQuery.createDocumentTag({
      documentId: doc5._id.toString(),
      tagId: primaryTag5._id.toString(),
      isPrimary: true,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc5._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("customer", user2._id.toString()))._id.toString(),
      isPrimary: false,
    });
    await documentTagQuery.createDocumentTag({
      documentId: doc5._id.toString(),
      tagId: (await tagQuery.findOrCreateTag("analytics", user2._id.toString()))._id.toString(),
      isPrimary: false,
    });
    console.log(`✓ Created document: ${doc5File.originalname} with primary tag "Feedback" and secondary tags: customer, analytics`);

    console.log("\n✅ Seed completed successfully!");
    console.log("\nCreated users:");
    console.log("  - admin@example.com (password: password123)");
    console.log("  - support@example.com (password: password123)");
    console.log("  - moderator@example.com (password: password123)");
    console.log("  - user1@example.com (password: password123)");
    console.log("  - user2@example.com (password: password123)");
    console.log("\nUploaded documents:");
    console.log(`  User 1 (user1@example.com): 3 documents`);
    console.log(`  User 2 (user2@example.com): 2 documents`);

    // Close database connection
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

