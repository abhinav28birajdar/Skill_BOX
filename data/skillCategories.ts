import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type SkillCategory = Database['public']['Tables']['skill_categories']['Insert'];

export const skillCategoriesData: SkillCategory[] = [
  // Design Categories
  {
    name: 'Photo Editing',
    category: 'design',
    description: 'Master photo editing with Photoshop, Lightroom, and mobile apps',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/1829/1829586.png'
  },
  {
    name: 'Video Editing',
    category: 'design',
    description: 'Learn video editing with Adobe Premiere, Final Cut Pro, DaVinci Resolve',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/1829/1829617.png'
  },
  {
    name: 'Graphic Design',
    category: 'design',
    description: 'Create stunning graphics with Adobe Illustrator, Figma, and Canva',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131659.png'
  },
  {
    name: 'UI/UX Design',
    category: 'design',
    description: 'Design beautiful user interfaces and experiences',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/4213/4213447.png'
  },
  {
    name: 'Digital Illustration',
    category: 'design',
    description: 'Create digital art and illustrations using professional tools',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131837.png'
  },
  {
    name: '3D Modeling & Animation',
    category: 'design',
    description: 'Learn 3D modeling with Blender, Maya, and Cinema 4D',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2991/2991143.png'
  },

  // Development Categories
  {
    name: 'Web Development',
    category: 'development',
    description: 'Build modern websites with HTML, CSS, JavaScript, and frameworks',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/1336/1336494.png'
  },
  {
    name: 'Mobile App Development',
    category: 'development',
    description: 'Create mobile apps for iOS and Android with React Native, Flutter',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2111/2111432.png'
  },
  {
    name: 'Python Programming',
    category: 'development',
    description: 'Learn Python for web development, data science, and automation',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3098/3098090.png'
  },
  {
    name: 'JavaScript & Node.js',
    category: 'development',
    description: 'Master JavaScript for frontend and backend development',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png'
  },
  {
    name: 'React & React Native',
    category: 'development',
    description: 'Build modern web and mobile apps with React ecosystem',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/1126/1126012.png'
  },
  {
    name: 'Data Science & AI',
    category: 'development',
    description: 'Learn machine learning, AI, and data analysis with Python',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2103/2103665.png'
  },
  {
    name: 'Game Development',
    category: 'development',
    description: 'Create games with Unity, Unreal Engine, and Godot',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'
  },
  {
    name: 'DevOps & Cloud',
    category: 'development',
    description: 'Learn AWS, Docker, Kubernetes, and deployment strategies',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
  },

  // Business Categories
  {
    name: 'Digital Marketing',
    category: 'marketing',
    description: 'Master SEO, social media marketing, and online advertising',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131636.png'
  },
  {
    name: 'Content Marketing',
    category: 'marketing',
    description: 'Create engaging content that drives traffic and conversions',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131715.png'
  },
  {
    name: 'Social Media Management',
    category: 'marketing',
    description: 'Build and manage successful social media presence',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131738.png'
  },
  {
    name: 'Email Marketing',
    category: 'marketing',
    description: 'Create effective email campaigns that convert',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131674.png'
  },

  // Business Management
  {
    name: 'Project Management',
    category: 'business',
    description: 'Learn Agile, Scrum, and project management methodologies',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131589.png'
  },
  {
    name: 'Leadership & Management',
    category: 'business',
    description: 'Develop leadership skills and team management techniques',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131601.png'
  },
  {
    name: 'Entrepreneurship',
    category: 'business',
    description: 'Start and grow your own business from idea to success',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131582.png'
  },
  {
    name: 'Finance & Accounting',
    category: 'business',
    description: 'Master financial planning, analysis, and accounting principles',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131643.png'
  },

  // Photography
  {
    name: 'Photography Basics',
    category: 'photography',
    description: 'Learn composition, lighting, and camera techniques',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131854.png'
  },
  {
    name: 'Portrait Photography',
    category: 'photography',
    description: 'Master the art of capturing beautiful portraits',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131855.png'
  },
  {
    name: 'Landscape Photography',
    category: 'photography',
    description: 'Capture stunning landscapes and nature photography',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131856.png'
  },

  // Music Categories
  {
    name: 'Music Production',
    category: 'music',
    description: 'Create beats and produce music with DAWs like Ableton, Logic Pro',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131771.png'
  },
  {
    name: 'Guitar Lessons',
    category: 'music',
    description: 'Learn acoustic and electric guitar from beginner to advanced',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131769.png'
  },
  {
    name: 'Piano & Keyboard',
    category: 'music',
    description: 'Master piano and keyboard techniques and theory',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131768.png'
  },
  {
    name: 'Vocal Training',
    category: 'music',
    description: 'Improve your singing voice and vocal techniques',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131770.png'
  },

  // Language Learning
  {
    name: 'English Language',
    category: 'language',
    description: 'Improve your English speaking, writing, and grammar skills',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131625.png'
  },
  {
    name: 'Spanish Language',
    category: 'language',
    description: 'Learn Spanish from beginner to conversational level',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131626.png'
  },
  {
    name: 'French Language',
    category: 'language',
    description: 'Master French language and culture',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131627.png'
  },
  {
    name: 'Japanese Language',
    category: 'language',
    description: 'Learn Japanese language, writing systems, and culture',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131628.png'
  },

  // Health & Fitness
  {
    name: 'Fitness Training',
    category: 'health',
    description: 'Learn proper exercise techniques and workout routines',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131706.png'
  },
  {
    name: 'Yoga & Meditation',
    category: 'health',
    description: 'Practice yoga poses and meditation techniques for wellness',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131707.png'
  },
  {
    name: 'Nutrition & Diet',
    category: 'health',
    description: 'Learn about healthy eating and meal planning',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131708.png'
  },
  {
    name: 'Mental Health',
    category: 'health',
    description: 'Understand mental wellness and stress management',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131709.png'
  },

  // Other Categories
  {
    name: 'Cooking & Culinary Arts',
    category: 'other',
    description: 'Learn cooking techniques and international cuisines',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131750.png'
  },
  {
    name: 'Personal Development',
    category: 'other',
    description: 'Build confidence, communication skills, and personal growth',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131600.png'
  },
  {
    name: 'Creative Writing',
    category: 'other',
    description: 'Develop your writing skills for fiction, non-fiction, and poetry',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131716.png'
  },
  {
    name: 'Home & Garden',
    category: 'other',
    description: 'Learn gardening, home improvement, and DIY projects',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/3131/3131751.png'
  }
];

export async function seedSkillCategories() {
  try {
    console.log('Seeding skill categories...');
    
    // Check if categories already exist
    const { data: existing } = await supabase
      .from('skill_categories')
      .select('name')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Skill categories already exist, skipping seed');
      return;
    }

    // Insert all categories
    const { data, error } = await supabase
      .from('skill_categories')
      .insert(skillCategoriesData)
      .select();

    if (error) {
      console.error('Error seeding skill categories:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} skill categories`);
    return data;
  } catch (error) {
    console.error('Failed to seed skill categories:', error);
    throw error;
  }
}

export default {
  skillCategoriesData,
  seedSkillCategories
};