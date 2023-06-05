function findMaxMatching(graph, leftVertexCount, rightVertexCount) {
  const vertexCount = leftVertexCount + rightVertexCount + 2;
  const residualGraph = new Array(vertexCount).fill(0).map(() => new Array(vertexCount).fill(0));
  const matching = new Array(leftVertexCount).fill(-1);

  function bfs(graph, source, target, parent) {
    const visited = new Array(vertexCount).fill(false);
    const queue = [];
    queue.push(source);
    visited[source] = true;
    parent[source] = -1;

    while (queue.length !== 0) {
      const u = queue.shift();

      for (let v = 0; v < vertexCount; v++) {
        if (!visited[v] && graph[u][v] > 0) {
          queue.push(v);
          parent[v] = u;
          visited[v] = true;
        }
      }
    }

    return visited[target];
  }

  function findMaxMatchingUtil(graph, source, target, parent) {
    while (bfs(graph, source, target, parent)) {
      for (let v = target; v !== source; v = parent[v]) {
        const u = parent[v];
        matching[u] = v;
        matching[v] = u;
      }
    }
  }

  const hasEdges = graph.some(row => row.slice(1, vertexCount - 1).some(val => val === 1));

  if (!hasEdges) {
    return []; // Возвращаем пустой массив, если нет ребер
  }


  for (let u = 1; u <= leftVertexCount; u++) {
    for (let v = leftVertexCount + 1; v <= leftVertexCount + rightVertexCount; v++) {
      if (graph[u][v] === 1) {
        residualGraph[u][v] = 1;
      }
    }
  }


  
  findMaxMatchingUtil(residualGraph, 0, vertexCount - 1, matching);
  
  return matching;
}



module.exports = {
  findMaxMatching,
};
