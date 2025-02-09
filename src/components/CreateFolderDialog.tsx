"use client";

import { useState } from "react";
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

interface Props {
  onCreateFolder: (folderName: string) => Promise<void>;
}

const CreateFolderDialog: React.FC<Props> = ({ onCreateFolder }) => {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    await onCreateFolder(folderName);
    setOpen(false);
    setFolderName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <Button className="text-md mt-4 h-8 w-36 bg-white text-gray-800 font-normal">
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleCreateFolder}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
