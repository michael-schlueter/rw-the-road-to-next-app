"use client";

import { useQueryState, useQueryStates } from "nuqs";
import {
  paginationOptions,
  paginationParser,
  searchParser,
} from "../search-params";
import Pagination from "@/components/pagination/pagination";
import { useEffect, useRef } from "react";
import { PaginatedData } from "@/components/pagination/types";
import { TicketWithMetadata } from "../types";

type TicketPaginationProps = {
  paginatedTicketMetadata: PaginatedData<TicketWithMetadata>["metadata"];
};

export default function TicketPagination({
  paginatedTicketMetadata,
}: TicketPaginationProps) {
  const [pagination, setPagination] = useQueryStates(
    paginationParser,
    paginationOptions
  );

  const [search] = useQueryState("search", searchParser);
  const prevSearch = useRef(search);

  useEffect(() => {
    if (prevSearch.current === search) return;
    prevSearch.current = search;

    setPagination({
      ...pagination,
      page: 0,
    });
  }, [pagination, setPagination, search]);

  return (
    <Pagination
      pagination={pagination}
      onPagination={setPagination}
      paginatedMetadata={paginatedTicketMetadata}
    />
  );
}
