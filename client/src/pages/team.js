import React from 'react';

const teamMembers = [
    {
    name: 'Ankit Kumar Pandey',
    role: 'Frontend Developer',
    github: 'https://github.com/surajkumar',
    linkedin: 'https://linkedin.com/in/surajkumar',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Suraj Kumar',
    role: 'Frontend Developer',
    github: 'https://github.com/surajkumar',
    linkedin: 'https://linkedin.com/in/surajkumar',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Vineet Singh',
    role: 'Backend Developer',
    github: 'https://github.com/riyasingh',
    linkedin: 'https://linkedin.com/in/riyasingh',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Dayanand Mishra',
    role: 'UI/UX Designer',
    github: 'https://github.com/amitverma',
    linkedin: 'https://linkedin.com/in/amitverma',
    avatar: 'https://i.pravatar.cc/150?img=3',
  }
];

const Team = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Meet the Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center transition hover:shadow-lg"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
            <div className="mt-3 flex justify-center space-x-4">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black"
              >
                GitHub
              </a>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
