import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { folders_table } from "~/server/db/schema";

export default function FolderBreadcrumbs(props: {
  parents: (typeof folders_table.$inferSelect)[];
  rootFolderId: number;
}) {
  return (
    <>
      {props.parents.map((folder) => {
        if (props.rootFolderId === folder.id) {
          return null;
        }

        return (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="mx-2 text-gray-500" size={16} />
            <Link
              href={`/f/${folder.id}`}
              className="text-gray-300 hover:text-white"
            >
              {folder.name}
            </Link>
          </div>
        );
      })}
    </>
  );
}
