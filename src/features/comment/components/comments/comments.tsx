"use client";

import CardCompact from "@/components/card-compact";
import { CommentWithMetadata } from "../../types";
import { PaginatedData } from "@/types/pagination";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CommentCreateForm from "../comment-create-form";
import CommentList from "../../comments/comment-list";
import { usePaginatedComments } from "../../comments/use-paginated-comments";

type CommentsProps = {
  ticketId: string;
  paginatedComments: PaginatedData<CommentWithMetadata>;
};

export default function Comments({
  ticketId,
  paginatedComments,
}: CommentsProps) {
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateComment,
    onDeleteComment,
    onDeleteAttachment,
  } = usePaginatedComments(ticketId, paginatedComments);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // const CommentEditButton = ({ commentId }: { commentId: string }) => (
  //   <Button asChild size="icon" variant="outline">
  //     <Link
  //       prefetch
  //       href={commentEditPath(ticketId, commentId)}
  //       className="text-sm underline"
  //     >
  //       <LucidePencil className="h-4 w-4" />
  //     </Link>
  //   </Button>
  // );

  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created..."
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={onCreateComment}
          />
        }
      />
      <div className="flex flex-col gap-y-2 ml-8">
        <CommentList
          comments={comments}
          onDeleteComment={onDeleteComment}
          onDeleteAttachment={onDeleteAttachment}
        />

        {isFetchingNextPage && (
          <>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
            <div className="flex gap-x-2">
              <Skeleton className="h-[82px] w-full" />
              <Skeleton className="h-[40px] w-[40px]" />
            </div>
          </>
        )}
      </div>

      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic">No more comments</p>
        )}
      </div>
    </>
  );
}
