const path = require('path');
// Servir frontend build como estático
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
// Exemplo básico Node.js
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint: Execute
const axios = require('axios');
app.post('/execute', async (req, res) => {
	try {
		// Recebe o payload da Custom Activity
		const {
			phone_number_id,    // ID do número disparador
			to_number,          // Telefone destino
			template_name,      // Nome do template
			display_name,       // Nome do cliente
			args,               // Parâmetros adicionais (opcional)
			parameters          // Parâmetros do template (variáveis)
		} = req.body;

		// Monta o payload conforme esperado pela Cogn2
		const cogn2Payload = {
			phone_number_id,
			to_number,
			template_name,
			display_name,
			args: args || {},
			parameters: parameters || {}
		};

		// Chamada para a API Cogn2
		const response = await axios.post(
			'https://app2.hmg.cogni2.com/api/whatsapp/send-custom-message/',
			cogn2Payload,
			{ headers: { 'Content-Type': 'application/json' } }
		);

		// Retorna o resultado da Cogn2
		res.status(response.status).json(response.data);
	} catch (error) {
		// Retorna erro detalhado
		res.status(error.response?.status || 500).json({
			error: error.message,
			details: error.response?.data || null
		});
	}
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
