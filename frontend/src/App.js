

import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    maxWidth: 500,
    margin: '40px auto',
    fontFamily: 'Inter, Arial, sans-serif',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    padding: 32,
  },
  label: {
    fontWeight: 500,
    marginBottom: 6,
    display: 'block',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
    marginBottom: 12,
    background: '#f6f6f6',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16,
    marginBottom: 12,
    background: '#f6f6f6',
  },
  section: {
    marginBottom: 24,
  },
  templateBox: {
    padding: 16,
    border: '1px solid #e0e0e0',
    background: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  previewBox: {
    padding: 16,
    border: '1.5px dashed #4caf50',
    background: '#f6fff6',
    borderRadius: 8,
    marginBottom: 12,
    color: '#222',
  },
  title: {
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 24,
    color: '#1976d2',
    textAlign: 'center',
  },
  button: {
    padding: '10px 24px',
    borderRadius: 6,
    border: 'none',
    background: '#1976d2',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8,
  },
};

function App() {
  const [numeros, setNumeros] = useState([]);
  const [numeroSelecionado, setNumeroSelecionado] = useState('');
  const [templates, setTemplates] = useState([]);
  const [templateSelecionado, setTemplateSelecionado] = useState('');
  const [templateDetalhe, setTemplateDetalhe] = useState(null);
  const [variaveis, setVariaveis] = useState({});

  useEffect(() => {
    fetch('/numeros')
      .then(res => res.json())
      .then(setNumeros);
  }, []);

  useEffect(() => {
    if (numeroSelecionado) {
      fetch(`/templates?numero=${numeroSelecionado}`)
        .then(res => res.json())
        .then(setTemplates);
      setTemplateSelecionado('');
      setTemplateDetalhe(null);
      setVariaveis({});
    }
  }, [numeroSelecionado]);

  useEffect(() => {
    if (templateSelecionado) {
      fetch(`/template/${templateSelecionado}`)
        .then(res => res.json())
        .then(data => {
          setTemplateDetalhe(data);
          if (data.variaveis) {
            const vars = {};
            data.variaveis.forEach(v => { vars[v] = ''; });
            setVariaveis(vars);
          }
        });
    }
  }, [templateSelecionado]);

  const handleVarChange = (key, value) => {
    setVariaveis(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Configuração WhatsApp<br />Custom Activity</div>

      <div style={styles.section}>
        <label style={styles.label}>Número disparador:</label>
        <select style={styles.select} value={numeroSelecionado} onChange={e => setNumeroSelecionado(e.target.value)}>
          <option value="">Selecione...</option>
          {numeros.map(n => (
            <option key={n.id} value={n.id}>{n.nome} ({n.numero})</option>
          ))}
        </select>
      </div>

      {numeroSelecionado && (
        <div style={styles.section}>
          <label style={styles.label}>Template:</label>
          <select style={styles.select} value={templateSelecionado} onChange={e => setTemplateSelecionado(e.target.value)}>
            <option value="">Selecione...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
      )}

      {templateDetalhe && (
        <div style={styles.templateBox}>
          <strong>Mensagem do template:</strong>
          <div style={{ marginTop: 8, color: '#444' }}>
            {templateDetalhe.texto}
          </div>
        </div>
      )}

      {templateDetalhe && templateDetalhe.variaveis && templateDetalhe.variaveis.length > 0 && (
        <div style={styles.section}>
          <strong style={{ color: '#1976d2' }}>Preencha as variáveis:</strong>
          {templateDetalhe.variaveis.map(v => (
            <div key={v} style={{ marginTop: 8 }}>
              <label style={styles.label}>{v}:</label>
              <input
                type="text"
                style={styles.input}
                value={variaveis[v] || ''}
                onChange={e => handleVarChange(v, e.target.value)}
                placeholder={`Valor para ${v}`}
              />
            </div>
          ))}
        </div>
      )}

      {templateDetalhe && templateDetalhe.variaveis && templateDetalhe.variaveis.length > 0 && (
        <div style={styles.previewBox}>
          <strong>Preview da mensagem personalizada:</strong>
          <div style={{ marginTop: 8 }}>
            {templateDetalhe.texto.replace(/{{(.*?)}}/g, (_, v) => variaveis[v] || `{{${v}}}`)}
          </div>
        </div>
      )}

      {/* Botão de ação futuro */}
      {/* <button style={styles.button}>Salvar Configuração</button> */}
    </div>
  );
}

export default App;
