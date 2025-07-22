import { PaginatedData } from "@/components/pagination/types";
import { getComments } from "../queries/get-comments";
import { CommentWithMetadata } from "../types";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useQueryClient,
} from "@tanstack/react-query";
import { usePaginated } from "@/hooks/use-paginated";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

const removeAttachmentFromCache = (
  { queryClient, queryKey }: CacheArgs,
  payload: { attachmentId: string; commentId: string }
) => {
  queryClient.setQueryData<
    InfiniteData<Awaited<ReturnType<typeof getComments>>>
  >(queryKey, (cache) => {
    if (!cache) return cache;

    const pages = cache.pages.map((page) => ({
      ...page,
      list: page.list.map((comment) => {
        if (comment.id === payload.commentId) {
          return {
            ...comment,
            attachments: comment.attachments.filter(
              (attachment) => attachment.id !== payload.attachmentId
            ),
          };
        }

        return comment;
      }),
    }));

    return { ...cache, pages };
  });
};

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

  const handleDeleteAttachment = (commentId: string, attachmentId: string) => {
    removeAttachmentFromCache(
      { queryClient, queryKey },
      { attachmentId, commentId }
    );

    queryClient.invalidateQueries({ queryKey });
  };

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteComment: () => queryClient.invalidateQueries({ queryKey }),
    onCreateAttachment: () => queryClient.invalidateQueries({ queryKey }),
    onDeleteAttachment: handleDeleteAttachment,
  };
}
