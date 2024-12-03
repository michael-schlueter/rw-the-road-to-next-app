import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

type CardCompactProps = {
  title: string;
  description: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function CardCompact({
  title,
  description,
  content,
  footer,
  className,
}: CardCompactProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
