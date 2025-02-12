"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { createFolder, getAllFolders } from "~/lib/actions/folders";
import { ChevronRight, ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";

interface FolderItemProps {
  folder: { id: number; name: string };
  selectedFolderId: number;
  onSelect: (id: number) => void;
  allFolders: { id: number; name: string; parent: number | null }[];
}

const FolderItem = ({
  folder,
  selectedFolderId,
  onSelect,
  allFolders,
}: FolderItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const subFolders = allFolders.filter((f) => f.parent === folder.id);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className={`flex-1 justify-start ${selectedFolderId === folder.id ? "bg-gray-700" : ""}`}
          onClick={() => onSelect(folder.id)}
        >
          {folder.name}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div className="ml-6">
          {subFolders.map((subFolder) => (
            <FolderItem
              key={subFolder.id}
              folder={subFolder}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              allFolders={allFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CreateFolderDialog = (props: { currentFolderId: number }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<number>(
    props.currentFolderId,
  );
  const [allFolders, setAllFolders] = useState<
    { id: number; name: string; parent: number | null }[]
  >([]);

  useEffect(() => {
    const loadAllFolders = async () => {
      const result = await getAllFolders();
      setAllFolders(result);
    };
    void loadAllFolders();
  }, []);

  const handleCreateFolder = async (selectedFolderId: number) => {
    const result = await createFolder(folderName, selectedFolderId);
    if (result.error) {
      toast({
        title: "Error creating folder",
        description: result.error,
      });
    } else {
      toast({
        title: "Folder created",
        description: result.message,
      });
    }
    setOpen(false);
    setFolderName("");
    redirect(`/f/${selectedFolderId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <Button className="text-md mt-4 h-8 w-36 bg-white font-normal text-gray-800">
            Create Folder
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col bg-gray-800 text-gray-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter the name of the new folder.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <Label htmlFor="name" className="text-left">
            Name
          </Label>
          <Input
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="bg-gray-700 text-gray-100"
          />
        </div>
        <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
          {allFolders
            .filter((folder) => folder.parent === null)
            .map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                selectedFolderId={selectedFolderId}
                onSelect={setSelectedFolderId}
                allFolders={allFolders}
              />
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => handleCreateFolder(selectedFolderId)}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
