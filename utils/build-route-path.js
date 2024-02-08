export default function buildRoutePath(path) {
  const routeParamRegex = /:([a-zA-Z]+)/g
  const pathWithRegex = path.replaceAll(routeParamRegex, '(?<$1>[a-z0-9-_]+)')
  const pathRegex = new RegExp(`^${pathWithRegex}(?<query>\\?(.*))?$`)

  return pathRegex
}
