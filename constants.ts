
import { PizzaItem, SpecialtyItem, MenuItem } from './types';

export const PIZZAS: PizzaItem[] = [
  {
    id: 'fromage',
    name: 'Fromage',
    description: 'Sauce tomate artisanale, mélange de fromages fondants.',
    prices: { quarter: '2.00 €', half: '4.00 €', full: '8.00 €' }
  },
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    description: 'Base tomate, mozzarella de qualité supérieure, herbes de Provence.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'jambon-fromage',
    name: 'Jambon / Fromage',
    description: 'Classique indémodable : Jambon blanc supérieur et fromage fondant.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'chevre-fromage',
    name: 'Chèvre / Fromage',
    description: 'L’onctuosité du fromage de chèvre alliée à notre base tomate.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'jambon-mozzarella',
    name: 'Jambon / Mozzarella',
    description: 'Duo savoureux de jambon blanc et mozzarella fondante.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'royale',
    name: 'Royale',
    description: 'Jambon, fromage et champignons frais sur base tomate.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'armenienne',
    name: 'Arménienne',
    description: 'Spécialité aux saveurs épicées et généreuses.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'pistou',
    name: 'Pistou',
    description: 'L’Italie à votre table : basilic frais, ail et huile d’olive.',
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'champignons-creme',
    name: 'Champignons / Crème Fraîche',
    description: 'Base crème onctueuse, champignons frais de Paris.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'lardon',
    name: 'La Lardon',
    description: 'Base crème fraîche, lardons et fromage.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'savoyarde',
    name: 'Savoyarde',
    description: 'Base crème fraîche, lardons, reblochon et fromage.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'chevre-miel',
    name: 'Chèvre / Miel Crème Fraîche',
    description: 'L’équilibre parfait sucré-salé sur une base crème.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'kebab-poulet',
    name: 'Kebab ou Poulet Curry Crème',
    description: 'Viande kebab ou poulet au curry délicatement épicé.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: '4-fromages',
    name: '4 Fromages Crème Fraîche',
    description: 'Un festival de saveurs pour les amateurs de fromage.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  },
  {
    id: 'thon-creme',
    name: 'Thon Crème Fraîche',
    description: 'Thon émietté de qualité sur base crème onctueuse.',
    isCreamBase: true,
    prices: { quarter: '2.50 €', half: '4.80 €', full: '9.50 €' }
  }
];

export const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'panuozzo',
    name: 'Panuozzo (Poulet Crispy ou Bagnat)',
    price: '4.90 €',
    description: 'Sandwich italien traditionnel. Choix entre Poulet Crispy ou Bagnat.',
    image: '/Panuozzo.jpg'
  },
  {
    id: 'chausson',
    name: 'Chausson',
    price: '4.90 €',
    description: 'Le chausson selon les goûts affichés.',
    image: '/Panuozzo.jpg'
  }
];

export const STUDENT_MENU: MenuItem = {
  id: 'menu-etudiant',
  name: 'MENU ÉTUDIANT',
  includes: ['1/2 Pizza au choix', '1 Boisson (33cl)', '1 Dessert'],
  price: '6.90 €'
};

export const CONTACT_PHONE = '06 99 58 96 53';
