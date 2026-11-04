"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    titre: "Combien d'abonnements penses-tu avoir ?",
    aide: "Streaming, musique, salle de sport, applis, box...",
    choix: [
      { label: "Moins de 5", valeur: 4 },
      { label: "Entre 5 et 10", valeur: 8 },
      { label: "Plus de 10", valeur: 12 },
    ],
  },
  {
    titre: "Quand as-tu vérifié ton relevé pour la dernière fois, ligne par ligne ?",
    aide: "Sois honnête, personne ne te juge.",
    choix: [
      { label: "Ce mois-ci", valeur: 1 },
      { label: "Il y a plusieurs mois", valeur: 2 },
      { label: "Jamais vraiment", valeur: 3 },
    ],
  },
  {
    titre: "As-tu déjà oublié de résilier un essai gratuit ?",
    aide: "Un mois offert devenu un abonnement payant.",
    choix: [
      { label: "Oui, plusieurs fois", valeur: 3 },
      { label: "Oui, une fois", valeur: 2 },
      { label: "Je ne crois pas", valeur: 1 },
    ],
  },
];

export default function Questions() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<number[]>([]);

  const q = QUESTIONS[etape];
  const progression = ((etape + 1) / QUESTIONS.length) * 100;

  function choisir(valeur: number) {
    const suite = [...reponses, valeur];
    if (etape + 1 < QUESTIONS.length) {
      setReponses(suite);
      setEtape(etape + 1);
    } else {
      window.location.href = `/resultat?a=${suite[0]}&b=${suite[1]}&c=${suite[2]}`;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-12 pt-8">
      <div className="h-2 w-full overflow-hidden rounded-full bg-trait">
        <div
          className="h-full rounded-full bg-sauge transition-all"
          style={{ width: `${progression}%` }}
        />
      </div>
      <p className="mt-3 text-sm">
        Question {etape + 1} sur {QUESTIONS.length}
      </p>

      <h1 className="font-titre mt-8 text-3xl font-semibold leading-tight">
        {q.titre}
      </h1>
      <p className="mt-3 text-base">{q.aide}</p>

      <div className="mt-8 space-y-3">
        {q.choix.map((c) => (
          <button
            key={c.label}
            onClick={() => choisir(c.valeur)}
            className="block w-full rounded-xl border border-trait bg-white px-5 py-4 text-left text-lg font-semibold active:bg-sauge-clair"
          >
            {c.label}
          </button>
        ))}
      </div>
    </main>
  );
}
