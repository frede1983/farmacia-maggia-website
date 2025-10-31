import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('common.welcome')} - {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-gray-500 mb-8">
            {t('home.description')}
          </p>
          <button className="btn btn-primary">
            {t('home.cta')}
          </button>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-center mb-12">{t('common.services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-2">Farmacia</h3>
              <p className="text-gray-600">Servizi farmaceutici completi e professionali</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold mb-2">Consulenza</h3>
              <p className="text-gray-600">Consulenze personalizzate per la tua salute</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-2">Prodotti Naturali</h3>
              <p className="text-gray-600">Rimedi naturali e prodotti biologici</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
