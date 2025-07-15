import { PaginatedData } from "@/components/pagination/types";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";

type UsePaginatedParams<TItem> = {
  queryKey: QueryKey;
  queryFn: (pageParam?: string) => Promise<PaginatedData<TItem>>;
  initialData: PaginatedData<TItem>;
};

export function usePaginated<TItem>({
  queryKey,
  queryFn,
  initialData,
}: UsePaginatedParams<TItem>) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => queryFn(pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: initialData.list,
            metadata: initialData.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const list = data.pages.flatMap((page) => page.list);

  return {
    list,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
