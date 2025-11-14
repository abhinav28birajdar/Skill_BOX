export const skillCategoriesData = [
  {
    id: '1',
    name: 'Programming',
    description: 'Learn to code in various languages and frameworks',
    icon: 'code',
    color: '#007AFF',
    popular: true,
    featured: true,
    skills: [
      { id: 'p1', name: 'JavaScript', icon: 'language-javascript', level: 'beginner' },
      { id: 'p2', name: 'Python', icon: 'language-python', level: 'beginner' },
      { id: 'p3', name: 'React', icon: 'react', level: 'intermediate' },
      { id: 'p4', name: 'TypeScript', icon: 'language-typescript', level: 'intermediate' },
      { id: 'p5', name: 'Machine Learning', icon: 'brain', level: 'advanced' }
    ]
  },
  {
    id: '2',
    name: 'Design',
    description: 'Master digital design tools and techniques',
    icon: 'palette',
    color: '#FF2D55',
    popular: true,
    featured: true,
    skills: [
      { id: 'd1', name: 'UI/UX Design', icon: 'vector-arrange-above', level: 'intermediate' },
      { id: 'd2', name: 'Figma', icon: 'figma', level: 'beginner' },
      { id: 'd3', name: 'Adobe Photoshop', icon: 'adobe', level: 'intermediate' },
      { id: 'd4', name: 'Illustration', icon: 'pen', level: 'beginner' },
      { id: 'd5', name: '3D Modeling', icon: 'cube-outline', level: 'advanced' }
    ]
  },
  {
    id: '3',
    name: 'Business',
    description: 'Develop business and entrepreneurial skills',
    icon: 'briefcase',
    color: '#5856D6',
    popular: true,
    featured: false,
    skills: [
      { id: 'b1', name: 'Marketing', icon: 'chart-bar', level: 'beginner' },
      { id: 'b2', name: 'Finance', icon: 'cash', level: 'intermediate' },
      { id: 'b3', name: 'Project Management', icon: 'clipboard-check-outline', level: 'intermediate' },
      { id: 'b4', name: 'Entrepreneurship', icon: 'rocket-launch', level: 'advanced' },
      { id: 'b5', name: 'Public Speaking', icon: 'microphone', level: 'beginner' }
    ]
  },
  {
    id: '4',
    name: 'Digital Marketing',
    description: 'Learn effective online marketing strategies',
    icon: 'bullhorn',
    color: '#FF9500',
    popular: false,
    featured: true,
    skills: [
      { id: 'm1', name: 'SEO', icon: 'magnify', level: 'intermediate' },
      { id: 'm2', name: 'Social Media', icon: 'instagram', level: 'beginner' },
      { id: 'm3', name: 'Content Creation', icon: 'file-document-edit', level: 'intermediate' },
      { id: 'm4', name: 'Google Analytics', icon: 'google', level: 'intermediate' },
      { id: 'm5', name: 'Email Marketing', icon: 'email', level: 'beginner' }
    ]
  },
  {
    id: '5',
    name: 'Photography',
    description: 'Capture stunning photos with any camera',
    icon: 'camera',
    color: '#4CD964',
    popular: true,
    featured: false,
    skills: [
      { id: 'ph1', name: 'Portrait Photography', icon: 'account', level: 'intermediate' },
      { id: 'ph2', name: 'Landscape Photography', icon: 'image', level: 'beginner' },
      { id: 'ph3', name: 'Lighting Techniques', icon: 'lightbulb', level: 'intermediate' },
      { id: 'ph4', name: 'Photo Editing', icon: 'image-edit', level: 'intermediate' },
      { id: 'ph5', name: 'Mobile Photography', icon: 'cellphone', level: 'beginner' }
    ]
  },
  {
    id: '6',
    name: 'Language Learning',
    description: 'Learn a new language efficiently',
    icon: 'translate',
    color: '#34AADC',
    popular: false,
    featured: true,
    skills: [
      { id: 'l1', name: 'Spanish', icon: 'alpha-s-box', level: 'beginner' },
      { id: 'l2', name: 'Japanese', icon: 'alpha-j-box', level: 'intermediate' },
      { id: 'l3', name: 'French', icon: 'alpha-f-box', level: 'beginner' },
      { id: 'l4', name: 'Mandarin', icon: 'alpha-m-box', level: 'advanced' },
      { id: 'l5', name: 'German', icon: 'alpha-g-box', level: 'intermediate' }
    ]
  }
];

export const seedSkillCategories = () => {
  // This would normally store the data in a database
  console.log('Seed data loaded');
  return skillCategoriesData;
};

export default skillCategoriesData;