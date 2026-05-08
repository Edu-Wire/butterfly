'use server'

import { createContactSubmission, createOrder, getCart, clearCart, calculateCartTotal, getShippingCost, calculateTax } from '@/lib/db'
import { sendEmail } from '@/lib/mail'

export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const submission = await createContactSubmission({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    })

    // Send notification email to admin
    await sendEmail({
      to: "aishubamoriya@gmail.com",
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
          <h3>New Inquiry from ${formData.name}</h3>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message}</p>
      `,
      text: `New Inquiry from ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
    });

    // Send confirmation email to user
    await sendEmail({
      to: formData.email,
      subject: `We've received your message - Butterfly Couture`,
      html: `
          <h3>Hello ${formData.name},</h3>
          <p>Thank you for reaching out to Butterfly Couture.</p>
          <p>We've received your inquiry regarding "<strong>${formData.subject}</strong>" and our team will get back to you within 24 hours.</p>
          <br/>
          <p>Best Regards,</p>
          <p>Team Butterfly</p>
      `,
      text: `Hello ${formData.name},\n\nThank you for reaching out to Butterfly Couture. We've received your inquiry regarding "${formData.subject}" and our team will get back to you within 24 hours.\n\nBest Regards,\nTeam Butterfly`,
    });

    return {
      success: true,
      data: submission,
      message: 'Thank you for contacting us! We will get back to you soon.',
    }
  } catch (error) {
    console.error('[SA] Contact form error:', error)
    return {
      success: false,
      error: 'Failed to submit contact form',
    }
  }
}

export async function submitCheckoutForm(formData: {
  firstName: string
  lastName: string
  email: string
  phone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  sameAsShipping: boolean
  cartItems: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}) {
  try {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.shippingAddress) {
      return {
        success: false,
        error: 'Please fill in all required fields',
      }
    }

    // Prepare billing address
    const billingAddress = formData.sameAsShipping
      ? {
        address: formData.shippingAddress,
        city: formData.shippingCity,
        state: formData.shippingState,
        zipCode: formData.shippingZip,
        country: formData.shippingCountry,
      }
      : {
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        zipCode: formData.billingZip,
        country: formData.billingCountry,
      }

    // Create order
    const order = await createOrder({
      items: formData.cartItems,
      total: formData.total,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        address: formData.shippingAddress,
        city: formData.shippingCity,
        state: formData.shippingState,
        zipCode: formData.shippingZip,
        country: formData.shippingCountry,
      },
      billing: billingAddress,
      status: 'processing',
    })

    return {
      success: true,
      data: order,
      message: `Order created successfully! Your order ID is ${order.id}. A confirmation email has been sent.`,
    }
  } catch (error) {
    console.error('[SA] Checkout form error:', error)
    return {
      success: false,
      error: 'Failed to process your order. Please try again.',
    }
  }
}

export async function subscribeToNewsletter(email: string) {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      }
    }

    // In a real app, this would save to a newsletter database
    // For now, we'll create a contact submission
    await createContactSubmission({
      name: 'Newsletter Subscriber',
      email,
      subject: 'Newsletter Signup',
      message: 'User subscribed to newsletter',
    })

    return {
      success: true,
      message: 'Thank you for subscribing! Check your email for updates.',
    }
  } catch (error) {
    console.error('[SA] Newsletter error:', error)
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    }
  }
}
