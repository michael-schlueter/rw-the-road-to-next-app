import Breadcrumbs from "@/components/breadcrumbs";
import CardCompact from "@/components/card-compact";
import { Separator } from "@/components/ui/separator";
import getComment from "@/features/comment/queries/get-comment";
import TicketUpsertForm from "@/features/ticket/components/ticket-upsert-form";
import getTicket from "@/features/ticket/queries/get-ticket";
import { homePath, ticketPath } from "@/paths";
import { notFound } from "next/navigation";

type CommentEditPageProps = {
  params: Promise<{
    ticketId: string;
    commentId: string;
  }>;
};

export default async function TicketEditPage({ params }: CommentEditPageProps) {
  const { ticketId, commentId } = await params;
  const ticket = await getTicket(ticketId);
  const comment = await getComment(commentId);

  const isTicketFound = !!ticket;
  const isCommentFound = !!comment;

  if (!isTicketFound || !isCommentFound || !comment.isOwner) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Breadcrumbs
        breadcrumbs={[
          { title: "Tickets", href: homePath() },
          { title: ticket.title, href: ticketPath(ticket.id) },
          { title: "Edit Comment" },
        ]}
      />

      <Separator />

      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Edit Comment"
          description="Edit an existing comment"
          content={<CommentEditForm comment={comment} />}
          className="w-full max-w-[420px] animate-fade-from-top"
        />
      </div>
    </div>
  );
}
