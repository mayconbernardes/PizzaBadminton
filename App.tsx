
import React, { useState, useMemo } from 'react';
import { PIZZAS, SPECIALTIES, STUDENT_MENU, CONTACT_PHONE } from './constants';
import { PizzaSize, CartItem } from './types';

// --- Constants & Helpers ---
const PHONE_RAW = CONTACT_PHONE.replace(/\s/g, '').substring(1);
const SMS_PHONE = CONTACT_PHONE.replace(/\s/g, '');
const WHATSAPP_BASE_URL = `https://wa.me/33${PHONE_RAW}`;

const formatPrice = (p: string | number) => {
  if (typeof p === 'number') return p.toFixed(2) + ' €';
  return p;
};

const parsePrice = (p: string) => parseFloat(p.replace(' €', '').replace(',', '.'));

// --- Components ---

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-4xl font-serif text-gray-800 uppercase tracking-widest">{title}</h2>
    <div className="w-24 h-1 bg-red-600 mx-auto mt-3 mb-2 rounded-full"></div>
    {subtitle && <p className="text-gray-500 italic">{subtitle}</p>}
  </div>
);

const App: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('full');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Cart Logic ---
  const addToCart = (item: any, size?: PizzaSize) => {
    const priceStr = size ? (item.prices as any)[size] : item.price;
    const price = parsePrice(priceStr);
    const cartId = size ? `${item.id}-${size}` : item.id;

    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        cartId,
        id: item.id,
        name: item.name,
        size,
        price,
        quantity: 1
      }];
    });

    if (cart.length === 0) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    if (!pickupTime) {
      alert("Veuillez choisir une heure de retrait.");
      return;
    }

    let message = `Bonjour! Je souhaite passer une commande:\n\n`;
    cart.forEach(item => {
      const sizeLabel = item.size === 'quarter' ? '1/4' : item.size === 'half' ? '1/2' : item.size === 'full' ? 'Entière' : '';
      let itemNote = '';

      // Add "Choice Needed" note for specific items
      if (item.name.toLowerCase().includes(' ou ')) {
        itemNote = ' (À préciser: qual?)';
      } else if (item.id === 'menu-etudiant') {
        itemNote = ' (Précisez la pizza/boisson/dessert)';
      }

      message += `• ${item.quantity}x ${item.name} ${sizeLabel ? `(${sizeLabel})` : ''} - ${formatPrice(item.price * item.quantity)}${itemNote}\n`;
    });
    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n`;
    message += `\n🕒 *Heure de retrait: ${pickupTime}*`;
    message += `\n\nMerci!`;

    window.open(`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendSmsOrder = () => {
    if (cart.length === 0) return;
    if (!pickupTime) {
      alert("Veuillez choisir une heure de retrait.");
      return;
    }

    let message = `Bonjour! Je souhaite passer une commande:\n\n`;
    cart.forEach(item => {
      const sizeLabel = item.size === 'quarter' ? '1/4' : item.size === 'half' ? '1/2' : item.size === 'full' ? 'Entière' : '';
      let itemNote = '';

      if (item.name.toLowerCase().includes(' ou ')) {
        itemNote = ' (À préciser: qual?)';
      } else if (item.id === 'menu-etudiant') {
        itemNote = ' (Précisez la pizza/boisson/dessert)';
      }

      message += `• ${item.quantity}x ${item.name} ${sizeLabel ? `(${sizeLabel})` : ''} - ${formatPrice(item.price * item.quantity)}${itemNote}\n`;
    });
    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n`;
    message += `\n🕒 *Heure de retrait: ${pickupTime}*`;
    message += `\n\nMerci!`;

    window.location.href = `sms:${SMS_PHONE}?&body=${encodeURIComponent(message)}`;
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('menu-content');
    if (!element) return;
    setIsGeneratingPdf(true);
    const opt = {
      margin: [15, 12, 15, 12],
      filename: 'Menu_Pizza_Specialites.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save().then(() => setIsGeneratingPdf(false));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">

      {/* --- CART OVERLAY (DRAWER) --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end no-print">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            <div className="p-6 border-b flex justify-between items-center bg-gray-900 text-white">
              <div className="flex items-center space-x-3">
                <i className="fas fa-shopping-basket text-xl text-red-500"></i>
                <h2 className="text-2xl font-serif uppercase tracking-widest">Mon Panier</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-red-500 transition-colors p-2">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <i className="fas fa-shopping-basket text-6xl mb-4 opacity-20"></i>
                  <p>Votre panier est vide</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center border-b pb-4">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-tighter">
                        {item.size === 'quarter' ? '1/4' : item.size === 'half' ? '1/2' : item.size === 'full' ? 'Entière' : 'Spécialité'}
                      </p>
                      <p className="text-red-600 font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="text-gray-500 hover:text-red-600 p-1"><i className="fas fa-minus-circle"></i></button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="text-gray-500 hover:text-green-600 p-1"><i className="fas fa-plus-circle"></i></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-100 space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                  <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">
                    <i className="far fa-clock mr-2 text-red-600"></i> Heure de retrait :
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all font-black text-2xl text-center"
                    style={{ colorScheme: 'light' }}
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-2xl font-black mb-4 px-2 text-gray-900">
                  <span>TOTAL</span>
                  <span className="text-red-600">{formatPrice(cartTotal)}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={sendWhatsAppOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center space-x-3 transform active:scale-95"
                  >
                    <i className="fab fa-whatsapp text-2xl"></i>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={sendSmsOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center space-x-3 transform active:scale-95"
                  >
                    <i className="fas fa-comment-dots text-2xl"></i>
                    <span>SMS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header / Hero */}
      <header className="relative min-h-[75vh] py-12 flex items-center justify-center overflow-hidden no-print">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
            alt="Pizza"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl">
          <h1 className="text-4xl md:text-8xl font-serif mb-4 tracking-tighter">Pizza Walter et Flo</h1>
          <p className="text-xl md:text-2xl font-light tracking-widest uppercase mb-6">L'Artisanat à chaque part</p>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl mb-12 inline-block">
            <p className="text-lg md:text-xl font-bold uppercase tracking-wider mb-1">
              <i className="far fa-clock mr-2 text-red-500"></i> 10h15 à 13h30
            </p>
            <p className="text-sm md:text-base font-medium opacity-90">
              Lundi au Vendredi <span className="mx-2">•</span> Période Scolaire
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
            <p className="text-white font-bold uppercase tracking-widest mb-4">Commandez dès maintenant</p>
            <div className="flex flex-col space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center shadow-lg text-sm"
                >
                  <i className="fab fa-whatsapp mr-2 text-xl"></i>
                  WhatsApp
                </a>
                <a
                  href={`sms:${SMS_PHONE}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center shadow-lg text-sm"
                >
                  <i className="fas fa-comment-dots mr-2 text-xl"></i>
                  SMS
                </a>
              </div>
              <div className="text-sm text-gray-300 italic">Ou via votre panier ci-dessous</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrap for PDF */}
      <div id="menu-content" className="bg-gray-50">
        <main id="menu" className="flex-grow py-16 px-4 max-w-7xl mx-auto w-full">

          <div className="hidden block-print mb-12 text-center pt-8">
            <h1 className="text-4xl font-serif text-gray-900 uppercase">Pizza Walter et Flo</h1>
            <p className="text-gray-600 uppercase tracking-widest text-sm">Menu Artisanal</p>
            <div className="mt-4 text-red-600 font-bold text-xl">
              <a href={`tel:${SMS_PHONE}`} className="hover:underline">{CONTACT_PHONE}</a>
            </div>
          </div>

          {/* Pizza Section */}
          <section className="mb-24">
            <SectionTitle title="Nos Pizzas" subtitle="Choisissez votre taille idéale" />

            <div className="flex justify-center mb-12 no-print">
              <div className="bg-white p-1 rounded-xl shadow-md border flex space-x-1">
                {(['quarter', 'half', 'full'] as PizzaSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${selectedSize === size ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {size === 'quarter' ? '1/4' : size === 'half' ? '1/2' : 'Entière'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PIZZAS.map((pizza) => (
                <div key={pizza.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between border-t-4 border-red-600 break-inside-avoid group relative">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{pizza.name}</h3>
                      {pizza.isCreamBase && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">Base Crème</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{pizza.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 w-full">
                    <span className="text-3xl font-black text-red-700">
                      {(pizza.prices as any)[selectedSize]}
                    </span>
                    <button
                      onClick={() => addToCart(pizza, selectedSize)}
                      className="bg-red-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all no-print transform hover:rotate-90"
                      title="Ajouter ao panier"
                    >
                      <i className="fas fa-plus text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Specialties Section */}
          <section className="mb-24 break-before-page">
            <SectionTitle title="Nos Spécialités" />
            <div className="max-w-4xl mx-auto space-y-8">
              {SPECIALTIES.map((item) => (
                <div key={item.id} className="bg-gray-800 text-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl break-inside-avoid">
                  <div className="md:w-1/3 min-h-[250px]">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop"}
                      alt={item.name}
                      className="h-full w-full object-cover opacity-90 transition-transform hover:scale-105 duration-700"
                    />
                  </div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif mb-2 uppercase tracking-wide">{item.name}</h3>
                    <p className="text-gray-400 mb-6 italic leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="text-3xl font-black text-red-500">{item.price}</div>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center space-x-3 hover:bg-red-700 transition-all no-print transform hover:scale-105 active:scale-95"
                      >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Commander</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Deals Section */}
          <section className="mb-24 break-inside-avoid">
            <div className="bg-red-600 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fas fa-graduation-cap text-9xl"></i></div>
              <h2 className="text-5xl font-serif mb-6 uppercase tracking-tight">{STUDENT_MENU.name}</h2>
              <p className="text-xl mb-8 font-light italic opacity-90">L'offre incontournable pour les étudiants</p>
              <ul className="text-lg space-y-3 mb-10 max-w-md mx-auto border-y border-red-400 border-opacity-30 py-8">
                {STUDENT_MENU.includes.map((incl, idx) => (
                  <li key={idx} className="flex items-center justify-center"><i className="fas fa-check-circle mr-3 text-red-200"></i> {incl}</li>
                ))}
              </ul>
              <div className="text-6xl font-black mb-10">{STUDENT_MENU.price}</div>
              <button
                onClick={() => addToCart(STUDENT_MENU)}
                className="bg-white text-red-600 px-12 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-gray-100 transition-all no-print transform hover:scale-105 active:scale-95 flex items-center space-x-3 mx-auto"
              >
                <i className="fas fa-shopping-cart text-2xl"></i>
                <span>Ajouter au Panier</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 no-print pb-32 md:pb-16 border-t-8 border-red-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif mb-6 text-red-500 uppercase tracking-widest">Pizza Walter et Flo</h3>
            <p className="text-gray-400 leading-relaxed font-light">Le goût authentique d'une pizza artisanale cuite avec passion.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 flex items-center justify-center md:justify-start">
              <i className="far fa-clock mr-3 text-red-500"></i> Horaires
            </h4>
            <div className="space-y-2 text-gray-400">
              <p>Lundi - Vendredi (Période Scolaire) :</p>
              <p className="font-bold text-white uppercase">10h15 - 13h30</p>
              <p>Week-end & Vacances : Fermé</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-6 flex items-center justify-center md:justify-start">
              <i className="fas fa-phone-alt mr-3 text-red-500"></i> Contact
            </h4>
            <div className="text-3xl font-black text-red-500 hover:text-red-400 transition-colors">
              <a href={`tel:${SMS_PHONE}`}>{CONTACT_PHONE}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING ACTIONS --- */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col space-y-4 no-print">
        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-red-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-white overflow-visible"
          title="Mon Panier"
        >
          <i className="fas fa-shopping-basket text-2xl"></i>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 w-8 h-8 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-red-600 animate-bounce text-sm">
              {cartCount}
            </span>
          )}
        </button>

        {/* Floating WhatsApp Contact Button */}
        <a
          href={`sms:${SMS_PHONE}`}
          className="bg-blue-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 border-white"
          title="Contactez-nous par SMS"
        >
          <i className="fas fa-comment-dots text-2xl"></i>
        </a>
        <a
          href={WHATSAPP_BASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group border-4 border-white"
          title="Contactez-nous sur WhatsApp"
        >
          <i className="fab fa-whatsapp text-3xl"></i>
        </a>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media print {
          .no-print { display: none !important; }
          .block-print { display: block !important; }
        }
        .block-print { display: none; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        /* Corrige visibilidade do input de hora em alguns navegadores */
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0);
        }
      `}</style>
    </div>
  );
};

export default App;
