import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Home, Shield, Leaf, Target, Clock } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {

  const values = [
    {
      icon: Shield,
      title: 'Affidabilità e Trasparenza',
      description: 'Costruiamo relazioni durature attraverso la trasparenza e la professionalità in ogni transazione.',
    },
    {
      icon: Users,
      title: 'Assistenza Personalizzata',
      description: 'Seguiamo ogni cliente con dedizione, dal primo contatto fino alla conclusione della trattativa.',
    },
    {
      icon: Home,
      title: 'Esperti del Territorio',
      description: 'Profonda conoscenza del mercato immobiliare del Canavese e delle sue peculiarità.',
    },
    {
      icon: Leaf,
      title: 'Sostenibilità',
      description: 'Promuoviamo soluzioni abitative moderne ed ecosostenibili in classe energetica A.',
    },
    {
      icon: Target,
      title: 'Obiettivi Chiari',
      description: 'Realizziamo i tuoi progetti immobiliari con precisione e determinazione.',
    },
    {
      icon: Clock,
      title: 'Disponibilità Costante',
      description: 'Sempre pronti ad assisterti, dalla prima visita fino al post-vendita, con reperibilità e supporto continuo.',
    }
  ];

  // SEO structured data for about page
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Chi Siamo - BrickByBrick Immobiliare",
    "description": "Brick By Brick Immobiliare nasce dalla passione per il territorio del Canavese e dalla volontà di offrire un servizio immobiliare di eccellenza.",
    "publisher": {
      "@type": "Organization",
      "name": "BrickByBrick Immobiliare",
      "logo": "https://brickbybrickimmobiliare.it/logo.png"
    }
  };

  return (
    <div className="pt-16">
      <SEO 
        title="Chi Siamo | BrickByBrick Immobiliare"
        description="Scopri chi siamo e la nostra missione. BrickByBrick Immobiliare è specializzata nella vendita e affitto di proprietà nel Canavese e a Torino."
        keywords="chi siamo, agenzia immobiliare, Canavese, Torino, Ciriè, Nole, Fiano, Cafasse, Villanova Canavese"
        canonicalUrl="https://brickbybrickimmobiliare.it/about"
        ogTitle="Chi Siamo | BrickByBrick Immobiliare"
        ogDescription="Scopri chi siamo e la nostra missione. BrickByBrick Immobiliare è specializzata nella vendita e affitto di proprietà nel Canavese e a Torino."
        structuredData={aboutStructuredData}
      />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-5xl font-bold mb-6"
            >
              Chi Siamo | BrickByBrick Immobiliare
            </motion.h1>
            <p className="text-xl">
              Brick By Brick Immobiliare: costruiamo il tuo futuro, mattone dopo mattone.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">La Nostra Storia</h1>
            <p className="text-gray-600 leading-relaxed">
              Brick By Brick Immobiliare nasce dalla passione per il territorio del Canavese e dalla volontà di offrire un servizio immobiliare di eccellenza. Specializzati nella zona di Torino e del Canavese, con particolare focus su comuni come Ciriè, Nole, Fiano, Cafasse e Villanova Canavese, ci distinguiamo per la profonda conoscenza del mercato locale e per l'attenzione alle esigenze di ogni cliente.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              La nostra missione è guidare i clienti verso le migliori opportunità immobiliari, siano esse appartamenti moderni, ville esclusive o soluzioni abitative sostenibili. Puntiamo sulla qualità, sull'efficienza energetica e sul rispetto dell'ambiente, promuovendo immobili in classe A e soluzioni innovative.
            </p>
          </div>

          {/* Values */}
          <h1 className="text-4xl font-bold mb-8 text-center">I Nostri Valori</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <value.icon className="w-12 h-12 text-lime-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{value.title}</h2>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}