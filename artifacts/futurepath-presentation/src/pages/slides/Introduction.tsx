const base = import.meta.env.BASE_URL;
export default function Introduction() {
  return (
    <div className="w-screen h-screen overflow-hidden relative deck-frame font-body text-text">
      <div className="absolute top-0 right-0 w-[38vw] h-full bg-accent" />
      <div className="absolute left-[6vw] top-[13vh] w-[51vw]">
        <h1 className="font-display text-[5.2vw] font-semibold leading-[1.08] text-balance">
          <span className="block text-primary mb-[3vh]">FuturePath — </span>
          Your skills today. Your possibilities tomorrow.
        </h1>
        <p className="deck-copy mt-[5vh] max-w-[47vw] text-muted">A future-ready career companion for exploring roles, understanding skills gaps and building practical learning pathways.</p>
      </div>
      <div className="absolute right-[3vw] top-[20vh] w-[37vw] h-[60vh] bg-bg p-[0.5vw] shadow-xl">
        <img src={`${base}overview.jpg`} alt="FuturePath website overview with career matches and next actions" crossOrigin="anonymous" className="w-full h-full object-cover object-left" />
      </div>
    </div>
  );
}
