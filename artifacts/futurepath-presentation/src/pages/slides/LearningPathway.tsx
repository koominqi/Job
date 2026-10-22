export default function LearningPathway() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title max-w-[86vw]">Step 4 — Follow a practical learning pathway</h1>
      <ol className="mt-[6vh] w-[87vw] space-y-[2.4vh]">
        <li className="flex gap-[2vw] items-start border-b border-accent/25 pb-[2vh]">
          <span className="font-display text-primary text-[3vw] leading-none w-[3vw]">1</span>
          <p className="deck-copy">Review ordered learning steps and estimated study time</p>
        </li>
        <li className="flex gap-[2vw] items-start border-b border-accent/25 pb-[2vh]">
          <span className="font-display text-primary text-[3vw] leading-none w-[3vw]">2</span>
          <p className="deck-copy">Open linked learning resources from named providers</p>
        </li>
        <li className="flex gap-[2vw] items-start border-b border-accent/25 pb-[2vh]">
          <span className="font-display text-primary text-[3vw] leading-none w-[3vw]">3</span>
          <p className="deck-copy">Mark steps complete and track progress</p>
        </li>
        <li className="flex gap-[2vw] items-start border-b border-accent/25 pb-[2vh]">
          <span className="font-display text-primary text-[3vw] leading-none w-[3vw]">4</span>
          <p className="deck-copy">Profile and progress are saved in the current browser</p>
        </li>
        <li className="flex gap-[2vw] items-start">
          <span className="font-display text-primary text-[3vw] leading-none w-[3vw]">5</span>
          <p className="deck-copy">Hours are planning estimates; check provider availability and any extra fees</p>
        </li>
      </ol>
    </div>
  );
}
