import "server-only";

import { db } from "~/server/db";
import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { eq, isNull, and, inArray } from "drizzle-orm";

export const QUERIES = {
  // Inferred async function because the return type is a Promise
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
  getFolderbyId: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));
    return folder[0];
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      { name: "Trash", parent: rootFolderId, ownerId: userId },
      { name: "Shared", parent: rootFolderId, ownerId: userId },
      { name: "Documents", parent: rootFolderId, ownerId: userId },
    ]);

    return rootFolderId;
  },

  deleteFolder: async function (folderId: number) {
    const gatherAllNestedIds = async (folderId: number) => {
      const folderIds: number[] = [folderId];
      const fileIds: number[] = [];

      const subFolders = await db
        .select({ id: foldersSchema.id })
        .from(foldersSchema)
        .where(eq(foldersSchema.parent, folderId));

      const subFiles = await db
        .select({ id: filesSchema.id })
        .from(filesSchema)
        .where(eq(filesSchema.parent, folderId));

      fileIds.push(...subFiles.map((file) => file.id));

      for (const folder of subFolders) {
        const nestedIds = await gatherAllNestedIds(folder.id);
        folderIds.push(...nestedIds.folderIds);
        fileIds.push(...nestedIds.fileIds);
      }

      return { folderIds, fileIds };
    };

    const { folderIds, fileIds } = await gatherAllNestedIds(folderId);

    try {
      await db.transaction(async (tx) => {
        await tx
          .delete(filesSchema)
          .where(inArray(filesSchema.parent, fileIds));
        await tx
          .delete(foldersSchema)
          .where(inArray(foldersSchema.id, folderIds));
      });
      console.log("Folder and its contents deleted successfully.");
    } catch (error) {
      console.error("Error deleting folder and its contents:", error);
      throw error;
    }
  },
};
