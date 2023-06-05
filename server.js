const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { findMaxMatching } = require('./graph');


const app = express();
app.use(bodyParser.json());

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'client')));
app.get('/client/cytoscape.min.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile('client/cytoscape.min.js', { root: __dirname });
});

app.get('/graph', (req, res) => {
  const filePath = path.join(__dirname, 'client.html');
  res.sendFile(filePath);
});


// Маршрут для сохранения и анализа графа
app.post('/graph', (req, res) => {
  // Получаем данные о графе из тела запроса
  const graphData = req.body;

  // Получаем вершины и ребра графа
  const nodes = graphData.elements.nodes;
  const edges = graphData.elements.edges;

  const Matrix = getAdjacencyMatrix(nodes, edges);
  const left = getPartitionSizes(nodes, edges).leftSize;
  const right = getPartitionSizes(nodes, edges).rightSize;

  console.log('Матрица смежности:', Matrix);
  console.log('Количество вершин в левой доле:', left);
  console.log('Количество вершин в правой доле:', right);

  const matching = findMaxMatching(Matrix, left, right);
  const maxMatching = matching.length;

  res.json({maxMatching});
  
});

/////////////////////////////////////
	// матрица смежности
	function getAdjacencyMatrix(nodes, edges) {

			const numNodes = nodes.length;

			// Создание пустой матрицы смежности
  			const adjacencyMatrix = [];

			// Заполнение матрицы смежности нулями
			for (let i = 0; i < nodes.length; i++) {
				adjacencyMatrix[i] = [];
				for (let j = 0; j < nodes.length; j++) {
				adjacencyMatrix[i][j] = 0;
				}
			}

			if (edges != null) {
			// Заполнение матрицы смежности единицами для соответствующих ребер
			edges.forEach(edge => {
				const sourceIndex = nodes.findIndex(node => node.data.id === edge.data.source);
				const targetIndex = nodes.findIndex(node => node.data.id === edge.data.target);
				adjacencyMatrix[sourceIndex][targetIndex] = 1;
				adjacencyMatrix[targetIndex][sourceIndex] = 1;
			});}

			return adjacencyMatrix;
		}

	// правая и левая доли
	function getPartitionSizes(nodes, edges) {

		let leftCount = 0;
		let rightCount = 0;
		
		// Подсчет количества вершин в каждой доле
		nodes.forEach(node => {
			if (node.data.group === 'left') {
			leftCount++;
			} else if (node.data.group === 'right') {
			rightCount++;
			}
		});

		return {
			leftSize: leftCount,
			rightSize: rightCount,
		};
	}

/////////////////////////////////////////

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
