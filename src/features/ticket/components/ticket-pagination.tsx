"use client";

import { useQueryStates } from "nuqs";
import { paginationOptions, paginationParser } from "../search-params";
import Pagination from "@/components/pagination";

export default function TicketPagination() {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );

  return <Pagination pagination={pagination} onPagination={setPagination} />;
}
