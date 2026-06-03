"use client";

import { useState } from "react";
import {
  FlaskConical,
  Pencil,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Exame {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const EXAMES_MOCK: Exame[] = [
  {
    id: "1",
    name: "Hemograma Completo",
    description: "Avaliação quantitativa e qualitativa das células sanguíneas.",
    createdAt: "15/01/2026",
  },
  {
    id: "2",
    name: "Glicemia de Jejum",
    description:
      "Mensuração dos níveis de glicose no sangue após período de jejum.",
    createdAt: "18/01/2026",
  },
  {
    id: "3",
    name: "Eletrocardiograma (ECG)",
    description: "Registro da atividade elétrica do coração em repouso.",
    createdAt: "20/01/2026",
  },
  {
    id: "4",
    name: "Colesterol Total e Frações",
    description: "Análise dos níveis de LDL, HDL e VLDL no organismo.",
    createdAt: "22/01/2026",
  },
  {
    id: "5",
    name: "Ureia e Creatinina",
    description: "Avaliação da função renal e taxa de filtração.",
    createdAt: "25/01/2026",
  },
  {
    id: "6",
    name: "TGO e TGP",
    description: "Avaliação das enzimas hepáticas e saúde do fígado.",
    createdAt: "26/01/2026",
  },
  {
    id: "7",
    name: "Exame de Urina Tipo 1",
    description: "Análise física, química e microscópica da urina.",
    createdAt: "28/01/2026",
  },
  {
    id: "8",
    name: "Papanicolau",
    description: "Exame preventivo ginecológico de rastreio.",
    createdAt: "30/01/2026",
  },
];

export default function ExamesPage() {
  const [exames, setExames] = useState<Exame[]>(EXAMES_MOCK);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(exames.length / itemsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExame, setSelectedExame] = useState<Exame | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExames = exames.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditModal = (exame: Exame) => {
    setSelectedExame(exame);
    setEditName(exame.name);
    setEditDescription(exame.description);
    setIsModalOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExame) return;

    setExames((prev) =>
      prev.map((item) =>
        item.id === selectedExame.id
          ? { ...item, name: editName, description: editDescription }
          : item,
      ),
    );
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <FlaskConical className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate">
              Exames
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gerencie o catálogo de exames do laboratório.
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="self-start sm:self-auto shrink-0 gap-1.5 px-3 py-1.5 text-xs font-medium"
        >
          <FlaskConical className="size-3.5" />
          {exames.length} exames cadastrados
        </Badge>
      </div>

      <div className="h-px bg-border" />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentExames.map((exame) => (
          <Card
            key={exame.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
          >
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <FlaskConical className="size-4" />
                </span>
                <h3 className="min-w-0 pt-1 text-sm font-semibold leading-snug text-foreground line-clamp-2">
                  {exame.name}
                </h3>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {exame.description}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5 shrink-0" />
                  <span className="truncate">{exame.createdAt}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => openEditModal(exame)}
                >
                  <Pencil className="size-3" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="min-w-28 text-center text-sm text-muted-foreground">
            Página{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            de{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      )}

      {/* Modal de edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <FlaskConical className="size-4" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-base">Editar Exame</DialogTitle>
                <DialogDescription className="mt-0.5 truncate text-xs">
                  {selectedExame?.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveChanges} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do exame
              </Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                rows={3}
                className="resize-none"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Salvar alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
