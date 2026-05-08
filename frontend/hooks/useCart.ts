'use client';

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
  name?: string
  price?: number | string
  image?: string
  customSize?: {
    chest: string | number
    waist: string | number
    shoulder: string | number
    sleeveLength: string | number
    length: string | number
    fit: string
    notes: string
    unit: string
  }
}

export interface CartData {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: CartData }>(
    '/api/cart',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const cartData = data?.data || {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  }

  const addToCart = useCallback(
    async (productId: string, quantity: number, size: string, color: string, name?: string, price?: number, image?: string, customSize?: any) => {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'add',
            item: {
              productId,
              quantity,
              size,
              color,
              name: name || 'Product',
              price: price || 0, // Keep as number
              image: image || '',
              customSize
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to add to cart')
        }

        const result = await response.json()
        mutate({ success: true, data: result.data })
        return result
      } catch (error) {
        console.error('[Hook] Add to cart error:', error)
        throw error
      }
    },
    [mutate]
  )

  const removeFromCart = useCallback(
    async (productId: string, size: string, color: string) => {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'remove',
            productId,
            size,
            color,
          }),
        })

        if (!response.ok) throw new Error('Failed to remove from cart')

        const result = await response.json()
        mutate({ success: true, data: result.data })
        return result
      } catch (error) {
        console.error('[Hook] Remove from cart error:', error)
        throw error
      }
    },
    [mutate]
  )

  const updateQuantity = useCallback(
    async (productId: string, size: string, color: string, quantity: number) => {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            productId,
            size,
            color,
            quantity,
          }),
        })

        if (!response.ok) throw new Error('Failed to update cart')

        const result = await response.json()
        mutate({ success: true, data: result.data })
        return result
      } catch (error) {
        console.error('[Hook] Update quantity error:', error)
        throw error
      }
    },
    [mutate]
  )

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clear',
        }),
      })

      if (!response.ok) throw new Error('Failed to clear cart')

      const result = await response.json()
      mutate({ success: true, data: result.data })
      return result
    } catch (error) {
      console.error('[Hook] Clear cart error:', error)
      throw error
    }
  }, [mutate])

  return {
    cart: cartData,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
