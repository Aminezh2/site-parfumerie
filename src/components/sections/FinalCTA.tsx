import Image from "next/image";

export default function FinalCTA() {
  return (
    <section className="relative py-16 md:py-32 bg-[#020202] text-white overflow-hidden border-t border-white/5">
      {/* Subtle background element */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
         <Image 
            src="/assets/images/Perfume_bottle_on_black_pedestal_202609010307.jpeg" 
            alt="Background" 
            fill 
            sizes="100vw"
            className="object-cover blur-sm" 
          />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/90 via-[#020202]/50 to-[#020202]" />

      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl mb-8">
          Votre prochaine signature <br/>
          <span className="italic font-light text-brand-gold">olfactive vous attend.</span>
        </h2>
        
        <button className="mt-8 px-12 py-5 bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 uppercase tracking-widest text-xs font-medium">
          Découvrir la collection
        </button>
      </div>
    </section>
  );
}
