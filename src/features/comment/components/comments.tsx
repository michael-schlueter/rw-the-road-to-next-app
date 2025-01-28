import { getComments } from "../queries/get-comments";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
};

export default async function Comments({ ticketId }: CommentsProps) {
  const comments = await getComments(ticketId);
  return (
    <div className="flex flex-col gap-y-2 ml-8">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
