export default function Purpose() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text">
      <div className="absolute inset-y-0 left-0 w-[40vw] bg-accent flex items-center px-[5vw]">
        <h1 className="font-display text-[4.8vw] leading-[1.1] text-bg font-semibold">Build a future-ready career with purpose</h1>
      </div>
      <div className="absolute left-[46vw] right-[6vw] top-[15vh]">
        <ul className="deck-list">
          <li>Open Impact to explore all 17 UN Sustainable Development Goals</li>
          <li>See the chosen role’s goals, relevant skills and potential contribution</li>
          <li>SDG links describe possible contribution, not verified impact</li>
          <li>Recommendations use transparent rules; no language model is used</li>
          <li>FuturePath supports human career choices—it does not guarantee employment</li>
        </ul>
      </div>
    </div>
  );
}
