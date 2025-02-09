import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { folders_table } from "~/server/db/schema";

export default function FolderBreadcrumbs(props: {
  parents: (typeof folders_table.$inferSelect)[];
  rootFolderId: number;
}) {
  const crumbs = props.parents.filter((folder) => props.rootFolderId !== folder.id);
  const numCrumbs = crumbs.length;

  if (numCrumbs <= 2) {
    // If there are 2 or fewer breadcrumbs, display all
    return (
      <>
        {crumbs.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="mx-2 text-gray-500" size={16} />
            <Link
              href={`/f/${folder.id}`}
              className="text-gray-300 hover:text-white"
            >
              {folder.name}
            </Link>
          </div>
        ))}
      </>
    );
  } else {
    // If there are 3 or more breadcrumbs, display ellipsis and last two
    const lastCrumb = crumbs[numCrumbs - 1];
    const secondLastCrumb = crumbs[numCrumbs - 2];
    const thirdLastCrumb = crumbs[numCrumbs - 3];

    return (
      <>
        <div className="flex items-center">
          <ChevronRight className="mx-2 text-gray-500" size={16} />
          <Link href={`/f/${thirdLastCrumb?.id}`} className="text-gray-300 hover:text-white">
          ...
          </Link>
        </div>
        <div key={secondLastCrumb?.id} className="flex items-center">
          <ChevronRight className="mx-2 text-gray-500" size={16} />
          <Link
            href={`/f/${secondLastCrumb?.id}`}
            className="text-gray-300 hover:text-white"
          >
            {secondLastCrumb?.name}
          </Link>
        </div>
        <div key={lastCrumb?.id} className="flex items-center">
          <ChevronRight className="mx-2 text-gray-500" size={16} />
          <Link
            href={`/f/${lastCrumb?.id}`}
            className="text-gray-300 hover:text-white"
          >
            {lastCrumb?.name}
          </Link>
        </div>
      </>
    );
  }
}
