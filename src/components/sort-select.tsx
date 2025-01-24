"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { sortParser } from "@/features/ticket/search-params";

type Option = {
  value: string;
  label: string;
};

type SortSelectProps = {
  defaultValue?: string;
  options: Option[];
};

export default function SortSelect({ options }: SortSelectProps) {
  const [sort, setSort] = useQueryState("sort", sortParser);

  const handleSort = (value: string) => {
    setSort(value);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sort}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
