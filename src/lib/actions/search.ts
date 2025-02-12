"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { and, eq, like } from "drizzle-orm";
import { folders_table, files_table } from "~/server/db/schema";

// Combined search function for better efficiency
export async function search(searchTerm: string) {
    const session = await auth();
    if (!session.userId) {
      console.error("Unauthorized access attempt.");
      return { folders: [], files: [] };
    }

    if (!searchTerm.trim()) {
      return { folders: [], files: [] };
    }

    // Run both queries concurrently
    const [folders, files] = await Promise.all([
      db
        .select()
        .from(folders_table)
        .where(
          and(
            eq(folders_table.ownerId, session.userId),
            like(folders_table.name, `%${searchTerm}%`)
          )
        )
        .limit(5),
      db
        .select()
        .from(files_table)
        .where(
          and(
            eq(files_table.ownerId, session.userId),
            like(files_table.name, `%${searchTerm}%`)
          )
        )
        .limit(5)
    ]);

    return { folders, files };
}
