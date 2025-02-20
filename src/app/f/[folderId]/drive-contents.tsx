"use client";

import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "../../../components/uploadthing";
import { useRouter } from "next/navigation";
import FolderBreadcrumbs from "~/components/folder-breadcrumb";
import CreateFolderDialog from "~/components/CreateFolderDialog";
import SearchCommand from "../../../components/searchcommand";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
  rootFolderId: number;
}) {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              prefetch={true}
              href={`/f/${props.rootFolderId}`}
              className="mr-2 text-gray-300 hover:text-white"
            >
              My Drive
            </Link>
            <FolderBreadcrumbs
              parents={props.parents}
              rootFolderId={props.rootFolderId}
            />
          </div>
          <div className="flex items-end mb-5 mr-4 space-x-4 ml-auto">
            <UploadButton
              className="text-gray-800 ut-button:bg-white ut-button:hover:bg-primary ut-button:text-gray-800 ut-button:h-8 ut-allowed-content:hidden"
              endpoint="driveUploader"
              onClientUploadComplete={() => {
                navigate.refresh();
              }}
              input={{
                folderId: props.currentFolderId,
              }}
            />
            <CreateFolderDialog currentFolderId={props.currentFolderId} />
            <SearchCommand />
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-3"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
