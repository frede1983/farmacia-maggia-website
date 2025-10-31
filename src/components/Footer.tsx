import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">{t('home.title')}</h3>
            <p className="text-gray-300">{t('home.subtitle')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('common.contact')}</h4>
            <p className="text-gray-300">{t('footer.address')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('common.services')}</h4>
            <ul className="text-gray-300 space-y-2">
              <li>Farmacia</li>
              <li>Consulenza</li>
              <li>Prodotti naturali</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Farmacia Maggia. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
