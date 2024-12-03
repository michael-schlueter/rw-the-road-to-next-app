import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { createTicket } from "../actions/create-ticket";

export default function TicketCreateForm() {
  return (
    <form className="flex flex-col gap-y-2" action={createTicket}>
      <Label htmlFor="title">Title</Label>
      <Input type="text" id="title" name="title" />

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" />

      <Button type="submit">Create</Button>
    </form>
  );
}
