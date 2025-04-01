import { PaginatedData } from "@/types/pagination";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function usePaginatedComments(ticketId: string, paginatedComments: PaginatedData<CommentWithMetadata>) {
    const queryKey = ["comments", ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: paginatedComments.list,
            metadata: paginatedComments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const queryClient = useQueryClient();

  const comments = data.pages.flatMap((page) => page.list);

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteComment: () => queryClient.invalidateQueries({ queryKey }),
  }
}