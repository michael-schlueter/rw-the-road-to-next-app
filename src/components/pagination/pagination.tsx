import { PaginatedData } from "@/components/pagination/types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTransition } from "react";
import { PAGE_SIZES } from "./constants";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  paginatedMetadata: PaginatedData<unknown>["metadata"];
};

export default function Pagination({
  pagination,
  onPagination,
  paginatedMetadata: { count, hasNextPage },
}: PaginationProps) {
  // index of the first/last items on the current page
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset - 1 + pagination.size;
  // use the count if the theoretical endOffset is not reached with the amount of tickets
  const actualEndOffset = Math.min(endOffset, count);

  const label = `${startOffset}-${actualEndOffset} of ${count}`;

  const [isPending, startTransition] = useTransition();

  const handlePreviousPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page - 1 });
    });
  };

  const handleNextPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page + 1 });
    });
  };

  const handleChangeSize = (size: string) => {
    startTransition(() => {
      onPagination({ page: 0, size: parseInt(size) });
    });
  };

  const PreviousButton = () => (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1 || isPending}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const NextButton = () => (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasNextPage || isPending}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  const SizeButton = () => (
    <Select
      onValueChange={handleChangeSize}
      defaultValue={pagination.size.toString()}
    >
      <SelectTrigger className="h-[36px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={size} value={size.toString()}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        <SizeButton />
        <PreviousButton />
        <NextButton />
      </div>
    </div>
  );
}
