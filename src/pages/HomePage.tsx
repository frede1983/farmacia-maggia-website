import { useTranslation } from 'react-i18next';
import TeamSection from '../components/TeamSection';
import { pharmacyInfo } from '../data/teamData';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-green-600 font-semibold mb-4">
            {t('home.owner')}
          </p>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-gray-500 mb-8">
            {t('home.description')}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href={`tel:${pharmacyInfo.contact.phone}`}
              className="btn btn-primary"
            >
              📞 {t('contact.phone')}
            </a>
            <a
              href={`mailto:${pharmacyInfo.contact.email}`}
              className="btn bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
            >
              ✉️ {t('common.contact')}
            </a>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              {t('hours.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-green-600">
                  {t('hours.weekdays')}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">{t('hours.morning')}:</span> 08:00 - 12:00</p>
                  <p><span className="font-semibold">{t('hours.afternoon')}:</span> 14:00 - 18:30</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-green-600">
                  {t('hours.saturday')}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">{t('hours.morning')}:</span> 08:00 - 12:00</p>
                  <p><span className="font-semibold">{t('hours.afternoon')}:</span> 14:00 - 17:00</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 text-gray-600">
              <p className="font-semibold">{t('hours.sunday')}: {t('hours.closed')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{t('common.services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Farmacia</h3>
              <p className="text-gray-600 leading-relaxed">Servizi farmaceutici completi e professionali per tutte le tue esigenze di salute</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Consulenza</h3>
              <p className="text-gray-600 leading-relaxed">Consulenze personalizzate da farmacisti esperti per il tuo benessere</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Prodotti Naturali</h3>
              <p className="text-gray-600 leading-relaxed">Ampia selezione di rimedi naturali e prodotti biologici certificati</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`tel:${pharmacyInfo.contact.phone}`}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              📞 {pharmacyInfo.contact.phone}
            </a>
            <a
              href={`mailto:${pharmacyInfo.contact.email}`}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              ✉️ {pharmacyInfo.contact.email}
            </a>
            <a
              href={`https://wa.me/${pharmacyInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition inline-flex items-center gap-2"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
