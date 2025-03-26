import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Heading({
  title,
  description,
  tabs,
  breadcrumbs,
  actions,
}: HeadingProps) {
  return (
    <>
      {breadcrumbs}
      <div className="grid grid-cols-3 items-center px-8">
        <div className="col-start-1">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {tabs ? (
          <div className="col-start-2 justify-self-center">
            {tabs}
          </div>
        ): null}

        <div className="col-start-3 justify-self-end flex gap-x-2">
          {actions}
        </div>
      </div>

      <Separator />
    </>
  );
}
