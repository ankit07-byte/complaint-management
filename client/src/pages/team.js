import React from 'react';

const teamMembers = [
  {
    name: 'Ankit Kumar Pandey',
    role: 'Full stack Developer',
    github: 'https://github.com/ankit07-byte',
    linkedin: 'https://www.linkedin.com/in/ankitpandey07/',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Suraj Kumar',
    role: 'Full stack Developer',
    github: 'https://github.com/Suraj7170',
    linkedin: 'https://www.linkedin.com/in/suraj-kumar-688b75263/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Vineet Singh',
    role: 'Full stack Developer',
    github: 'https://github.com/Vineet-s-ingh',
    linkedin: 'https://www.linkedin.com/in/vineet-singh-98a471273?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Dayanand Mishra',
    role: 'Full stack Designer',
    github: 'https://github.com/amitverma',
    linkedin: 'https://linkedin.com/in/amitverma',
    avatar: 'https://i.pravatar.cc/150?img=3',
  }
];

const Team = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-3 sm:py-8 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center transition hover:shadow-lg"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full mb-3 sm:mb-4"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{member.role}</p>
            <div className="mt-2 sm:mt-3 flex justify-center space-x-3 sm:space-x-4">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black text-xs sm:text-sm"
              >
                GitHub
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs sm:text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;