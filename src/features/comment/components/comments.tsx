import CardCompact from "@/components/card-compact";
import { getComments } from "../queries/get-comments";
import CommentItem from "./comment-item";
import CommentCreateForm from "./comment-create-form";
import { isOwner } from "@/features/auth/utils/is-owner";
import CommentDeleteButton from "./comment-delete-button";
import { getAuth } from "@/features/auth/queries/get-auth";

type CommentsProps = {
  ticketId: string;
};

export default async function Comments({ ticketId }: CommentsProps) {
  const comments = await getComments(ticketId);
  const { user } = await getAuth();
  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created..."
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <div className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            buttons={[
              ...(isOwner(user, comment)
                ? [<CommentDeleteButton key="0" id={comment.id} />]
                : []),
            ]}
          />
        ))}
      </div>
    </>
  );
}
