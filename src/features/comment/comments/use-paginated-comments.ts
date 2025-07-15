import { PaginatedData } from "@/components/pagination/types";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { usePaginated } from "@/hooks/use-paginated";

export function usePaginatedComments(
  ticketId: string,
  paginatedComments: PaginatedData<CommentWithMetadata>
) {
  const queryKey = ["comments", ticketId];

  const {
    list: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginated<CommentWithMetadata>({
    queryKey,
    queryFn: (pageParam) => getComments(ticketId, pageParam),
    initialData: paginatedComments,
  });

  const queryClient = useQueryClient();
  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteComment: () => queryClient.invalidateQueries({ queryKey }),
    onCreateAttachment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteAttachment: () => queryClient.invalidateQueries({ queryKey }),
  };
}
