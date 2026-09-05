import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#020202] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-2xl text-white tracking-wider block">
                Zakaria Fragrances
              </span>
              <span className="text-[0.6rem] text-brand-gold tracking-[0.2em] uppercase mt-1 block">
                Perfumes & Decants
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Des fragrances originales sélectionnées avec exigence pour vous offrir une expérience olfactive à la hauteur de vos goûts.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg mb-6 text-brand-gold">Boutique</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/collection" className="hover:text-white transition-colors">Toute la collection</Link></li>
              <li><Link href="/homme" className="hover:text-white transition-colors">Parfums Homme</Link></li>
              <li><Link href="/femme" className="hover:text-white transition-colors">Parfums Femme</Link></li>

              <li><Link href="/decants" className="hover:text-white transition-colors">Échantillons & Décants</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg mb-6 text-brand-gold">Maison</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos de nous</Link></li>
              <li><Link href="/authenticite" className="hover:text-white transition-colors">Notre garantie d'authenticité</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Journal Olfactif</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contactez-nous</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg mb-6 text-brand-gold">Légal</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/cgv" className="hover:text-white transition-colors">Conditions générales de vente</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/livraison" className="hover:text-white transition-colors">Livraison & Retours</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Zakaria Fragrances. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>Paiement sécurisé</span>
            <span>Livraison internationale</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
