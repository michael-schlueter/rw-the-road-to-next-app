import CardCompact from "@/components/card-compact";
import { getComments } from "../queries/get-comments";
import CommentItem from "./comment-item";
import CommentCreateForm from "./comment-create-form";

type CommentsProps = {
  ticketId: string;
};

export default async function Comments({ ticketId }: CommentsProps) {
  const comments = await getComments(ticketId);
  return (
    <>
      <CardCompact
        title="Create Comment"
        description="A new comment will be created..."
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <div className="flex flex-col gap-y-2 ml-8">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
}
