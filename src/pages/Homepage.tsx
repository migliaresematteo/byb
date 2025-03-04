import { motion } from 'framer-motion';
import { Users, Award, Building, ArrowRight, Home, FileText, Handshake, Trees, Map, LucideCheckCircle, PenTool, Wrench, Phone, BadgeCheck, Network, DraftingCompass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { properties } from '../data/properties';
import { TallyForm } from '../components/TallyForm';
import { FeaturedProperties } from '../components/FeaturedProperties';
import SEO from '../components/SEO';

export default function Homepage() {
  // SEO structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "BrickByBrick Immobiliare",
    "description": "Agenzia immobiliare specializzata nella vendita e affitto di proprietà in Italia",
    "url": "https://brickbybrickimmobiliare.it",
    "logo": "https://brickbybrickimmobiliare.it/logo.png",
    "areaServed": "Italia",
    "priceRange": "€€€",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Torino",
      "addressRegion": "Piemonte",
      "addressCountry": "IT"
    },
    "telephone": "+393403524759"
  };

  return (
    <div className="pt-16">
      <SEO 
        title="BrickByBrick Immobiliare - Trova la Tua Casa Ideale in Italia"
        description="Scopri le migliori proprietà immobiliari in Italia con BrickByBrick. Appartamenti, ville e case in vendita e affitto con le migliori offerte del mercato."
        keywords="immobiliare, case in vendita, appartamenti, ville, affitto case, immobili italia, Torino, Canavese, Ciriè, Nole"
        structuredData={organizationStructuredData}
        ogImage="https://brickbybrickimmobiliare.it/og-image.jpg"
      />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[80vh] bg-cover bg-center min-h-screen"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-5xl font-bold mb-6" 
            >
              BrickByBrick Immobiliare
            </motion.h1>
            <p className="text-xl mb-8">
              BrickByBrick Immobiliare è la tua agenzia di fiducia per trovare la casa ideale. 
              Scopri le migliori soluzioni immobiliari in tutta Italia e trova l'immobile perfetto per te e la tua famiglia.
            </p>
            <Link to="/properties">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-lime-500 text-white px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center"
              >
                Trova la Tua Casa Ideale
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Properties Recap Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12 pt-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">BrickByBrick Immobiliare: La Tua Scelta per Trovare Casa</h2>
            <p className="text-lg text-gray-700 text-center mb-8">
              Con BrickByBrick Immobiliare, trovare la casa ideale non è mai stato così semplice. 
              La nostra agenzia immobiliare offre soluzioni personalizzate per ogni esigenza, 
              aiutandoti a trovare l'immobile perfetto per te.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Valore Totale Portfolio</h3>
                <p className="text-4xl font-bold text-lime-500">
                  {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(properties.reduce((total, prop) => total + (prop.price || 0), 0) / 10)}
                </p>
              </div>
              <div className="text-center">
                <h2>Proprietà Disponibili</h2>
                <p className="text-4xl font-bold text-lime-500">
                  {properties.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="min-h-full flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-6">Chi siamo?</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Benvenuti su Brick by Brick, il vostro punto di riferimento per l'acquisto, la vendita e la locazione di immobili. Noi operiamo con passione e professionalità nel settore immobiliare, offrendo ai nostri clienti un servizio su misura, trasparente e affidabile.<br /><br />
                Il nostro obiettivo è accompagnarvi in ogni fase della trattativa, garantendo un’esperienza sicura e soddisfacente. Che si tratti di trovare la casa dei vostri sogni, vendere il vostro immobile al miglior prezzo o affittare con serenità, il nostro team di esperti è sempre pronto a fornirvi assistenza personalizzata.<br /><br />
                Grazie a una profonda conoscenza del mercato e a una rete consolidata di collaborazioni, riusciamo a proporvi soluzioni su misura, sia per privati che per investitori. La nostra filosofia si basa sull’ascolto attento delle vostre esigenze, sulla trasparenza e sull’impegno costante nel trovare le migliori opportunità per voi.<br /><br />
                Se state cercando un’agenzia immobiliare che vi segua con competenza e dedizione, Brick by Brick è la scelta giusta.
              </p>
              <Link to="tel:+393403524759">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-lime-500 text-white px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center"
                >
                  <Phone className="ml-2 h-5 w-5 me-2" />
                  Chiamaci
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
                alt="Luxury Home"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perchè sceglierci</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BadgeCheck, title: 'Professionalità e Trasparenza', desc: 'Ogni mattone conta. Ti accompagniamo in ogni fase della compravendita con competenza, chiarezza e aggiornamenti costanti. Nessun imprevisto, solo risultati concreti' },
              { icon: DraftingCompass, title: 'Soluzioni su Misura', desc: 'Ogni cliente è unico, proprio come la casa dei suoi sogni. Ti offriamo soluzioni personalizzate, cucite su misura per le tue esigenze, senza compromessi' },
              { icon: Network, title: 'Rete di Professionisti Affidabili', desc: 'Collaboriamo con costruttori, general contractor, ditte edili e professionisti qualificati per offrirti un servizio completo e soluzioni rapide, dalla ristrutturazione alla vendita' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6"
              >
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-lime-500" />
                <h2>{feature.title}</h2>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <FeaturedProperties properties={properties} />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Tutti i nostri servizi
            </motion.h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Da ricerca della proprieta' alla vendita di esse, offriamo un servizio completo e adatto ai tuoi bisogni!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { icon: Home, title: 'Valutazione gratuita immobili residenziali', desc: 'Offriamo una valutazione professionale e gratuita del valore di mercato degli immobili residenziali, fornendo un\'analisi dettagliata e aggiornata.' },
              { icon: Building, title: 'Valutazione gratuita immobili commerciali', desc: 'Determinazione precisa del valore degli immobili commerciali per garantire un’operazione di vendita o acquisto consapevole e vantaggiosa.' },
              { icon: Map, title: 'Valutazione gratuita terreni edificabili', desc: 'Analisi esperta del potenziale edificabile e del valore di mercato dei terreni destinati a nuove costruzioni.' },
              { icon: Trees, title: 'Valutazione gratuita terreni agricoli', desc: 'Stima professionale del valore dei terreni agricoli basata su caratteristiche, ubicazione e destinazione d’uso.' },
              { icon: FileText, title: 'Gestione pratiche', desc: 'Supporto completo nella gestione delle pratiche burocratiche e amministrative per compravendite immobiliari.' },
              { icon: LucideCheckCircle, title: 'Controllo documentale', desc: 'Verifica approfondita di tutta la documentazione necessaria per garantire la conformità legale e amministrativa dell’immobile.' },
              { icon: Handshake, title: 'Assistenza fino al rogito', desc: 'Accompagnamento in ogni fase della compravendita, fino alla firma del rogito notarile, garantendo un processo sicuro e trasparente.' },
              { icon: PenTool, title: 'Consulenze per cantieri residenziali e commerciali', desc: 'Analisi e strategie per la valorizzazione e vendita di cantieri residenziali e commerciali.' },
              { icon: Wrench, title: 'Consulenza per ristrutturazione di immobili', desc: 'Suggerimenti strategici per interventi di ristrutturazione finalizzati all’ottimizzazione del valore di mercato degli immobili.' }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-lime-500 transition-colors">
                  <service.icon className="h-6 w-6 text-lime-500 group-hover:text-white transition-colors" />
                </div>
                <h2>{service.title}</h2>
                <p className="text-gray-600 flex-grow">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Contattaci</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hai domande o vuoi maggiori informazioni? Compila il form sottostante e ti risponderemo il prima possibile.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <TallyForm src="https://tally.so/embed/w2lZMV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
