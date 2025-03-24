import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Fragment } from "react";
import { ChevronDown, LucideSlash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type BreadCrumbsProps = {
  breadcrumbs: {
    title: string;
    href?: string;
    dropdown?: {
      title: string;
      href: string;
    }[];
  }[];
};

export default function Breadcrumbs({ breadcrumbs }: BreadCrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          let breadcrumbItem = (
            <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
          );

          if (breadcrumb.href) {
            breadcrumbItem = (
              <BreadcrumbLink asChild>
                <Link
                  href={breadcrumb.href}
                  className="flex items-center gap-1"
                >
                  {breadcrumb.title}
                </Link>
              </BreadcrumbLink>
            );
          }

          if (breadcrumb.dropdown) {
            breadcrumbItem = (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  {breadcrumb.title}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {breadcrumb.dropdown.map((item) => (
                    <DropdownMenuItem asChild key={item.href}>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Fragment key={breadcrumb.title}>
              <BreadcrumbItem>{breadcrumbItem}</BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <LucideSlash className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
