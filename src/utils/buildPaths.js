import fromGraphString from 'falcor-graph-syntax';
import FalcorPathSyntax from 'falcor-path-syntax';

export default function buildPaths(query, props) {
  if (typeof query === 'function') return buildPaths(query(props));

  if (typeof query === 'string') {
    try {
      return fromGraphString(query);
    } catch (error) {
      return [FalcorPathSyntax.fromPath(query)];
    }
  }

  if (Array.isArray(query)) {
    let pathSets = query;

    if (!Array.isArray(pathSets[0])) {
      pathSets = [pathSets];
    }

    let isPath = false;
    pathSets = pathSets.map((pathSet) => (
      pathSet.map((path) => {
        if (typeof path !== 'string') return path;

        const arrayPath = FalcorPathSyntax.fromPath(path);
        if (arrayPath[0] === path) return path;

        isPath = true;
        return arrayPath;
      })
    ));

    if (isPath) {
      return pathSets[0];
    }

    return pathSets;
  }

  return null;
}
