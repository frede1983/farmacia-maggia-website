// Team members data with stock images from Unsplash
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  roleDE: string;
  roleFR: string;
  description: string;
  descriptionDE: string;
  descriptionFR: string;
  image: string;
  languages: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Isabella Sollberger',
    role: 'Farmacista Diplomata - Titolare',
    roleDE: 'Diplomierte Apothekerin - Inhaberin',
    roleFR: 'Pharmacienne Diplômée - Propriétaire',
    description: 'Farmacista diplomata con oltre 20 anni di esperienza. Specializzata in consulenza farmaceutica e fitoterapia.',
    descriptionDE: 'Diplomierte Apothekerin mit über 20 Jahren Erfahrung. Spezialisiert auf pharmazeutische Beratung und Phytotherapie.',
    descriptionFR: 'Pharmacienne diplômée avec plus de 20 ans d\'expérience. Spécialisée en conseil pharmaceutique et phytothérapie.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
    languages: ['IT', 'DE', 'FR']
  },
  {
    id: 2,
    name: 'Marco Beretta',
    role: 'Farmacista Collaboratore',
    roleDE: 'Apotheker Mitarbeiter',
    roleFR: 'Pharmacien Collaborateur',
    description: 'Farmacista specializzato in dermocosmesi e consulenza per sportivi. Appassionato di prodotti naturali.',
    descriptionDE: 'Apotheker spezialisiert auf Dermokosmetik und Sportlerberatung. Begeistert von Naturprodukten.',
    descriptionFR: 'Pharmacien spécialisé en dermocosmétique et conseil sportif. Passionné par les produits naturels.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
    languages: ['IT', 'DE', 'EN']
  },
  {
    id: 3,
    name: 'Sofia Mancini',
    role: 'Farmacista Assistente',
    roleDE: 'Apotheker-Assistentin',
    roleFR: 'Assistante Pharmacienne',
    description: 'Giovane farmacista con focus su pediatria e gestione terapie croniche. Sempre disponibile per consigli personalizzati.',
    descriptionDE: 'Junge Apothekerin mit Schwerpunkt Pädiatrie und Verwaltung chronischer Therapien. Immer bereit für persönliche Beratung.',
    descriptionFR: 'Jeune pharmacienne spécialisée en pédiatrie et gestion des thérapies chroniques. Toujours disponible pour des conseils personnalisés.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces',
    languages: ['IT', 'FR', 'EN']
  },
  {
    id: 4,
    name: 'Laura Fontana',
    role: 'Assistente di Farmacia',
    roleDE: 'Pharma-Assistentin',
    roleFR: 'Assistante en Pharmacie',
    description: 'Assistente esperta con 15 anni di esperienza. Si occupa di consulenza dermocosmesi e gestione ordini.',
    descriptionDE: 'Erfahrene Assistentin mit 15 Jahren Erfahrung. Zuständig für Dermokosmetik-Beratung und Bestellverwaltung.',
    descriptionFR: 'Assistante expérimentée avec 15 ans d\'expérience. Responsable des conseils en dermocosmétique et gestion des commandes.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
    languages: ['IT', 'DE']
  }
];

export const pharmacyInfo = {
  owner: 'Isabella Sollberger',
  title: 'Farmacia Maggia',
  subtitle: 'prop. Isabella Sollberger farm. dipl',
  address: {
    street: '',
    postalCode: 'CH-6673',
    city: 'Maggia',
    region: 'Ticino',
    country: 'Svizzera'
  },
  contact: {
    phone: '091 753 22 62',
    fax: '091 753 26 48',
    email: 'info@farmaciamaggia.ch',
    whatsapp: '+41917532262' // Same as phone
  },
  hours: {
    weekdays: {
      days: 'lunedì - venerdì',
      morning: '08:00 - 12:00',
      afternoon: '14:00 - 18:30'
    },
    saturday: {
      days: 'sabato',
      morning: '08:00 - 12:00',
      afternoon: '14:00 - 17:00'
    },
    sunday: {
      closed: true
    }
  },
  coordinates: {
    lat: 46.245653,
    lng: 8.705699
  }
};
