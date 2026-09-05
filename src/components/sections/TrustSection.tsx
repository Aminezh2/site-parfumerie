import { ShieldCheck, Sparkles, Truck, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "AUTHENTICITÉ",
    description: "Des fragrances originales sélectionnées avec exigence."
  },
  {
    icon: Sparkles,
    title: "SÉLECTION",
    description: "Des parfums choisis pour leur qualité et leur caractère."
  },
  {
    icon: Truck,
    title: "LIVRAISON",
    description: "Une expérience simple et fiable jusqu'à votre porte."
  },
  {
    icon: HeartHandshake,
    title: "SERVICE",
    description: "Nous sommes disponibles pour vous accompagner."
  }
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-brand-black text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:border-brand-gold transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-brand-gold-light group-hover:text-brand-gold transition-colors" strokeWidth={1} />
              </div>
              <h3 className="font-serif tracking-widest text-sm uppercase mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm font-light max-w-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
