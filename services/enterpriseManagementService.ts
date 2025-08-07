import { supabase } from '../lib/supabase';

export interface EnterpriseAccount {
  id: string;
  company_name: string;
  domain: string;
  logo_url?: string;
  industry: string;
  company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  billing_contact: string;
  technical_contact: string;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  subscription_tier: 'basic' | 'professional' | 'enterprise' | 'custom';
  max_users: number;
  current_users: number;
  features: string[];
  custom_branding: boolean;
  sso_enabled: boolean;
  api_access: boolean;
  created_at: string;
  trial_ends_at?: string;
}

export interface EnterpriseUser {
  id: string;
  enterprise_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'instructor' | 'learner' | 'viewer';
  department?: string;
  employee_id?: string;
  manager_id?: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'pending_invitation';
  last_login?: string;
  created_at: string;
}

export interface LearningPath {
  id: string;
  enterprise_id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in hours
  courses: string[]; // course IDs
  prerequisites: string[];
  completion_criteria: {
    min_score: number;
    required_courses: string[];
    optional_courses: string[];
  };
  assigned_roles: string[];
  assigned_departments: string[];
  mandatory: boolean;
  deadline?: string;
  created_by: string;
  created_at: string;
}

export interface ComplianceTraining {
  id: string;
  enterprise_id: string;
  title: string;
  description: string;
  content_url: string;
  training_type: 'safety' | 'security' | 'hr' | 'legal' | 'industry_specific';
  mandatory: boolean;
  frequency: 'one_time' | 'annual' | 'quarterly' | 'monthly';
  next_due_date: string;
  assigned_users: string[];
  completion_tracking: boolean;
  certificate_required: boolean;
  created_at: string;
}

export interface Analytics {
  learning_progress: {
    total_users: number;
    active_learners: number;
    courses_completed: number;
    average_completion_rate: number;
    time_spent_learning: number;
  };
  skill_development: {
    top_skills: Array<{ skill: string; learners_count: number }>;
    skill_gaps: Array<{ skill: string; gap_score: number }>;
    emerging_skills: string[];
  };
  engagement_metrics: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    session_duration_avg: number;
    content_interaction_rate: number;
  };
  business_impact: {
    productivity_improvement: number;
    training_cost_savings: number;
    employee_satisfaction: number;
    knowledge_retention_rate: number;
  };
}

export class EnterpriseManagementService {
  // Enterprise Account Management
  static async createEnterpriseAccount(
    accountData: Omit<EnterpriseAccount, 'id' | 'current_users' | 'created_at'>
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_accounts')
        .insert({
          ...accountData,
          current_users: 0,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;

      // Set up default learning paths and compliance training
      await this.setupDefaultEnterpriseContent(data.id);

      return data.id;
    } catch (error) {
      console.error('Error creating enterprise account:', error);
      return null;
    }
  }

  static async getEnterpriseAccount(enterpriseId: string): Promise<EnterpriseAccount | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_accounts')
        .select('*')
        .eq('id', enterpriseId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting enterprise account:', error);
      return null;
    }
  }

  static async updateEnterpriseAccount(
    enterpriseId: string,
    updates: Partial<EnterpriseAccount>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_accounts')
        .update(updates)
        .eq('id', enterpriseId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating enterprise account:', error);
      return false;
    }
  }

