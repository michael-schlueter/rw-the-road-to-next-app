import AttachmentCreateButton from "@/features/attachments/components/attachment-create-button";
import CommentDeleteButton from "../components/comment-delete-button";
import CommentEditButton from "../components/comment-edit-button";
import CommentItem from "../components/comment-item";
import { CommentWithMetadata } from "../types";

type CommentListProps = {
  comments: CommentWithMetadata[];
  ticketId: string;
  onDeleteComment: (id: string) => void;
};

export default function CommentList({
  comments,
  ticketId,
  onDeleteComment,
}: CommentListProps) {
  return (
    <>
      {comments.map((comment) => {
        const attachmentCreateButton = (
          <AttachmentCreateButton
            key="0"
            entityId={comment.id}
            entity="COMMENT"
          />
        );
        const commentDeleteButton = (
          <CommentDeleteButton
            key="1"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );
        const commentEditButton = (
          <CommentEditButton
            key="2"
            commentId={comment.id}
            ticketId={ticketId}
          />
        );
        const buttons = [
          ...(comment.isOwner
            ? [attachmentCreateButton, commentDeleteButton, commentEditButton]
            : []),
        ];
        return (
          <CommentItem key={comment.id} comment={comment} buttons={buttons} />
        );
      })}
    </>
  );
}
