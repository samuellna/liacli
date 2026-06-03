"use client";

import { CalendarDays } from "lucide-react";

import { WeekPicker } from "@/components/agendamento/week-picker";

import { Section } from "./section";

export function WeekSection() {
  return (
    <Section
      step={4}
      icon={CalendarDays}
      title="Semana de envio"
      description="Selecione a semana em que deseja realizar o envio das amostras"
    >
      <WeekPicker />
    </Section>
  );
}
