import Link from "next/link";
import Image from "next/image";

export default function FragranceDiscovery() {
  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a] text-white border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
        <span className="text-brand-gold text-xs tracking-[0.2em] uppercase mb-6 block">
          Le sur-mesure
        </span>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          Trouvez la fragrance qui <br className="hidden md:block" />
          <span className="italic text-brand-gold-light">vous ressemble.</span>
        </h2>
        <p className="text-white/60 font-light text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Une sélection pensée selon vos goûts, votre personnalité et vos envies. Laissez-nous vous guider vers votre prochaine signature olfactive.
        </p>
        
        <Link
          href="/collection"
          className="inline-block w-full sm:w-auto px-10 py-5 bg-white text-brand-black hover:bg-brand-gold transition-colors duration-500 uppercase tracking-widest text-xs font-medium"
        >
          Trouver mon parfum
        </Link>
      </div>
    </section>
  );
}

