"use client";

import { useState } from "react";
import { 
  FlaskConical, 
  Pencil, 
  Calendar, 
  ChevronLeft, 
  ChevronRight 
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

// Dados iniciais mockados
const EXAMES_MOCK: Exame[] = [
  { id: "1", name: "Hemograma Completo", description: "Avaliação quantitativa e qualitativa das células sanguíneas.", createdAt: "15/01/2026" },
  { id: "2", name: "Glicemia de Jejum", description: "Mensuração dos níveis de glicose no sangue após período de jejum.", createdAt: "18/01/2026" },
  { id: "3", name: "Eletrocardiograma (ECG)", description: "Registro da atividade elétrica do coração em repouso.", createdAt: "20/01/2026" },
  { id: "4", name: "Colesterol Total e Frações", description: "Análise dos níveis de LDL, HDL e VLDL no organismo.", createdAt: "22/01/2026" },
  { id: "5", name: "Ureia e Creatinina", description: "Avaliação da função renal e taxa de filtração.", createdAt: "25/01/2026" },
  { id: "6", name: "TGO e TGP", description: "Avaliação das enzimas hepáticas e saúde do fígado.", createdAt: "26/01/2026" },
  { id: "7", name: "Exame de Urina Tipo 1", description: "Análise física, química e microscópica da urina.", createdAt: "28/01/2026" },
  { id: "8", name: "Papanicolau", description: "Exame preventivo ginecológico de rastreio.", createdAt: "30/01/2026" },
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
    window.scrollTo(0, 0);
  };

  // Lógica do Modal
  const openEditModal = (exame: Exame) => {
    setSelectedExame(exame);
    setEditName(exame.name);
    setEditDescription(exame.description);
    setIsModalOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExame) return;

    // Atualiza a lista localmente
    setExames((prev) =>
      prev.map((item) =>
        item.id === selectedExame.id
          ? { ...item, name: editName, description: editDescription }
          : item
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Exames
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o catálogo de exames oferecidos pelo laboratório.
          </p>
        </div>
        <div className="flex items-start md:items-center">
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
            <FlaskConical className="size-4" />
            {exames.length} exames
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentExames.map((exame) => (
          <Card 
            key={exame.id} 
            className="rounded-2xl border border-border bg-card shadow-sm transition-colors hover:border-accent/40 flex flex-col justify-between"
          >
            <CardContent className="p-5 flex flex-col h-full space-y-4">
              <div>
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <FlaskConical className="size-5" />
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {exame.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {exame.description}
                </p>
              </div>

              <div className="border-t border-border mt-4 pt-4 flex flex-col space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{exame.createdAt}</span>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => openEditModal(exame)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Próxima
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Exame</DialogTitle>
            <DialogDescription className="text-zinc-500">
              {selectedExame?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveChanges} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do exame</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                className="resize-none"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>
           
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}