// ===================================================================
// CORE SERVICE - AUTHENTICATION SERVICE
// ===================================================================

import { supabase } from '../lib/supabase';
import { AuthResponse, UserOnboardingData, UserProfile, UserRole } from '../types/auth';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  agreedToTerms: boolean;
  marketingConsent?: boolean;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  skills?: string[];
  interests?: string[];
  profileImageUrl?: string;
  bannerImageUrl?: string;
}

// ===================================================================
// AUTHENTICATION SERVICE CLASS
// ===================================================================

export class AuthService {
  // --- ENHANCED SCREENS STUBS ---
  static async getCurrentUser() { return { success: true, data: null }; }
  static async getUserProfile(_userId: string) { return { success: true, data: null }; }
  static async updateProfile(_editData: any) { return { success: true }; }
  
  // ===================================================================
  // SIGN UP
  // ===================================================================
  
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            agreed_to_terms: data.agreedToTerms,
            marketing_consent: data.marketingConsent || false,
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: {
            code: authError.message,
            message: authError.message,
          },
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: {
            code: 'USER_CREATION_FAILED',
            message: 'Failed to create user account',
          },
        };
      }

      // Step 2: Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: `${data.firstName} ${data.lastName}`,
          role: data.role,
          is_verified: false,
          is_active: true,
          agreed_to_terms: data.agreedToTerms,
          marketing_consent: data.marketingConsent || false,
          onboarding_completed: false,
          email_notifications: true,
          push_notifications: true,
          marketing_notifications: data.marketingConsent || false,
        });

      if (profileError) {
        // Cleanup: delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        return {
          success: false,
          error: {
            code: 'PROFILE_CREATION_FAILED',
            message: 'Failed to create user profile',
          },
        };
      }

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session,
          needsEmailVerification: !authData.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // SIGN IN
  // ===================================================================
  
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: {
            code: authError.message,
            message: authError.message,
          },
        };
      }

      if (!authData.user || !authData.session) {
        return {
          success: false,
          error: {
            code: 'SIGNIN_FAILED',
            message: 'Invalid credentials',
          },
        };
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authData.user.id);

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNIN_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // SIGN OUT
  // ===================================================================
  
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            code: error.message,
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: {},
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SIGNOUT_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // RESET PASSWORD
  // ===================================================================
  
  static async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: 'skillbox://reset-password',
      });

      if (error) {
        return {
          success: false,
          error: {
            code: error.message,
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: {
          message: 'Password reset email sent',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // UPDATE PASSWORD
  // ===================================================================
  
  static async updatePassword(data: UpdatePasswordData): Promise<AuthResponse> {
    try {
      // First verify current password by attempting to sign in
      const { data: currentSession } = await supabase.auth.getSession();
      if (!currentSession.session?.user?.email) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User not authenticated',
          },
        };
      }

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: currentSession.session.user.email,
        password: data.currentPassword,
      });

      if (verifyError) {
        return {
          success: false,
          error: {
            code: 'INVALID_CURRENT_PASSWORD',
            message: 'Current password is incorrect',
          },
        };
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        return {
          success: false,
          error: {
            code: error.message,
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: {
          message: 'Password updated successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_PASSWORD_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // GET CURRENT USER PROFILE
  // ===================================================================
  
  static async getCurrentUserProfile(): Promise<{ success: boolean; data?: UserProfile; error?: any }> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User not authenticated',
          },
        };
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          skills:user_skills(
            id,
            skill:skills(*)
          ),
          teaching_skills:user_skills!user_skills_user_id_fkey(
            id,
            skill:skills(*)
          ),
          followers:user_follows!user_follows_following_id_fkey(count),
          following:user_follows!user_follows_follower_id_fkey(count)
        `)
        .eq('id', sessionData.session.user.id)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            code: 'PROFILE_FETCH_ERROR',
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: profile as UserProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_PROFILE_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // UPDATE USER PROFILE
  // ===================================================================
  
  static async updateUserProfile(data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User not authenticated',
          },
        };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionData.session.user.id);

      if (error) {
        return {
          success: false,
          error: {
            code: 'PROFILE_UPDATE_ERROR',
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: {
          message: 'Profile updated successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_PROFILE_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // COMPLETE ONBOARDING
  // ===================================================================
  
  static async completeOnboarding(data: UserOnboardingData): Promise<AuthResponse> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User not authenticated',
          },
        };
      }

      const userId = sessionData.session.user.id;

      // Update profile with onboarding data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          bio: data.bio,
          location: data.location,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) {
        return {
          success: false,
          error: {
            code: 'PROFILE_UPDATE_ERROR',
            message: profileError.message,
          },
        };
      }

      // Add user skills
      if (data.skills && data.skills.length > 0) {
        const skillInserts = data.skills.map(skillId => ({
          user_id: userId,
          skill_id: skillId,
          proficiency_level: 'beginner' as const,
          is_teaching: false,
        }));

        const { error: skillsError } = await supabase
          .from('user_skills')
          .insert(skillInserts);

        if (skillsError) {
          console.warn('Failed to add user skills:', skillsError.message);
        }
      }

      // Add teaching skills
      if (data.teachingSkills && data.teachingSkills.length > 0) {
        const teachingSkillInserts = data.teachingSkills.map(skillId => ({
          user_id: userId,
          skill_id: skillId,
          proficiency_level: 'intermediate' as const,
          is_teaching: true,
        }));

        const { error: teachingSkillsError } = await supabase
          .from('user_skills')
          .insert(teachingSkillInserts);

        if (teachingSkillsError) {
          console.warn('Failed to add teaching skills:', teachingSkillsError.message);
        }
      }

      return {
        success: true,
        data: {
          message: 'Onboarding completed successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ONBOARDING_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // VERIFY EMAIL
  // ===================================================================
  
  static async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        return {
          success: false,
          error: {
            code: error.message,
            message: error.message,
          },
        };
      }

      // Update profile verification status
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({
            is_verified: true,
            email_verified_at: new Date().toISOString(),
          })
          .eq('id', data.user.id);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EMAIL_VERIFICATION_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // RESEND VERIFICATION EMAIL
  // ===================================================================
  
  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return {
          success: false,
          error: {
            code: error.message,
            message: error.message,
          },
        };
      }

      return {
        success: true,
        data: {
          message: 'Verification email sent',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RESEND_EMAIL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }

  // ===================================================================
  // DELETE ACCOUNT
  // ===================================================================
  
  static async deleteAccount(): Promise<AuthResponse> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User not authenticated',
          },
        };
      }

      // Soft delete: Mark account as deleted
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', sessionData.session.user.id);

      if (error) {
        return {
          success: false,
          error: {
            code: 'DELETE_ACCOUNT_ERROR',
            message: error.message,
          },
        };
      }

      // Sign out user
      await this.signOut();

      return {
        success: true,
        data: {
          message: 'Account deleted successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ACCOUNT_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  }
}

export default AuthService;
