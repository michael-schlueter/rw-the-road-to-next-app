"use client";

import { useQueryState } from "nuqs";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";
import { searchParser } from "@/features/ticket/search-params";

type SearchInputProps = {
  placeholder: string;
};

export default function SearchInput({ placeholder }: SearchInputProps) {
  const [search, setSearch] = useQueryState("search", searchParser);

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    250
  );
  return (
    <Input
      defaultValue={search}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
}
