const base = import.meta.env.BASE_URL;
export default function SkillsProfile() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title">Step 1 — Build a skills profile</h1>
      <div className="flex gap-[4vw] mt-[7vh] items-center">
        <ul className="deck-list w-[44vw] shrink-0">
          <li>Open Profile and select current skills and interests</li>
          <li>Set experience and available learning hours per week</li>
          <li>Choose moderate or fast AI-change assumptions</li>
          <li>Select Save and re-match to update recommendations</li>
          <li>Use synthetic details only; do not enter real CVs or personal data</li>
        </ul>
        <div className="w-[40vw] h-[63vh] bg-text p-[0.5vw]">
          <img src={`${base}profile.jpg`} alt="The actual FuturePath skills profile screen" crossOrigin="anonymous" className="screen" />
        </div>
      </div>
    </div>
  );
}
