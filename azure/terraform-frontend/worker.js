addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Rewrite to Azure Storage endpoint
  url.hostname = 'resumefaza2026.z13.web.core.windows.net'

  // Create new request with modified Host header
  const modifiedRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  return fetch(modifiedRequest)
}
