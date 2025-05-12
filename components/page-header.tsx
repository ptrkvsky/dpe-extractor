import { Building2 } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8 pb-6 border-b">
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        <Building2 className="h-12 w-12" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-[700px]">{description}</p>
    </div>
  );
}