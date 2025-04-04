import AttachmentCreateButton from "@/features/attachments/components/attachment-create-button";
import CommentDeleteButton from "../components/comment-delete-button";
import CommentItem from "../components/comment-item";
import { CommentWithMetadata } from "../types";
import AttachmentList from "@/features/attachments/components/attachment-list";
import AttachmentDeleteButton from "@/features/attachments/components/attachment-delete-button";

type CommentListProps = {
  comments: CommentWithMetadata[];
  onDeleteComment: (id: string) => void;
  onCreateAttachment?: () => void;
  onDeleteAttachment?: (id: string) => void;
};

export default function CommentList({
  comments,
  onDeleteComment,
  onCreateAttachment,
  onDeleteAttachment,
}: CommentListProps) {
  return (
    <>
      {comments.map((comment) => {
        const attachmentCreateButton = (
          <AttachmentCreateButton
            key="0"
            entityId={comment.id}
            entity="COMMENT"
            onCreateAttachment={onCreateAttachment}
          />
        );
        const commentDeleteButton = (
          <CommentDeleteButton
            key="1"
            id={comment.id}
            onDeleteComment={onDeleteComment}
          />
        );
        // const commentEditButton = (
        //   <CommentEditButton
        //     key="2"
        //     commentId={comment.id}
        //     ticketId={ticketId}
        //   />
        // );
        const buttons = [
          ...(comment.isOwner
            ? [attachmentCreateButton, commentDeleteButton]
            : []),
        ];

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
                          onDeleteAttachment={onDeleteAttachment}
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
