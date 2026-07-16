const isValidCodespaceName = (value) => {
  if (!value) return false
  const normalized = value.trim()
  return normalized !== '' && normalized !== 'your-codespace-name'
}

export function getBackendBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  if (isValidCodespaceName(codespaceName)) {
    return `https://${codespaceName.trim()}-8000.app.github.dev`
  }

  return import.meta.env.VITE_API_BASE_URL?.trim() || ''
}

export function buildApiUrl(resource) {
  const baseUrl = getBackendBaseUrl()
  return `${baseUrl ? `${baseUrl}` : ''}/api/${resource}/`
}

export function extractItems(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  if (Array.isArray(payload.items)) {
    return payload.items
  }

  if (Array.isArray(payload.results)) {
    return payload.results
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.records)) {
    return payload.records
  }

  return []
}
