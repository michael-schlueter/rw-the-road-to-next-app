import { Card } from "@/components/ui/card";
import { CommentWithMetadata } from "../types";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import Content from "@/components/content";

type CommentItemProps = {
  comment: CommentWithMetadata;
  sections: {
    label: string;
    content: React.ReactNode;
  }[];
  buttons: React.ReactNode;
};

export default function CommentItem({
  comment,
  sections,
  buttons,
}: CommentItemProps) {
  return (
    <div className="flex gap-x-2">
      <Card className="p-4 flex-1 flex flex-col gap-y-1">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {comment.isOwner
              ? "You"
              : (comment.user?.username ?? "Deleted User")}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(comment.createdAt, "yyyy-MM-dd, HH:mm")}
          </p>
        </div>
        <Content>{comment.content}</Content>

        {sections.map((section) => (
          <div key={section.label} className="space-y-2 mt-2">
            <Separator />

            <h4 className="text-sm text-muted-foreground">{section.label}</h4>

            <div>{section.content}</div>
          </div>
        ))}
      </Card>

      <div className="flex flex-col gap-y-1">{buttons}</div>
    </div>
  );
}
