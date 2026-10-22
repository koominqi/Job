export default function WebsiteJourney() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text px-[6vw] py-[8vh]">
      <h1 className="deck-title max-w-[87vw]">How to use the website: one connected journey</h1>
      <div className="relative mt-[12vh] grid grid-cols-5 gap-[1.4vw]">
        <div className="bg-accent text-bg p-[1.7vw] min-h-[43vh]">
          <p className="text-[4vw] font-display mb-[4vh]">1</p>
          <p className="text-[2vw] leading-[1.3]"><strong>Profile:</strong> describe a synthetic learner’s skills and interests</p>
        </div>
        <div className="bg-text text-bg p-[1.7vw]">
          <p className="text-[4vw] font-display mb-[4vh]">2</p>
          <p className="text-[2vw] leading-[1.3]"><strong>Signal radar:</strong> explore dated public job-market signals</p>
        </div>
        <div className="bg-primary text-bg p-[1.7vw]">
          <p className="text-[4vw] font-display mb-[4vh]">3</p>
          <p className="text-[2vw] leading-[1.3]"><strong>Role matches:</strong> compare scores and understand skills gaps</p>
        </div>
        <div className="bg-text text-bg p-[1.7vw]">
          <p className="text-[4vw] font-display mb-[4vh]">4</p>
          <p className="text-[2vw] leading-[1.3]"><strong>Pathway:</strong> choose a role and follow a learning plan</p>
        </div>
        <div className="bg-accent text-bg p-[1.7vw]">
          <p className="text-[4vw] font-display mb-[4vh]">5</p>
          <p className="text-[2vw] leading-[1.3]"><strong>Impact:</strong> explore the career’s connection to the UN SDGs</p>
        </div>
      </div>
    </div>
  );
}
