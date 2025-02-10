import { useState } from "react";
import { searchFolders, searchFiles } from "~/lib/actions/search";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
//import { useDebounce } from "~/hooks/useDebounce";

export default function SearchCommand() {
  const [query, setQuery] = useState("");
  //const [debouncedQuery] = useDebounce(query, 500);
  const [folderResults, setFolderResults] = useState<DB_FolderType[]>([]);
  const [fileResults, setFileResults] = useState<DB_FileType[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value) {
      setFolderResults([]);
      setFileResults([]);
      return;
    }

    const folders: DB_FolderType[] = await searchFolders(value);
    const files: DB_FileType[] = await searchFiles(value);

      setFolderResults(folders);
      setFileResults(files);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200">
            <Search size={18} />
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogTitle>Search</DialogTitle>
          <Command>
            <CommandInput
              placeholder="Search files & folders..."
              value={query}
              onValueChange={handleSearch}
              className="text-lg"
            />
            <CommandList>
              {folderResults.length > 0 ? (
                <>
                  <CommandGroup heading="Folders">
                    {folderResults.map((folder) => (
                      <CommandItem key={folder.id}>{folder.name}</CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="Files">
                    {fileResults.map((file) => (
                      <CommandItem key={file.id}>{file.name}</CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : (
                <CommandItem>No results found.</CommandItem>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
