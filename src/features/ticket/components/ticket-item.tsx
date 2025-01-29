import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ticketEditPath, ticketPath } from "@/paths";
import Link from "next/link";
import { TICKET_ICONS } from "../constants";
import { Button } from "@/components/ui/button";
import {
  LucideArrowUpRightFromSquare,
  LucideMoreVertical,
  LucidePencil,
} from "lucide-react";
import clsx from "clsx";
import { toCurrencyFromCent } from "@/utils/currency";
import TicketMoreMenu from "./ticket-more-menu";
import { TicketWithMetadata } from "../types";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import Comments from "@/features/comment/components/comments";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type TicketItemProps = {
  ticket: TicketWithMetadata;
  isDetail?: boolean;
};

export default async function TicketItem({
  ticket,
  isDetail,
}: TicketItemProps) {
  const { user } = await getAuth();
  const isTicketOwner = isOwner(user, ticket);

  const DetailButton = () => {
    return (
      <Button asChild size="icon" variant="outline">
        <Link
          prefetch
          href={ticketPath(ticket.id)}
          className="text-sm underline"
        >
          <LucideArrowUpRightFromSquare className="w-4 h-4" />
        </Link>
      </Button>
    );
  };

  const EditButton = () =>
    isTicketOwner ? (
      <Button asChild size="icon" variant="outline">
        <Link
          prefetch
          href={ticketEditPath(ticket.id)}
          className="text-sm underline"
        >
          <LucidePencil className="h-4 w-4" />
        </Link>
      </Button>
    ) : null;

  const moreMenu = isTicketOwner ? (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div
      className={clsx("w-full flex flex-col gap-y-4", {
        "max-w-[420px]": !isDetail,
        "max-w-[580px]": isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex gap-x-2">
              <span>{TICKET_ICONS[ticket.status]}</span>
              <span className="truncate">{ticket.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="line-clamp-3 whitespace-break-spaces">
              {ticket.content}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {ticket.deadline} by {ticket.user.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCent(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>
              <EditButton />
              {moreMenu}
            </>
          ) : (
            <>
              <DetailButton />
              <EditButton />
            </>
          )}
        </div>
      </div>

      {isDetail ? (
        <Suspense
          fallback={
            <div className="flex flex-col gap-y-4">
              <Skeleton className="h-[250px] w-full" />
              <Skeleton className="h-[80px] ml-8" />
              <Skeleton className="h-[80px] ml-8" />
            </div>
          }
        >
          <Comments ticketId={ticket.id} />
        </Suspense>
      ) : null}
    </div>
  );
}
