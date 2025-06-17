"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@prisma/client";
import { upsertTicket } from "../actions/upsert-ticket";
import SubmitButton from "@/components/form/submit-button";
import { useActionState, useRef } from "react";
import FieldError from "@/components/form/field-error";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { fromCent } from "@/utils/currency";
import {
  DatePicker,
  ImperativeHandleFromDatePicker,
} from "@/components/date-picker";
import { Checkbox } from "@/components/ui/checkbox";

type TicketUpsertFormProps = {
  ticket?: Ticket;
  hasActiveSubscription: boolean;
};

export default function TicketUpsertForm({ ticket, hasActiveSubscription }: TicketUpsertFormProps) {
  const [actionState, action] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE
  );

  const datePickerImperativeHandleRef =
    useRef<ImperativeHandleFromDatePicker>(null);

  const handleSuccess = () => {
    datePickerImperativeHandleRef.current?.reset();
  };

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Label htmlFor="title">Title</Label>
      <Input
        type="text"
        id="title"
        name="title"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />
      <FieldError actionState={actionState} name="title" />

      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? ticket?.content
        }
      />
      <FieldError actionState={actionState} name="content" />

      <div className="flex gap-x-2 mb-1">
        <div className="w-1/2">
          <Label htmlFor="deadline">Deadline</Label>
          <DatePicker
            id="deadline"
            name="deadline"
            defaultValue={
              (actionState.payload?.get("deadline") as string) ??
              ticket?.deadline
            }
            imperativeHandleRef={datePickerImperativeHandleRef}
          />
          <FieldError actionState={actionState} name="deadline" />
        </div>
        <div className="w-1/2">
          <Label htmlFor="bounty">Bounty</Label>
          <Input
            id="bounty"
            name="bounty"
            type="number"
            step=".01"
            defaultValue={
              (actionState.payload?.get("bounty") as string) ??
              (ticket?.bounty ? fromCent(ticket?.bounty) : "")
            }
          />
          <FieldError actionState={actionState} name="bounty" />
        </div>
      </div>

      {hasActiveSubscription ? (
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="private"
            name="private"
            defaultChecked={
              actionState.payload
                ? actionState.payload.get("private") === "on"
                : (ticket?.private ?? false)
            }
          />
          <Label className="text-muted-foreground" htmlFor="private">
            Mark as private
          </Label>
        </div>
      ) : null}

      <SubmitButton label={ticket ? "Update" : "Create"} />
    </Form>
  );
}
