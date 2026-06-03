"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EXAM_OPTIONS } from "../../app/(pesquisador)/agendamento/_lib/schema";
import type { SchedulingFormData } from "../../app/(pesquisador)/agendamento/_lib/schema";

type SampleItemProps = {
  index: number;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  );
}

export function SampleItem({ index }: SampleItemProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<SchedulingFormData>();

  const sampleErrors = errors.amostras?.[index];
  const watchedExames = watch(`amostras.${index}.exames`) ?? [];
  const hasOutro = watchedExames.includes("outro");

  return (
    <article className="rounded-2xl bg-card">
      <div className="space-y-5 ">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`especie-${index}`} className="text-sm font-medium">
              Espécie animal{" "}
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id={`especie-${index}`}
              placeholder="Ex.: Rattus norvegicus"
              {...register(`amostras.${index}.especieAnimal`)}
              aria-invalid={!!sampleErrors?.especieAnimal}
              aria-describedby={
                sampleErrors?.especieAnimal ? `especie-err-${index}` : undefined
              }
            />
            <FieldError message={sampleErrors?.especieAnimal?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`animais-${index}`} className="text-sm font-medium">
              Total de animais{" "}
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id={`animais-${index}`}
              type="number"
              min={1}
              placeholder="Ex.: 12"
              {...register(`amostras.${index}.totalAnimais`)}
              aria-invalid={!!sampleErrors?.totalAnimais}
            />
            <FieldError message={sampleErrors?.totalAnimais?.message} />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Exames desejados{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Controller
            control={control}
            name={`amostras.${index}.exames`}
            render={({ field }) => (
              <div
                role="group"
                aria-label="Exames desejados"
                className="grid gap-2 sm:grid-cols-2"
              >
                {EXAM_OPTIONS.map((exam) => {
                  const checked = field.value.includes(exam.id);
                  return (
                    <label
                      key={exam.id}
                      htmlFor={`exam-${index}-${exam.id}`}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent p-2 transition-colors hover:bg-muted/50 has-checked:border-accent/30 has-checked:bg-accent/5"
                    >
                      <Checkbox
                        id={`exam-${index}-${exam.id}`}
                        checked={checked}
                        onCheckedChange={(val) => {
                          const updated = val
                            ? [...field.value, exam.id]
                            : field.value.filter((v) => v !== exam.id);
                          field.onChange(updated);
                        }}
                        className="mt-0.5"
                      />
                      <span className="text-sm leading-snug text-foreground/80">
                        {exam.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          <FieldError message={sampleErrors?.exames?.message} />
        </div>

        {hasOutro && (
          <div className="space-y-1.5">
            <Label htmlFor={`outro-${index}`} className="text-sm font-medium">
              Especifique o outro exame
            </Label>
            <Input
              id={`outro-${index}`}
              placeholder="Descreva o exame solicitado"
              {...register(`amostras.${index}.outroExame`)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor={`remessas-${index}`} className="text-sm font-medium">
            Previsão de remessas{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id={`remessas-${index}`}
            placeholder="Ex.: 4 remessas ao longo de 3 meses"
            {...register(`amostras.${index}.previsaoRemessas`)}
            aria-invalid={!!sampleErrors?.previsaoRemessas}
          />
          <p className="text-xs text-muted-foreground">
            Estimativa de quantas remessas serão enviadas durante a pesquisa.
          </p>
          <FieldError message={sampleErrors?.previsaoRemessas?.message} />
        </div>
      </div>
    </article>
  );
}
