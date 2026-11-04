"use client";

import { useState } from "react";

type Ligne = { mois: string; label: string; montant: number };
type Fantome = { nom: string; mensuel: number; annuel: number; fois: number };

const EXEMPLE = `Date;Libellé;Montant
03/01/2026;PRLV SEPA NETFLIX.COM;-13,49
05/01/2026;CB CARREFOUR 4521;-62,30
08/01/2026;PRLV BASIC FIT 8841;-29,99
12/01/2026;PRLV SPOTIFY AB;-10,99
28/01/2026;VIR SALAIRE;1800,00
03/02/2026;PRLV SEPA NETFLIX.COM;-13,49
08/02/2026;PRLV BASIC FIT 8841;-29,99
11/02/2026;CB BOULANGERIE;-4,20
12/02/2026;PRLV SPOTIFY AB;-10,99
03/03/2026;PRLV SEPA NETFLIX.COM;-13,49
08/03/2026;PRLV BASIC FIT 8841;-29,99
12/03/2026;PRLV SPOTIFY AB;-10,99
15/03/2026;CB PHARMACIE;-18,50`;

function nombre(s: string): number | null {
  const t = s.replace(/[€\s\u00a0"]/g, "");
  if (!/\d/.test(t) || !/^[-+]?[\d.,]+$/.test(t)) return null;
  const n = /,\d{1,2}$/.test(t)
    ? t.replace(/\./g, "").replace(",", ".")
    : t.replace(/,/g, "");
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function moisDe(s: string): string | null {
  let m = s.match(/(\d{2})[/.-](\d{2})[/.-](\d{4})/);
  if (m) return `${m[3]}-${m[2]}`;
  m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}`;
  return null;
}

function nettoyer(label: string): string {
  return label
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\d+/g, " ")
    .replace(
      /\b(PRLV|PRELEVEMENT|SEPA|CB|CARTE|PAIEMENT|VIR|VIREMENT|REF|DE|DU|LE|LA|ECH|FACTURE|FACT|MANDAT|ID|PAR)\b/g,
      " "
    )
    .replace(/[^A-Z ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .join(" ");
}

function analyser(texte: string): Fantome[] {
  const lignes = texte.split(/\r?\n/).filter((l) => l.trim());
  const sep = texte.includes("\t")
    ? "\t"
    : lignes.slice(0, 5).join("").split(";").length > 2
    ? ";"
    : ",";

  const toutes: Ligne[] = [];
  for (const l of lignes) {
    const champs = l.split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
    let mois: string | null = null;
    for (const c of champs) {
      mois = moisDe(c);
      if (mois) break;
    }
    const textes = champs.filter((c) => nombre(c) === null && !moisDe(c));
    const label = textes.sort((a, b) => b.length - a.length)[0];
    const montant = champs.map(nombre).find((n) => n !== null && n !== 0);
    if (mois && label && montant !== undefined && montant !== null) {
      toutes.push({ mois, label, montant });
    }
  }

  const aDesNegatifs = toutes.some((l) => l.montant < 0);
  const depenses = toutes.filter((l) => !aDesNegatifs || l.montant < 0);

  const groupes = new Map<string, Ligne[]>();
  for (const l of depenses) {
    const cle = nettoyer(l.label);
    if (!cle) continue;
    groupes.set(cle, [...(groupes.get(cle) ?? []), l]);
  }

  const resultat: Fantome[] = [];
  groupes.forEach((items, nom) => {
    const montants = items.map((i) => Math.abs(i.montant)).sort((a, b) => a - b);
    const median = montants[Math.floor(montants.length / 2)];
    const proches = items.filter(
      (i) => Math.abs(Math.abs(i.montant) - median) <= median * 0.15
    );
    const moisDistincts = new Set(proches.map((i) => i.mois));
    if (moisDistincts.size >= 2) {
      resultat.push({
        nom,
        mensuel: median,
        annuel: Math.round(median * 12),
        fois: moisDistincts.size,
      });
    }
  });
  return resultat.sort((a, b) => b.annuel - a.annuel);
}

const euros = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function Depot() {
  const [texte, setTexte] = useState("");
  const [liste, setListe] = useState<Fantome[] | null>(null);

  function lancer(contenu: string) {
    setTexte(contenu);
    setListe(analyser(contenu));
  }

  async function fichier(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) lancer(await f.text());
  }

  const total = liste?.reduce((s, f) => s + f.annuel, 0) ?? 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-12 pt-10">
      <p className="font-titre text-xl font-semibold text-sauge">Fantômes</p>
      <h1 className="font-titre mt-8 text-3xl font-semibold leading-tight">
        Dépose ton relevé bancaire
      </h1>
      <p className="mt-3 text-base">
        Fichier CSV exporté depuis ta banque. Il est analysé sur ton téléphone :
        il n&apos;est ni envoyé, ni enregistré.
      </p>

      <label className="mt-6 block cursor-pointer rounded-xl bg-sauge px-6 py-4 text-center text-lg font-semibold text-creme">
        Choisir mon fichier
        <input
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          onChange={fichier}
          className="hidden"
        />
      </label>
      <button
        onClick={() => lancer(EXEMPLE)}
        className="mt-3 w-full rounded-xl border border-trait bg-white px-6 py-4 text-lg font-semibold"
      >
        Tester avec un exemple
      </button>

      {liste && liste.length === 0 && (
        <p className="mt-8 rounded-xl bg-sauge-clair p-5 text-base">
          Aucun prélèvement régulier trouvé. Vérifie que le fichier contient
          plusieurs mois, avec une date, un libellé et un montant par ligne.
        </p>
      )}

      {liste && liste.length > 0 && (
        <section className="mt-8">
          <div className="rounded-xl bg-sauge-clair p-6">
            <p className="text-base">
              {liste.length} prélèvement{liste.length > 1 ? "s" : ""} régulier
              {liste.length > 1 ? "s" : ""} trouvé{liste.length > 1 ? "s" : ""}
            </p>
            <p className="font-titre mt-1 text-4xl font-semibold text-sauge">
              {euros(total)} € par an
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {liste.map((f, i) => (
              <li
                key={f.nom}
                className="rounded-xl border border-trait bg-white p-4"
              >
                <p className="font-semibold">{f.nom}</p>
                {i === 0 ? (
                  <p className="text-base">
                    {euros(f.mensuel)} € par mois, soit{" "}
                    <strong>{euros(f.annuel)} € par an</strong>
                  </p>
                ) : (
                  <p className="text-base">Montant et lettre : verrouillés</p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            Les prélèvements sont classés par montant annuel. Tous ne sont pas
            forcément à supprimer : à toi de choisir.
          </p>
        </section>
      )}
    </main>
  );
}
