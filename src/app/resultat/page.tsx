export default async function Resultat({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}) {
  const p = await searchParams;
  const nb = Math.min(Math.max(Number(p.a) || 8, 1), 20);
  const oubli = Math.min(Math.max(Number(p.b) || 2, 1), 3);
  const essai = Math.min(Math.max(Number(p.c) || 2, 1), 3);

  // Estimation prudente, annoncée comme telle sur l'écran.
  const part = 0.12 + oubli * 0.04 + essai * 0.03;
  const oublies = Math.max(1, Math.round(nb * part));
  const parAn = Math.round(oublies * 9 * 12);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-12 pt-10">
      <p className="font-titre text-xl font-semibold text-sauge">Fantômes</p>

      <p className="mt-10 text-base">Avec tes réponses, on estime que tu as</p>
      <h1 className="font-titre mt-2 text-4xl font-semibold leading-tight">
        environ {oublies} abonnement{oublies > 1 ? "s" : ""} oublié
        {oublies > 1 ? "s" : ""}.
      </h1>

      <div className="mt-8 rounded-xl bg-sauge-clair p-6">
        <p className="text-base">Ce que ça te coûte, sans que tu le voies</p>
        <p className="font-titre mt-1 text-5xl font-semibold text-sauge">
          {parAn} € par an
        </p>
        <p className="mt-3 text-sm">
          Estimation prudente à partir de tes réponses (environ 9 € par mois et
          par abonnement oublié). Ton vrai chiffre se lit sur ton relevé.
        </p>
      </div>

      <p className="mt-8 text-lg leading-relaxed">
        Dépose ton relevé : on retrouve tes prélèvements réguliers, on les
        classe par montant annuel, et on écrit pour toi la lettre de
        résiliation de chacun.
      </p>

      <a
        href="/depot"
        className="mt-8 block rounded-xl bg-sauge px-6 py-4 text-center text-lg font-semibold text-creme"
      >
        Voir mes vrais abonnements
      </a>
      <p className="mt-3 text-center text-sm">
        Gratuit pour commencer, sans carte bancaire.
      </p>
    </main>
  );
}
