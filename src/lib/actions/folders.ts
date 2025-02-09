"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  if (!folder) {
    return { error: "Folder not found" };
  }

  const { folderIds, fileIds } = await gatherAllNestedIds(folderId);

  try {
    await db.transaction(async (tx) => {
      await tx.delete(files_table).where(inArray(files_table.parent, fileIds));
      await tx
        .delete(folders_table)
        .where(inArray(folders_table.id, folderIds));

      const c = await cookies();
      c.set("force-refresh", JSON.stringify(Math.random()));
      return { success: true };
    });
    console.log("Folder and its contents deleted successfully.");
  } catch (error) {
    console.error("Error deleting folder and its contents:", error);
    return { error: "Error deleting folder and its contents" };
  }
}

async function gatherAllNestedIds(folderId: number) {
  const folderIds: number[] = [folderId];
  const fileIds: number[] = [];

  const subFolders = await db
    .select({ id: folders_table.id })
    .from(folders_table)
    .where(eq(folders_table.parent, folderId));

  const subFiles = await db
    .select({ id: files_table.id })
    .from(files_table)
    .where(eq(files_table.parent, folderId));

  fileIds.push(...subFiles.map((file) => file.id));

  for (const folder of subFolders) {
    const nestedIds = await gatherAllNestedIds(folder.id);
    folderIds.push(...nestedIds.folderIds);
    fileIds.push(...nestedIds.fileIds);
  }

  return { folderIds, fileIds };
}

export async function createFolder(folderName: string, parent: number) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  if (folderName.length <= 0) {
    return { error: "Folder name cannot be empty" };
  }

  const [folder] = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.name, folderName),
        eq(folders_table.parent, parent),
        eq(folders_table.ownerId, session.userId),
      ),
    );

  if (folder) {
    return { error: "Folder already exists" };
  }

  const dbCreateResult = await db
    .insert(folders_table)
    .values({ name: folderName, parent, ownerId: session.userId });
  
  if (!dbCreateResult) {
    return { error: "Error creating folder" };
  }

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));
  return { success: true, message: "Folder created successfully" };
}
