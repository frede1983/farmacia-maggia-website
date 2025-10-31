import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">
            {t('home.title')}
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              {t('common.home')}
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-green-600 transition">
              {t('common.services')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              {t('common.about')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">
              {t('common.contact')}
            </Link>

            <div className="flex gap-2 ml-4 border-l pl-4">
              <button
                onClick={() => changeLanguage('it')}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'it' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'de' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'fr' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
