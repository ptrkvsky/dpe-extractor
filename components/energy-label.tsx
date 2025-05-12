import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EnergyLabelProps {
  title: string;
  value: string | number | null | undefined;
  unit: string;
  className: string;
  letter: string;
  error: boolean;
  isGES?: boolean;
}

export function EnergyLabel({
  title,
  value,
  unit,
  className,
  letter,
  error,
  isGES = false,
}: EnergyLabelProps) {
  // Energy classes with their corresponding colors
  const energyClasses = {
    a: "bg-[#2d7233] text-white",
    b: "bg-[#589e29] text-white",
    c: "bg-[#8cc540] text-black",
    d: "bg-[#f8d910] text-black",
    e: "bg-[#f5981c] text-black",
    f: "bg-[#ec6725] text-white",
    g: "bg-[#e1171e] text-white",
  };

  // GES classes with their corresponding colors
  const gesClasses = {
    a: "bg-[#f2eff3] text-black",
    b: "bg-[#d6c7da] text-black",
    c: "bg-[#b99bc0] text-black",
    d: "bg-[#9c6da7] text-white",
    e: "bg-[#7e408d] text-white",
    f: "bg-[#5e1973] text-white",
    g: "bg-[#3e005a] text-white",
  };

  const classes = isGES ? gesClasses : energyClasses;
  const validClass = className && Object.keys(classes).includes(className) 
    ? classes[className as keyof typeof classes] 
    : "bg-gray-200 text-gray-800";

  return (
    <Card className={error ? "border-destructive/50" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex flex-row items-stretch">
            {/* Energy label scale */}
            <div className="w-14 flex flex-col">
              {Object.entries(classes).map(([key, bgClass]) => (
                <div 
                  key={key}
                  className={cn(
                    "flex items-center justify-center h-10 first:rounded-tl-md last:rounded-bl-md",
                    bgClass,
                    className === key ? "border-2 border-black" : ""
                  )}
                >
                  {key.toUpperCase()}
                </div>
              ))}
            </div>
            
            {/* Value display */}
            <div className="flex-1 p-4">
              <div className="flex flex-col items-center justify-center h-full">
                {error ? (
                  <p className="text-destructive font-medium">Information manquante</p>
                ) : (
                  <>
                    <div className={cn(
                      "w-20 h-20 flex items-center justify-center rounded-full mb-2 text-3xl font-bold", 
                      validClass
                    )}>
                      {letter?.toUpperCase() || "?"}
                    </div>
                    <p className="font-medium">{value || "?"} {unit}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}