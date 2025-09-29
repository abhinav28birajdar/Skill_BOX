import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];

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
        amount: course.price,
        currency: course.currency,
        payment_method: paymentMethod,
        status: 'pending'
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // For demo purposes, simulate payment processing
      // In production, integrate with actual payment processors
      const paymentIntent: PaymentIntent = {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
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
      const paymentData: PaymentInsert = {
        user_id: user.id,
        subscription_type: plan.type,
        amount: plan.price,
        currency: 'USD',
        payment_method: paymentMethod,
        status: 'pending'
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) throw paymentError;

      const paymentIntent: PaymentIntent = {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'pending',
        subscription_type: plan.type
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
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          payment_intent_id: paymentIntentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Handle course purchase
      if (payment.course_id) {
        const enrollmentData = {
          student_id: user.id,
          course_id: payment.course_id,
          payment_id: paymentId,
          status: 'active' as const,
          enrolled_at: new Date().toISOString()
        };

        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert(enrollmentData);

        if (enrollmentError) throw enrollmentError;

        // Update course enrollment count
        await supabase.rpc('increment_course_enrollment', {
          course_id: payment.course_id
        });
      }

      // Handle subscription purchase
      if (payment.subscription_type && payment.subscription_type !== 'course') {
        const plan = this.subscriptionPlans.find(p => p.type === payment.subscription_type);
        if (plan) {
          const expiresAt = new Date();
          if (plan.duration === 'monthly') {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          }

          const { error: userUpdateError } = await supabase
            .from('users')
            .update({
              subscription_tier: payment.subscription_type,
              subscription_expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (userUpdateError) throw userUpdateError;
        }
      }

      return true;
    } catch (error) {
      console.error('Error confirming payment:', error);
      // Mark payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentId);
      
      throw error;
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

      return data;
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

      if (payment.status !== 'completed') {
        throw new Error('Can only refund completed payments');
      }

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          refund_amount: payment.amount,
          refunded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      // Handle course refund
      if (payment.course_id) {
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .update({
            status: 'refunded',
            access_expires_at: new Date().toISOString()
          })
          .eq('payment_id', paymentId);

        if (enrollmentError) throw enrollmentError;
      }

      // Handle subscription refund
      if (payment.subscription_type && payment.subscription_type !== 'course') {
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            subscription_expires_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (userUpdateError) throw userUpdateError;
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

      if (course?.is_free) return true;

      // Check if user has active enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('status, access_expires_at')
        .eq('student_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single();

      if (!enrollment) return false;

      // Check if access hasn't expired
      if (enrollment.access_expires_at) {
        return new Date(enrollment.access_expires_at) > new Date();
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
          user:users(full_name, email),
          course:courses(title)
        `)
        .eq('id', paymentId)
        .single();

      if (error) throw error;

      // Generate invoice data (in production, use a proper invoice generation service)
      const invoice = {
        id: payment.id,
        date: payment.created_at,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        customer: {
          name: payment.user?.full_name,
          email: payment.user?.email
        },
        items: [{
          description: payment.course?.title || `${payment.subscription_type} subscription`,
          amount: payment.amount
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