const defaultRoutes = [
  {
    url: 'http://github.com/.*',
    response: { status: 200, body: { title: 'Github' } }
  }
]

export default (routes = defaultRoutes) => {
  if (routes.constructor !== Array || !routes.length) throw new Error("Fetch faker: arguments should be Array and must have content")
  return (url, options) => {
    url = url.toLowerCase()
    return matchRoute({ url, options }, routes)
  }
}

const matchRoute = ({ url, options }, routes) => {
  for (let route of routes) {
    const _url = route.url
    const _response = route.response
    const matcher = new RegExp(_url, 'i')
    if (matcher.test(url)) {
      return Promise.resolve(buildResponse(_response))
    } else {
      return fetch(url, options)
    }
  }
}

const buildResponse = (options) => {
  const { body, headers, ...responseOptions } = options
  if (headers && headers.constructor === Object) {
    const _headers = new Headers()
    for (let h in headers) {
      _headers.append(h, headers[h])
    }
  }

  const _body = [Object, Array, Number, Boolean, String].includes(body.constructor) ?
    new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }) : body

  return new Response(_body, { headers, ...responseOptions })
}
