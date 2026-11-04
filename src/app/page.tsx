export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-12 pt-10">
      <p className="font-titre text-xl font-semibold text-sauge">Fantômes</p>

      <h1 className="font-titre mt-10 text-4xl font-semibold leading-tight">
        Débusque les abonnements que tu paies sans t&apos;en servir.
      </h1>

      <p className="mt-5 text-lg leading-relaxed">
        Un essai jamais résilié, un service remplacé, une option activée une
        fois. En moyenne, ces petits prélèvements coûtent plusieurs centaines
        d&apos;euros par an, et personne ne les voit.
      </p>

      <ul className="mt-8 space-y-4 border-y border-trait py-6">
        <li>
          <p className="font-semibold">Tu déposes ton relevé</p>
          <p className="text-base">On repère les prélèvements qui reviennent.</p>
        </li>
        <li>
          <p className="font-semibold">Tu vois ce que ça te coûte par an</p>
          <p className="text-base">
            Classés du plus cher au moins cher, en euros par an.
          </p>
        </li>
        <li>
          <p className="font-semibold">Tu résilies en un envoi</p>
          <p className="text-base">
            On écrit la lettre de résiliation pour chacun.
          </p>
        </li>
      </ul>

      <a
        href="/questions"
        className="mt-8 block rounded-xl bg-sauge px-6 py-4 text-center text-lg font-semibold text-creme"
      >
        Commencer, c&apos;est gratuit
      </a>

      <p className="mt-3 text-center text-sm">
        3 questions, une minute, sans carte bancaire.
      </p>
    </main>
  );
}
