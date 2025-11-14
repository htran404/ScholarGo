
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const teamMemberInfo = [
  { mssv: 'LEAD001', image: 'https://picsum.photos/seed/alex/400' },
  { mssv: 'UIX002', image: 'https://picsum.photos/seed/brenda/400' },
  { mssv: 'FE003', image: 'https://picsum.photos/seed/carlos/400' },
  { mssv: 'FE004', image: 'https://picsum.photos/seed/diana/400' },
  { mssv: 'QA005', image: 'https://picsum.photos/seed/ethan/400' },
];

const MemberCard: React.FC<{ member: (typeof teamMemberInfo[0] & { name: string; role: string; bio: string }) }> = ({ member }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 h-full">
    <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-300 dark:border-blue-600" />
    <h3 className="text-xl font-bold">{member.name}</h3>
    <p className="text-blue-500 dark:text-blue-400 font-semibold">{member.role}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">MSSV: {member.mssv}</p>
    <p className="text-slate-600 dark:text-slate-300 mt-4 text-sm">{member.bio}</p>
  </div>
);

const AboutPage: React.FC = () => {
  const { t } = useTranslations();
  const translatedTeamMembers = t('teamMembers') as { name: string, role: string, bio: string }[];
  
  const teamMembers = teamMemberInfo.map((member, index) => ({
    ...member,
    ...(translatedTeamMembers[index] || { name: '', role: '', bio: '' }),
  }));

  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">{t('aboutTitle')}</h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
          {t('aboutText')}
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-10">{t('meetTheTeam')}</h2>
        
        {/* First Row - 2 members */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {teamMembers.slice(0, 2).map(member => (
            <div key={member.mssv} className="w-full sm:w-2/5 lg:w-1/3">
                <MemberCard member={member} />
            </div>
          ))}
        </div>

        {/* Second Row - 3 members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.slice(2, 5).map(member => (
            <MemberCard key={member.mssv} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;