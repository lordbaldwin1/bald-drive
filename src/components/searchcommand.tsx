"use client";

import { useState, useEffect } from "react";
import { search } from "~/lib/actions/search";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";
import { FileIcon, FolderIcon, Search } from "lucide-react";
import { useDebounce } from "~/hooks/useDebounce";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";

export default function SearchCommand() {
  const [query, setQuery] = useState("");
  const [folderResults, setFolderResults] = useState<DB_FolderType[]>([]);
  const [fileResults, setFileResults] = useState<DB_FileType[]>([]);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 100);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFolderResults([]);
      setFileResults([]);
      return;
    }
    const fetchResults = async () => {
      const { folders, files } = await search(debouncedQuery);
      setFolderResults(folders);
      setFileResults(files);
    };
    void fetchResults();
  }, [debouncedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="rounded-full bg-gray-100 p-2 hover:bg-primary text-black">
          <Search size={18} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="mt-4 w-80 p-2 bg-gray-800 text-white">
        <Input
          placeholder="Search files & folders..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />

        <div className="mt-4 max-h-60 overflow-y-auto">
          {folderResults.length === 0 && fileResults.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No results found.</p>
          ) : (
            <>
              {folderResults.length > 0 && (
                <>
                  <p className="px-2 text-xs font-semibold text-gray-500">
                    Folders
                  </p>
                  {folderResults.map((folder) => (
                    <Link
                      key={folder.id}
                      href={`/f/${folder.id}`}
                      className="block rounded px-3 py-2 hover:text-blue-400"
                      onClick={() => setOpen(false)}
                    >
                      <FolderIcon className="mr-2 inline-block" size={14} />
                      {folder.name}
                    </Link>
                  ))}
                </>
              )}
              
              {fileResults.length > 0 && (
                <>
                  <p className="mt-2 px-2 text-xs font-semibold text-gray-500">
                    Files
                  </p>
                  {fileResults.map((file) => (
                    <Link
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      className="block rounded px-3 py-2 hover:text-blue-400"
                      onClick={() => setOpen(false)}
                    >
                      <FileIcon className="mr-2 inline-block" size={14} />
                      {file.name}
                    </Link>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
