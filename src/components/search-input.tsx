"use client";

import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    250
  );
  return (
    <Input
      defaultValue={value}
      placeholder={placeholder}
      onChange={handleSearch}
    />
  );
}
