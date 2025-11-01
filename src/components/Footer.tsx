import { useTranslation } from 'react-i18next';
import { pharmacyInfo } from '../data/teamData';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">{t('home.title')}</h3>
            <p className="text-gray-300 mb-2">{t('home.owner')}</p>
            <p className="text-gray-300">{t('home.subtitle')}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-400">{t('common.contact')}</h4>
            <div className="text-gray-300 space-y-2">
              <p>{t('footer.address')}</p>
              <p>
                <a href={`tel:${pharmacyInfo.contact.phone}`} className="hover:text-green-400 transition">
                  📞 {t('footer.phone')}
                </a>
              </p>
              <p>
                <a href={`mailto:${pharmacyInfo.contact.email}`} className="hover:text-green-400 transition">
                  ✉️ {t('footer.email')}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${pharmacyInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition"
                >
                  💬 WhatsApp
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-green-400">{t('hours.title')}</h4>
            <div className="text-gray-300 space-y-3">
              <div>
                <p className="font-semibold text-white">{t('hours.weekdays')}</p>
                <p className="text-sm">08:00-12:00 / 14:00-18:30</p>
              </div>
              <div>
                <p className="font-semibold text-white">{t('hours.saturday')}</p>
                <p className="text-sm">08:00-12:00 / 14:00-17:00</p>
              </div>
              <div>
                <p className="font-semibold text-white">{t('hours.sunday')}</p>
                <p className="text-sm">{t('hours.closed')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {t('home.title')} - {t('home.owner')}. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
