import { supabase, dbUpdate, dbInsert, dbRpc } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];
type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert'];
type EnrollmentUpdate = Database['public']['Tables']['enrollments']['Update'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  course_id?: string;
  subscription_type?: 'course' | 'premium' | 'pro';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'premium' | 'pro';
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  description: string;
}



class PaymentService {
  private stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  // Subscription plans
  private subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      type: 'free',
      price: 0,
      duration: 'monthly',
      features: [
        'Access to free courses',
        'Basic community features',
        'Limited AI tutoring',
        'Basic progress tracking'
      ],
      description: 'Get started with basic learning features'
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      type: 'premium',
      price: 29.99,
      duration: 'monthly',
      features: [
        'Access to all premium courses',
        'Unlimited AI tutoring',
        'Advanced analytics',
        'Priority support',
        'Download for offline viewing',
        'Certificate of completion'
      ],
      description: 'Perfect for serious learners'
    },
    {
      id: 'premium_yearly',
      name: 'Premium (Yearly)',
      type: 'premium',
      price: 299.99,
      duration: 'yearly',
      features: [
        'Everything in Premium Monthly',
        '2 months free',
        'Exclusive yearly content',
        'Early access to new features'
      ],
      description: 'Best value for committed learners'
    },
    {
      id: 'pro_monthly',
      name: 'Pro',
      type: 'pro',
      price: 59.99,
      duration: 'monthly',
      features: [
        'Everything in Premium',
        'Create and sell courses',
        'Advanced instructor tools',
        'Revenue analytics',
        'Custom branding',
        'API access'
      ],
      description: 'For instructors and content creators'
    },
    {
      id: 'pro_yearly',
      name: 'Pro (Yearly)',
      type: 'pro',
      price: 599.99,
      duration: 'yearly',
      features: [
        'Everything in Pro Monthly',
        '2 months free',
        'Priority course review',
        'Advanced marketing tools'
      ],
      description: 'Ultimate package for professional educators'
    }
  ];

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlans;
  }

  async getCurrentSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        tier: (data as any).subscription_tier || 'free',
        expires_at: (data as any).subscription_expires_at,
        is_active: (data as any).subscription_expires_at ? new Date((data as any).subscription_expires_at) > new Date() : true
      };
    } catch (error) {
      console.error('Error getting current subscription:', error);
      return {
        tier: 'free',
        expires_at: null,
        is_active: true
      };
    }
  }

  async purchaseCourse(courseId: string, paymentMethod: 'stripe' | 'paypal' | 'razorpay' | 'google_pay' | 'apple_pay'): Promise<PaymentIntent> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title, price, currency')
        .eq('id', courseId)
        .single();

      if (courseError || !course) throw new Error('Course not found');
      const courseData = course as any;

      // Check if user already owns the course
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single();

      if (existingEnrollment) {
        throw new Error('You already own this course');
      }

      // Create payment record
      const paymentData: PaymentInsert = {
        user_id: user.id,
        course_id: courseId,
        subscription_type: 'course',
        amount: courseData.price,
        currency: courseData.currency,
        payment_method: paymentMethod,
        status: 'pending'
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData as any)
        .select()
        .single();

      if (paymentError) throw paymentError;
      const paymentData_result = payment as any;

      // For demo purposes, simulate payment processing
      // In production, integrate with actual payment processors
      const paymentIntent: PaymentIntent = {
        id: paymentData_result.id,
        amount: paymentData_result.amount,
        currency: paymentData_result.currency,
        status: 'pending',
        course_id: courseId,
        subscription_type: 'course'
      };

      return paymentIntent;
    } catch (error) {
      console.error('Error purchasing course:', error);
      throw error;
    }
  }

  async purchaseSubscription(planId: string, paymentMethod: 'stripe' | 'paypal' | 'razorpay' | 'google_pay' | 'apple_pay'): Promise<PaymentIntent> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const plan = this.subscriptionPlans.find(p => p.id === planId);
      if (!plan) throw new Error('Subscription plan not found');

      // Create payment record
      const subscriptionType = plan.type === 'free' ? 'premium' : plan.type; // Map 'free' to 'premium'
      const paymentData: PaymentInsert = {
        user_id: user.id,
        subscription_type: subscriptionType as 'premium' | 'pro',
        amount: plan.price,
        currency: 'USD',
        payment_method: paymentMethod,
        status: 'pending'
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData as any)
        .select()
        .single();

      if (paymentError) throw paymentError;
      const paymentDataResult = payment as any;

      const paymentIntent: PaymentIntent = {
        id: paymentDataResult.id,
        amount: paymentDataResult.amount,
        currency: paymentDataResult.currency,
        status: 'pending',
        subscription_type: subscriptionType as 'premium' | 'pro'
      };

      return paymentIntent;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      throw error;
    }
  }

  async confirmPayment(paymentId: string, paymentIntentId?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update payment status
      // Update payment status
      const [payment] = await dbUpdate('payments', 
        {
          status: 'completed',
          payment_intent_id: paymentIntentId,
          updated_at: new Date().toISOString(),
        },
        {
          id: paymentId,
          user_id: user.id
        }
      );
      const paymentResult = payment as any;

      // Handle course purchase
      if (paymentResult.course_id) {
        try {
          await dbInsert('enrollments', {
            student_id: user.id,
            course_id: paymentResult.course_id,
            payment_id: paymentId,
            status: 'active',
            enrolled_at: new Date().toISOString()
          });
        } catch (error) {
          throw error;
        }

        // Error handling is done in try/catch

        // Update course enrollment count
        await dbRpc('increment_course_enrollment', {
          p_course_id: paymentResult.course_id
        });
      }

      // Handle subscription purchase
      if (paymentResult.subscription_type && paymentResult.subscription_type !== 'course') {
        const plan = this.subscriptionPlans.find(p => p.type === paymentResult.subscription_type);
        if (plan) {
          const expiresAt = new Date();
          if (plan.duration === 'monthly') {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          }

          try {
            await dbUpdate('user_profiles', {
              subscription_tier: paymentResult.subscription_type,
              subscription_expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString()
            }, { id: user.id });
          } catch (error) {
            throw error;
          }

          // Error handling is done in try/catch
        }
      }

      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      // Rollback payment status if something fails
      await dbUpdate('payments', { status: 'failed' }, { id: paymentId });
      return false;
    }
  }

  async getPaymentHistory(userId: string, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          course:courses(title, thumbnail_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return data as any[];
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string, reason?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .single();

      if (paymentError || !payment) throw new Error('Payment not found');
      const paymentResult = payment as any;

      if (paymentResult.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      // Update payment status
      try {
        await dbUpdate('payments', {
          status: 'refunded',
          refund_amount: paymentResult.amount,
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { id: paymentId });
      } catch (error) {
        throw error;
      }

      // Error is caught and thrown in the try/catch block

      // Handle course refund
      if (paymentResult.course_id) {
        try {
          await dbUpdate('enrollments', {
            status: 'refunded',
            access_expires_at: new Date().toISOString()
          }, { payment_id: paymentId });
        } catch (error) {
          throw error;
        }
      }

      // Handle subscription refund
      if (paymentResult.subscription_type && paymentResult.subscription_type !== 'course') {
        try {
          await dbUpdate('user_profiles', {
            subscription_tier: 'free',
            subscription_expires_at: null,
            updated_at: new Date().toISOString()
          }, { id: user.id });
        } catch (error) {
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
    try {
      // Check if course is free
      const { data: course } = await supabase
        .from('courses')
        .select('is_free')
        .eq('id', courseId)
        .single();
      
      const courseResult = course as any;

      if (courseResult?.is_free) return true;

      // Check if user has active enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('status, access_expires_at')
        .eq('student_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single();

      const enrollmentResult = enrollment as any;

      if (!enrollmentResult) return false;

      // Check if access hasn't expired
      if (enrollmentResult.access_expires_at) {
        return new Date(enrollmentResult.access_expires_at) > new Date();
      }

      return true;
    } catch (error) {
      console.error('Error checking course access:', error);
      return false;
    }
  }

  async checkSubscriptionAccess(userId: string, requiredTier: 'premium' | 'pro'): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      
      if (!subscription.is_active) return false;

      if (requiredTier === 'premium') {
        return subscription.tier === 'premium' || subscription.tier === 'pro';
      }

      if (requiredTier === 'pro') {
        return subscription.tier === 'pro';
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription access:', error);
      return false;
    }
  }

  async generateInvoice(paymentId: string) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select(`
          *,
          user:user_profiles(full_name, email),
          course:courses(title)
        `)
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      const paymentResult = payment as any;

      // Generate invoice data (in production, use a proper invoice generation service)
      const invoice = {
        id: paymentResult.id,
        date: paymentResult.created_at,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        status: paymentResult.status,
        customer: {
          name: paymentResult.user?.full_name,
          email: paymentResult.user?.email
        },
        items: [{
          description: paymentResult.course?.title || `${paymentResult.subscription_type} subscription`,
          amount: paymentResult.amount
        }]
      };

      return invoice;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
