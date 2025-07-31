import CommentDeleteButton from "../components/comment-delete-button";
import CommentItem from "../components/comment-item";
import { CommentWithMetadata } from "../types";
import AttachmentList from "@/features/attachments/components/attachment-list";
import AttachmentDeleteButton from "@/features/attachments/components/attachment-delete-button";
import CommentEditButton from "../components/comment-edit-button";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onDeleteAttachment?: (commentId: string, attachmentId: string) => void;
};

export default function CommentList({
  comments,
  onDeleteComment,
  onDeleteAttachment,
}: CommentListProps) {
  return (
    <>
      {comments.map((comment) => {
        const commentDeleteButton = (
          <CommentDeleteButton
            key="0"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );
        const commentEditButton = (
          <CommentEditButton
            key="2"
            commentId={comment.id}
            ticketId={comment.ticketId}
          />
        );
        const buttons = [...(comment.isOwner ? [commentDeleteButton, commentEditButton] : [])];

        const sections = [];

        if (comment.attachments?.length) {
          sections.push({
            label: "Attachments",
            content: (
              <AttachmentList
                attachments={comment.attachments}
                buttons={(attachmentId) => [
                  ...(comment.isOwner
                    ? [
                        <AttachmentDeleteButton
                          key="0"
                          id={attachmentId}
                          onDeleteAttachment={(attachmentId) =>
                            onDeleteAttachment?.(comment.id, attachmentId)
                          }
                        />,
                      ]
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
