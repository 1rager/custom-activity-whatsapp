const path = require('path');
// Servir frontend build como estático
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
// Simulação de dados (substitua por integração Cogn2 depois)
const numeros = [
	{ id: 'num1', numero: '+5511999999999', nome: 'WhatsApp 1' },
	{ id: 'num2', numero: '+5511888888888', nome: 'WhatsApp 2' }
];

const templates = {
	num1: [
		{ id: 'tpl1', nome: 'Boas-vindas', texto: 'Olá {{nome}}, seja bem-vindo!' },
		{ id: 'tpl2', nome: 'Confirmação', texto: 'Sua reserva está confirmada para {{data}}.' }
	],
	num2: [
		{ id: 'tpl3', nome: 'Promoção', texto: 'Aproveite a oferta: {{oferta}}.' }
	]
};

// Endpoint para buscar números
app.get('/numeros', (req, res) => {
	res.json(numeros);
});

// Endpoint para buscar templates por número
app.get('/templates', (req, res) => {
	const numeroId = req.query.numero;
	res.json(templates[numeroId] || []);
});

// Endpoint para buscar detalhes do template
app.get('/template/:id', (req, res) => {
	const { id } = req.params;
	let found = null;
	Object.values(templates).forEach(arr => {
		arr.forEach(tpl => {
			if (tpl.id === id) found = tpl;
		});
	});
	if (!found) return res.status(404).json({ error: 'Template não encontrado' });
	// Extrai variáveis do texto
	const vars = [];
	const regex = /{{(.*?)}}/g;
	let match;
	while ((match = regex.exec(found.texto)) !== null) {
		vars.push(match[1]);
	}
	res.json({ ...found, variaveis: vars });
});
// Exemplo básico Node.js
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint: Execute
app.post('/execute', (req, res) => {
	// Recebe o payload da Custom Activity
	const {
		numero_disparador,
		template_id,
		variaveis,
		telefone_contato
	} = req.body;

	// Monta o body para a API Cogn2 (ajustar conforme especificação)
	const cogn2Payload = {
		numero: numero_disparador,
		template: template_id,
		params: variaveis,
		contato: telefone_contato
	};

	// Exemplo de chamada HTTP (substituir URL e método conforme Cogn2)
	// const axios = require('axios');
	// axios.post('https://api.cogn2.com/send', cogn2Payload)
	//   .then(response => res.json(response.data))
	//   .catch(error => res.status(500).json({ error: error.message }));

	// Por enquanto, apenas retorna o payload montado
	res.json({ enviado_para_cogn2: cogn2Payload });
});

// Endpoint: Save
app.post('/save', (req, res) => {
	res.json({ message: 'Save endpoint chamado!' });
});

// Endpoint: Publish
app.post('/publish', (req, res) => {
	res.json({ message: 'Publish endpoint chamado!' });
});

// Endpoint: Validate
app.post('/validate', (req, res) => {
	res.json({ message: 'Validate endpoint chamado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
