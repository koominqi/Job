export default function Problem() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title max-w-[84vw] text-[76px]">The problem: Career decisions are getting harder</h1>
      <div className="grid grid-cols-2 gap-x-[6vw] gap-y-[8vh] mt-[9vh]">
        <p className="deck-copy border-t-[0.25vh] border-primary pt-[3vh]">AI is changing tasks, roles and the skills people need</p>
        <p className="deck-copy border-t-[0.25vh] border-primary pt-[3vh]">Workers and graduates struggle to decide what to learn next</p>
        <p className="deck-copy border-t-[0.25vh] border-accent pt-[3vh]">Static course lists do not explain personal skills gaps</p>
        <p className="deck-copy border-t-[0.25vh] border-accent pt-[3vh]">Career planning needs current evidence, realistic options and human judgement</p>
      </div>
    </div>
  );
}
