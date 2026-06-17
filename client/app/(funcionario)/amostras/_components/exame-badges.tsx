import { Badge } from "@/components/ui/badge";
import { MAX_EXAMES_VISIVEIS } from "../_lib/helpers";

export function ExameBadges({ exames }: { exames: string[] }) {
  const visiveis = exames.slice(0, MAX_EXAMES_VISIVEIS);
  const restantes = exames.length - MAX_EXAMES_VISIVEIS;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visiveis.map((exame) => (
        <Badge
          key={exame}
          variant="secondary"
          className="max-w-32 truncate border border-primary/20 bg-primary/8 text-xs font-normal text-primary/80"
          title={exame}
        >
          {exame}
        </Badge>
      ))}
      {restantes > 0 && (
        <Badge
          variant="outline"
          className="border-dashed border-border/60 text-xs font-normal text-muted-foreground"
        >
          +{restantes}
        </Badge>
      )}
    </div>
  );
}
