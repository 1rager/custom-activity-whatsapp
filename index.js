require("dotenv").config();

// Endpoint para buscar números vinculados à conta business na Meta
app.get("/numeros-meta", async (req, res) => {
  const { business_account_id } = req.query;
  const access_token = process.env.META_ACCESS_TOKEN;
  if (!business_account_id || !access_token) {
    return res
      .status(400)
      .json({ error: "business_account_id e access_token são obrigatórios." });
  }
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${business_account_id}/phone_numbers`,
      { params: { access_token } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Endpoint para buscar templates vinculados a um número na Meta
app.get("/templates-meta/:phone_number_id", async (req, res) => {
  const { phone_number_id } = req.params;
  const access_token = process.env.META_ACCESS_TOKEN;
  if (!phone_number_id || !access_token) {
    return res
      .status(400)
      .json({ error: "phone_number_id e access_token são obrigatórios." });
  }
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${phone_number_id}/message_templates`,
      { params: { access_token } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});
const path = require("path");
// Servir frontend build como estático
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});
// Exemplo básico Node.js
const express = require("express");
const app = express();
app.use(express.json());

// Endpoint: Execute
const axios = require("axios");
app.post("/execute", async (req, res) => {
  try {
    // Recebe o payload da Custom Activity
    const {
      phone_number_id, // ID do número disparador
      to_number, // Telefone destino
      template_name, // Nome do template
      display_name, // Nome do cliente
      args, // Parâmetros adicionais (opcional)
      parameters, // Parâmetros do template (variáveis)
    } = req.body;

    // Monta o payload conforme esperado pela Cogn2
    const cogn2Payload = {
      phone_number_id,
      to_number,
      template_name,
      display_name,
      args: args || {},
      parameters: parameters || {},
    };

    // Chamada para a API Cogn2
    const response = await axios.post(
      "https://app2.hmg.cogni2.com/api/whatsapp/send-custom-message/",
      cogn2Payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // Retorna o resultado da Cogn2
    res.status(response.status).json(response.data);
  } catch (error) {
    // Retorna erro detalhado
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Endpoint: Save
app.post("/save", (req, res) => {
  res.json({ message: "Save endpoint chamado!" });
});

// Endpoint: Publish
app.post("/publish", (req, res) => {
  res.json({ message: "Publish endpoint chamado!" });
});

// Endpoint: Validate
app.post("/validate", (req, res) => {
  res.json({ message: "Validate endpoint chamado!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
