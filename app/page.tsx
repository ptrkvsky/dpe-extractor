import { DPEValidator } from "@/components/dpe-validator";
import { PageHeader } from "@/components/page-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <PageHeader 
          title="Validation DPE" 
          description="Vérifiez la conformité réglementaire de vos diagnostics de performance énergétique."
        />
        <DPEValidator />
      </div>
    </main>
  );
}