import AttachmentCreateButton from "@/features/attachments/components/attachment-create-button";
import CommentDeleteButton from "../components/comment-delete-button";
import CommentEditButton from "../components/comment-edit-button";
import CommentItem from "../components/comment-item";
import { CommentWithMetadata } from "../types";
import AttachmentList from "@/features/attachments/components/attachment-list";
import AttachmentDeleteButton from "@/features/attachments/components/attachment-delete-button";

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

        const sections = [];

        if (comment.attachments.length) {
          sections.push({
            label: "Attachments",
            content: (
              <AttachmentList
                attachments={comment.attachments}
                isOwner={comment.isOwner}
                buttons={(attachmentId) => [
                  ...(comment.isOwner
                    ? [<AttachmentDeleteButton key="0" id={attachmentId} />]
                    : []),
                ]}
              />
            ),
          });
        }
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            sections={sections}
            buttons={buttons}
          />
        );
      })}
    </>
  );
}
