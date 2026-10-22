const base = import.meta.env.BASE_URL;
export default function RoleMatches() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title">Step 3 — Understand your role matches</h1>
      <div className="flex gap-[4vw] mt-[6vh] items-center">
        <ul className="deck-list w-[44vw] shrink-0">
          <li>Open Role matches and expand a ranked role</li>
          <li>Compare skill readiness, interest fit and posting demand</li>
          <li>Review the skills already matched and the gaps remaining</li>
          <li>Check the role reference and the scoring explanation</li>
          <li>Select Build pathway for this role; scores support decisions, not hiring</li>
        </ul>
        <div className="w-[40vw] h-[64vh] bg-primary p-[0.5vw]">
          <img src={`${base}matches.jpg`} alt="The FuturePath ranked role matches screen" crossOrigin="anonymous" className="screen" />
        </div>
      </div>
    </div>
  );
}
