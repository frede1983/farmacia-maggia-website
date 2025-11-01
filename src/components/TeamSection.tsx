import { useTranslation } from 'react-i18next';
import { teamMembers } from '../data/teamData';

const TeamSection = () => {
  const { t, i18n } = useTranslation();

  const getRole = (member: typeof teamMembers[0]) => {
    switch (i18n.language) {
      case 'de':
        return member.roleDE;
      case 'fr':
        return member.roleFR;
      default:
        return member.role;
    }
  };

  const getDescription = (member: typeof teamMembers[0]) => {
    switch (i18n.language) {
      case 'de':
        return member.descriptionDE;
      case 'fr':
        return member.descriptionFR;
      default:
        return member.description;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('team.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden bg-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 font-semibold mb-3">
                  {getRole(member)}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {getDescription(member)}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {member.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
