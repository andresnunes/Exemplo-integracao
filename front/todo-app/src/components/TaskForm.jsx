import { Plus } from 'lucide-react';
import { useState } from 'react';

export function TaskForm({ onSubmit, isLoading }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!titulo.trim()) return;

    // 1. Processamento das Tags: String -> Array
    // Exemplo: entrada "teste, dev" vira ["teste", "dev"]
    const tagsArray = tagsInput
      .split(',')                 // Divide onde tem vírgula
      .map(tag => tag.trim())     // Remove espaços em branco extras
      .filter(tag => tag !== ''); // Remove itens vazios

    // 2. Montagem do Objeto (Payload) conforme solicitado
    const newTask = {
      titulo: titulo,
      descricao: descricao,
      tags: tagsArray 
    };

    // (Opcional) Console log para você conferir o JSON no navegador
    console.log("Enviando Payload:", JSON.stringify(newTask, null, 2));

    // 3. Envia para a função pai que chama a API
    onSubmit(newTask);
    
    // Limpar campos
    setTitulo('');
    setDescricao('');
    setTagsInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Nova Tarefa</h2>
      
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Corrigir Bug"
          required
        />
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Erro na linha 42..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Tags (separe por vírgula)</label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Ex: teste, urgente, backend"
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Enviando...' : <><Plus size={18} /> Criar Tarefa</>}
      </button>
    </form>
  );
}