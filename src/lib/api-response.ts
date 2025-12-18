/**
 * Standardized API response utilities
 */

export interface ApiResponse<T = any> {
  data: T | null
  error: ApiError | null
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Array<{ field: string; message: string }>
}

export interface ApiMeta {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  timestamp?: string
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  meta?: ApiMeta,
  status: number = 200
): Response {
  return Response.json(
    {
      data,
      error: null,
      meta,
    } as ApiResponse<T>,
    { status }
  )
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: Array<{ field: string; message: string }>
): Response {
  return Response.json(
    {
      data: null,
      error: {
        code,
        message,
        details,
      },
    } as ApiResponse,
    { status }
  )
}

/**
 * Create a validation error response from Zod errors
 */
export function validationErrorResponse(errors: any): Response {
  const details = errors.issues?.map((issue: any) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }))

  return errorResponse(
    'VALIDATION_ERROR',
    'Validation failed',
    400,
    details
  )
}

/**
 * Rate limit headers
 */
export function addRateLimitHeaders(
  response: Response,
  limit: number,
  remaining: number,
  resetAt: number
): Response {
  const headers = new Headers(response.headers)
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString())

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
