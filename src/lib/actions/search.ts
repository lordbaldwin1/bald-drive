"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { and, eq, like } from "drizzle-orm";
import { folders_table, files_table } from "~/server/db/schema";

export async function searchFolders(searchTerm: string) {
    const session = await auth();
    if (!session.userId) {
      console.error("Unauthorized access attempt.");
      return []; // Ensure consistent return type
    }

    if (!searchTerm.trim()) {
      return [];
    }

    const folderResults = await db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.ownerId, session.userId),
          like(folders_table.name, `%${searchTerm}%`)
        )
      );

    return folderResults;
}

export async function searchFiles(searchTerm: string) {
    const session = await auth();
    if (!session.userId) {
      console.error("Unauthorized access attempt.");
      return []; // Ensure consistent return type
    }

    if (!searchTerm.trim()) {
      return [];
    }

    const fileResults = await db
      .select()
      .from(files_table)
      .where(
        and(
          eq(files_table.ownerId, session.userId),
          like(files_table.name, `%${searchTerm}%`)
        )
      );

    return fileResults;
}
