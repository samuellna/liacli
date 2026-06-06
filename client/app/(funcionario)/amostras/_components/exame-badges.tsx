import { Badge } from "@/components/ui/badge";
import { MAX_EXAMES_VISIVEIS } from "../_lib/helpers";

export function ExameBadges({ exames }: { exames: string[] }) {
  const visiveis = exames.slice(0, MAX_EXAMES_VISIVEIS);
  const restantes = exames.length - MAX_EXAMES_VISIVEIS;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visiveis.map((exame) => (
        <Badge key={exame} variant="secondary" className="text-xs font-normal">
          {exame}
        </Badge>
      ))}
      {restantes > 0 && (
        <Badge
          variant="outline"
          className="border-dashed text-xs font-normal text-muted-foreground"
        >
          +{restantes}
        </Badge>
      )}
    </div>
  );
}