  // User Management
  static async inviteEnterpriseUser(
    enterpriseId: string,
    userInfo: {
      email: string;
      full_name: string;
      role: EnterpriseUser['role'];
      department?: string;
      employee_id?: string;
      manager_id?: string;
    }
  ): Promise<boolean> {
    try {
      // Check if enterprise has available user slots
      const enterprise = await this.getEnterpriseAccount(enterpriseId);
      if (!enterprise || enterprise.current_users >= enterprise.max_users) {
        throw new Error('User limit exceeded for this enterprise account');
      }

      // Create user invitation
      const { error } = await supabase
        .from('enterprise_users')
        .insert({
          enterprise_id: enterpriseId,
          email: userInfo.email,
          full_name: userInfo.full_name,
          role: userInfo.role,
          department: userInfo.department,
          employee_id: userInfo.employee_id,
          manager_id: userInfo.manager_id,
          permissions: this.getDefaultPermissions(userInfo.role),
          status: 'pending_invitation',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Send invitation email
      await this.sendInvitationEmail(enterpriseId, userInfo.email, userInfo.full_name);

      return true;
    } catch (error) {
      console.error('Error inviting enterprise user:', error);
      return false;
    }
  }

  static async getEnterpriseUsers(
    enterpriseId: string,
    filters?: {
      role?: string;
      department?: string;
      status?: string;
    }
  ): Promise<EnterpriseUser[]> {
    try {
      let query = supabase
        .from('enterprise_users')
        .select('*')
        .eq('enterprise_id', enterpriseId);

      if (filters?.role) query = query.eq('role', filters.role);
      if (filters?.department) query = query.eq('department', filters.department);
      if (filters?.status) query = query.eq('status', filters.status);

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting enterprise users:', error);
      return [];
    }
  }

  static async updateEnterpriseUser(
    userId: string,
    updates: Partial<EnterpriseUser>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating enterprise user:', error);
      return false;
    }
  }

  static async deactivateEnterpriseUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_users')
        .update({ status: 'inactive' })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating enterprise user:', error);
      return false;
    }
  }

  // Learning Path Management
  static async createLearningPath(
    learningPath: Omit<LearningPath, 'id' | 'created_at'>
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_learning_paths')
        .insert({
          ...learningPath,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;

      // Assign to users based on roles and departments
      await this.assignLearningPath(data.id, learningPath.enterprise_id);

      return data.id;
    } catch (error) {
      console.error('Error creating learning path:', error);
      return null;
    }
  }

  static async getLearningPaths(
    enterpriseId: string,
    userId?: string
  ): Promise<LearningPath[]> {
    try {
      let query = supabase
        .from('enterprise_learning_paths')
        .select('*')
        .eq('enterprise_id', enterpriseId);

      if (userId) {
        // Get learning paths assigned to specific user
        const { data: userAssignments } = await supabase
          .from('learning_path_assignments')
          .select('learning_path_id')
          .eq('user_id', userId);

        if (userAssignments && userAssignments.length > 0) {
          const pathIds = userAssignments.map(a => a.learning_path_id);
          query = query.in('id', pathIds);
        } else {
          return [];
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting learning paths:', error);
      return [];
    }
  }

  static async assignLearningPath(
    learningPathId: string,
    enterpriseId: string
  ): Promise<boolean> {
    try {
      // Get learning path details
      const { data: learningPath, error: pathError } = await supabase
        .from('enterprise_learning_paths')
        .select('*')
        .eq('id', learningPathId)
        .single();

      if (pathError) throw pathError;

      // Get eligible users
      let query = supabase
        .from('enterprise_users')
        .select('id, role, department')
        .eq('enterprise_id', enterpriseId)
        .eq('status', 'active');

      if (learningPath.assigned_roles.length > 0) {
        query = query.in('role', learningPath.assigned_roles);
      }

      if (learningPath.assigned_departments.length > 0) {
        query = query.in('department', learningPath.assigned_departments);
      }

      const { data: eligibleUsers, error: usersError } = await query;

      if (usersError) throw usersError;

      // Create assignments
      const assignments = eligibleUsers.map(user => ({
        learning_path_id: learningPathId,
        user_id: user.id,
        assigned_at: new Date().toISOString(),
        deadline: learningPath.deadline,
        mandatory: learningPath.mandatory,
        status: 'assigned',
      }));

      const { error: assignmentError } = await supabase
        .from('learning_path_assignments')
        .insert(assignments);

      if (assignmentError) throw assignmentError;

      return true;
    } catch (error) {
      console.error('Error assigning learning path:', error);
      return false;
    }
  }

  // Compliance Training
  static async createComplianceTraining(
    training: Omit<ComplianceTraining, 'id' | 'created_at'>
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('enterprise_compliance_training')
        .insert({
          ...training,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;

      // Assign to users
      await this.assignComplianceTraining(data.id, training.assigned_users);

      return data.id;
    } catch (error) {
      console.error('Error creating compliance training:', error);
      return null;
    }
  }

  static async assignComplianceTraining(
    trainingId: string,
    userIds: string[]
  ): Promise<boolean> {
    try {
      const assignments = userIds.map(userId => ({
        training_id: trainingId,
        user_id: userId,
        assigned_at: new Date().toISOString(),
        status: 'assigned',
      }));

      const { error } = await supabase
        .from('compliance_training_assignments')
        .insert(assignments);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error assigning compliance training:', error);
      return false;
    }
  }

  static async getComplianceTrainings(
    enterpriseId: string,
    userId?: string
  ): Promise<ComplianceTraining[]> {
    try {
      let query = supabase
        .from('enterprise_compliance_training')
        .select('*')
        .eq('enterprise_id', enterpriseId);

      if (userId) {
        query = query.contains('assigned_users', [userId]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting compliance trainings:', error);
      return [];
    }
  }

  // Analytics and Reporting
  static async getEnterpriseAnalytics(
    enterpriseId: string,
    timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<Analytics> {
    try {
      const { data, error } = await supabase.functions.invoke('enterprise-analytics', {
        body: {
          enterprise_id: enterpriseId,
          time_range: timeRange,
        },
      });

      if (error) throw error;

      return data.analytics || {
        learning_progress: {
          total_users: 0,
          active_learners: 0,
          courses_completed: 0,
          average_completion_rate: 0,
          time_spent_learning: 0,
        },
        skill_development: {
          top_skills: [],
          skill_gaps: [],
          emerging_skills: [],
        },
        engagement_metrics: {
          daily_active_users: 0,
          weekly_active_users: 0,
          monthly_active_users: 0,
          session_duration_avg: 0,
          content_interaction_rate: 0,
        },
        business_impact: {
          productivity_improvement: 0,
          training_cost_savings: 0,
          employee_satisfaction: 0,
          knowledge_retention_rate: 0,
        },
      };
    } catch (error) {
      console.error('Error getting enterprise analytics:', error);
      return {
        learning_progress: {
          total_users: 0,
          active_learners: 0,
          courses_completed: 0,
          average_completion_rate: 0,
          time_spent_learning: 0,
        },
        skill_development: {
          top_skills: [],
          skill_gaps: [],
          emerging_skills: [],
        },
        engagement_metrics: {
          daily_active_users: 0,
          weekly_active_users: 0,
          monthly_active_users: 0,
          session_duration_avg: 0,
          content_interaction_rate: 0,
        },
        business_impact: {
          productivity_improvement: 0,
          training_cost_savings: 0,
          employee_satisfaction: 0,
          knowledge_retention_rate: 0,
        },
      };
    }
  }

  static async generateComplianceReport(
    enterpriseId: string,
    trainingType?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('compliance-report-generator', {
        body: {
          enterprise_id: enterpriseId,
          training_type: trainingType,
        },
      });

      if (error) throw error;
      return data.report;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      return null;
    }
  }

  static async exportLearningData(
    enterpriseId: string,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('learning-data-exporter', {
        body: {
          enterprise_id: enterpriseId,
          format,
        },
      });

      if (error) throw error;
      return data.download_url;
    } catch (error) {
      console.error('Error exporting learning data:', error);
      return null;
    }
  }

  // Skills Management
  static async getSkillsGapAnalysis(
    enterpriseId: string,
    departmentId?: string
  ): Promise<{
    critical_gaps: Array<{ skill: string; gap_score: number; affected_users: number }>;
    improvement_recommendations: string[];
    suggested_training: Array<{ skill: string; course_suggestions: string[] }>;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('skills-gap-analyzer', {
        body: {
          enterprise_id: enterpriseId,
          department_id: departmentId,
        },
      });

      if (error) throw error;
      return data.analysis || {
        critical_gaps: [],
        improvement_recommendations: [],
        suggested_training: [],
      };
    } catch (error) {
      console.error('Error getting skills gap analysis:', error);
      return {
        critical_gaps: [],
        improvement_recommendations: [],
        suggested_training: [],
      };
    }
  }

  // Single Sign-On (SSO)
  static async configureSSOProvider(
    enterpriseId: string,
    ssoConfig: {
      provider: 'saml' | 'oauth2' | 'ldap';
      metadata_url?: string;
      client_id?: string;
      client_secret?: string;
      domain?: string;
      attributes_mapping: Record<string, string>;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('enterprise_sso_config')
        .upsert({
          enterprise_id: enterpriseId,
          ...ssoConfig,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update enterprise account to enable SSO
      await this.updateEnterpriseAccount(enterpriseId, { sso_enabled: true });

      return true;
    } catch (error) {
      console.error('Error configuring SSO provider:', error);
      return false;
    }
  }

  // API Access Management
  static async generateAPIKey(
    enterpriseId: string,
    permissions: string[],
    expiresAt?: Date
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-api-key', {
        body: {
          enterprise_id: enterpriseId,
          permissions,
          expires_at: expiresAt?.toISOString(),
        },
      });

      if (error) throw error;
      return data.api_key;
    } catch (error) {
      console.error('Error generating API key:', error);
      return null;
    }
  }

  // Helper Methods
  private static async setupDefaultEnterpriseContent(enterpriseId: string): Promise<void> {
    try {
      // Create default compliance trainings
      const defaultTrainings = [
        {
          enterprise_id: enterpriseId,
          title: 'Data Privacy and Security',
          description: 'Essential training on data protection and cybersecurity best practices',
          content_url: '/default-content/data-privacy',
          training_type: 'security' as const,
          mandatory: true,
          frequency: 'annual' as const,
          next_due_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_users: [],
          completion_tracking: true,
          certificate_required: true,
        },
        {
          enterprise_id: enterpriseId,
          title: 'Workplace Safety',
          description: 'Fundamental workplace safety procedures and emergency protocols',
          content_url: '/default-content/workplace-safety',
          training_type: 'safety' as const,
          mandatory: true,
          frequency: 'annual' as const,
          next_due_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_users: [],
          completion_tracking: true,
          certificate_required: true,
        },
      ];

      await supabase
        .from('enterprise_compliance_training')
        .insert(defaultTrainings);

    } catch (error) {
      console.error('Error setting up default enterprise content:', error);
    }
  }

  private static getDefaultPermissions(role: EnterpriseUser['role']): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['all'],
      manager: ['view_analytics', 'manage_users', 'assign_training'],
      instructor: ['create_content', 'grade_assignments', 'manage_classroom'],
      learner: ['access_content', 'submit_assignments', 'join_classroom'],
      viewer: ['view_content', 'view_reports'],
    };

    return permissions[role] || ['access_content'];
  }

  private static async sendInvitationEmail(
    enterpriseId: string,
    email: string,
    fullName: string
  ): Promise<void> {
    try {
      await supabase.functions.invoke('send-enterprise-invitation', {
        body: {
          enterprise_id: enterpriseId,
          email,
          full_name: fullName,
        },
      });
    } catch (error) {
      console.error('Error sending invitation email:', error);
    }
  }
}
