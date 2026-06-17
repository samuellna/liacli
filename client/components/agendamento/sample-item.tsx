"use client";

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findAllExamTypes } from "@/api/exams";
import type { ExamType } from "@/api/types";

import { OTHER_EXAM_ID } from "../../app/(pesquisador)/agendamento/_lib/schema";
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

  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [examsError, setExamsError] = useState<string | null>(null);

  async function loadExamTypes() {
    setExamsError(null);
    setIsLoadingExams(true);
    try {
      const data = await findAllExamTypes();
      setExamTypes(data);
    } catch (err) {
      setExamsError(
        err instanceof Error ? err.message : "Erro ao carregar exames.",
      );
    } finally {
      setIsLoadingExams(false);
    }
  }

  useEffect(() => {
    loadExamTypes();
  }, []);

  const sampleErrors = errors.sample?.[index];
  const watchedExames = watch(`sample.${index}.samples`) ?? [];
  const hasOutro = watchedExames.includes(OTHER_EXAM_ID);

  return (
    <article className="rounded-2xl bg-card">
      <div className="space-y-5 ">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`especie-${index}`} className="text-sm font-medium">
              Espécie animal
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id={`especie-${index}`}
              placeholder="Ex.: Rattus norvegicus"
              {...register(`sample.${index}.animalSpecies`)}
              aria-invalid={!!sampleErrors?.animalSpecies}
              aria-describedby={
                sampleErrors?.animalSpecies ? `especie-err-${index}` : undefined
              }
            />
            <FieldError message={sampleErrors?.animalSpecies?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`animais-${index}`} className="text-sm font-medium">
              Total de animais
              <span aria-hidden className="text-destructive">
                *
              </span>
            </Label>
            <Input
              id={`animais-${index}`}
              type="number"
              min={1}
              placeholder="Ex.: 12"
              {...register(`sample.${index}.totalAnimals`)}
              aria-invalid={!!sampleErrors?.totalAnimals}
            />
            <FieldError message={sampleErrors?.totalAnimals?.message} />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Exames desejados
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>

          {isLoadingExams && (
            <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Carregando exames disponíveis…
            </div>
          )}

          {!isLoadingExams && examsError && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <span className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-4 shrink-0" aria-hidden />
                {examsError}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadExamTypes}
                className="gap-1.5"
              >
                <RefreshCw className="size-3.5" aria-hidden />
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoadingExams && !examsError && (
            <Controller
              control={control}
              name={`sample.${index}.samples`}
              render={({ field }) => (
                <div
                  role="group"
                  aria-label="Exames desejados"
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {examTypes.map((exam) => {
                    const examId = String(exam.id);
                    const checked = field.value.includes(examId);
                    return (
                      <label
                        key={examId}
                        htmlFor={`exam-${index}-${examId}`}
                        className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent p-2 transition-colors hover:bg-muted/50 has-checked:border-accent/30 has-checked:bg-accent/5"
                      >
                        <Checkbox
                          id={`exam-${index}-${examId}`}
                          checked={checked}
                          onCheckedChange={(val) => {
                            const updated = val
                              ? [...field.value, examId]
                              : field.value.filter((v) => v !== examId);
                            field.onChange(updated);
                          }}
                          className="mt-0.5"
                        />
                        <span className="text-sm leading-snug text-foreground/80">
                          {exam.name}
                        </span>
                      </label>
                    );
                  })}

                  <label
                    htmlFor={`exam-${index}-${OTHER_EXAM_ID}`}
                    className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent p-2 transition-colors hover:bg-muted/50 has-checked:border-accent/30 has-checked:bg-accent/5"
                  >
                    <Checkbox
                      id={`exam-${index}-${OTHER_EXAM_ID}`}
                      checked={hasOutro}
                      onCheckedChange={(val) => {
                        const updated = val
                          ? [...field.value, OTHER_EXAM_ID]
                          : field.value.filter((v) => v !== OTHER_EXAM_ID);
                        field.onChange(updated);
                      }}
                      className="mt-0.5"
                    />
                    <span className="text-sm leading-snug text-foreground/80">
                      Outro
                    </span>
                  </label>
                </div>
              )}
            />
          )}

          <FieldError message={sampleErrors?.samples?.message} />
        </div>

        {hasOutro && (
          <div className="space-y-1.5">
            <Label htmlFor={`outro-${index}`} className="text-sm font-medium">
              Especifique o outro exame
            </Label>
            <Input
              id={`outro-${index}`}
              placeholder="Descreva o exame solicitado"
              {...register(`sample.${index}.samples`)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor={`remessas-${index}`} className="text-sm font-medium">
            Previsão de remessas
            <span aria-hidden className="text-destructive">
              *
            </span>
          </Label>
          <Input
            id={`remessas-${index}`}
            placeholder="Ex.: 4 remessas ao longo de 3 meses"
            {...register(`sample.${index}.expectedShipments`)}
            aria-invalid={!!sampleErrors?.expectedShipments}
          />
          <p className="text-xs text-muted-foreground">
            Estimativa de quantas remessas serão enviadas durante a pesquisa.
          </p>
          <FieldError message={sampleErrors?.expectedShipments?.message} />
        </div>
      </div>
    </article>
  );
}
