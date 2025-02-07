import { auth } from "@clerk/nextjs/server";
import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { redirect } from "next/navigation";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const session = await auth();
  if (!session.userId) {
    return <div>Please sign in</div>;
  }

  const [folders, files, parents, rootFolder] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
    QUERIES.getRootFolderForUser(session.userId),
  ]);

  if (!rootFolder) {
    return redirect("/drive");
  }

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={parsedFolderId}
      rootFolderId={rootFolder.id}
    />
  );
}
