// src/services/analyticsService.js
import { prisma } from '../lib/prisma.js'

export async function trackEvent(eventType, sessionId, data = {}) {
  try {
    await prisma.analytics.create({
      data: {
        sessionId,
        eventType,
        accommodationId: data.accommodationId ?? null,
        eventData: data,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      }
    })
  } catch (err) {
    console.error('Analytics tracking error:', err)
    // 실패는 앱 흐름에 영향 주지 않도록 swallow
  }
}