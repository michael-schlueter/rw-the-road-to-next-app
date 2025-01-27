import { Button } from "./ui/button";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
};

export default function Pagination({
  pagination,
  onPagination,
}: PaginationProps) {
  // index of the first/last items on the current page
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset - 1 + pagination.size;

  // TODO
  const label = `${startOffset}-${endOffset} of X`;

  const handlePreviousPage = () => {
    onPagination({ ...pagination, page: pagination.page - 1 });
  };

  const handleNextPage = () => {
    onPagination({ ...pagination, page: pagination.page + 1 });
  };

  const PreviousButton = () => (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const NextButton = () => (
    <Button
      variant="outline"
      size="sm"
      disabled={false}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        <PreviousButton />
        <NextButton />
      </div>
    </div>
  );
}
