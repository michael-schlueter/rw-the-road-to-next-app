"use client";

import { useQueryState } from "nuqs";
import { searchParser } from "../search-params";
import SearchInput from "@/components/search-input";

type SearchInputProps = {
  placeholder: string;
};

export default function TIcketSearchInput({ placeholder }: SearchInputProps) {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
}
