export default function TargetUsers() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title max-w-[85vw]">Who FuturePath is designed to support</h1>
      <div className="mt-[8vh] flex gap-[5vw] items-stretch">
        <div className="w-[54vw] grid grid-cols-2 gap-x-[4vw] gap-y-[6vh] py-[2vh]">
          <p className="deck-copy">Working adults preparing for changes in their jobs</p>
          <p className="deck-copy">Fresh graduates, career switchers and tomorrow’s talent</p>
          <p className="deck-copy">HR and learning teams exploring reskilling needs</p>
          <p className="deck-copy">TVET and university career advisers supporting learners</p>
        </div>
        <div className="w-[29vw] min-h-[49vh] bg-accent text-bg p-[3vw] flex items-center">
          <p className="font-display text-[3.2vw] leading-[1.22]">Current demo: an individual career-planning journey</p>
        </div>
      </div>
    </div>
  );
}
