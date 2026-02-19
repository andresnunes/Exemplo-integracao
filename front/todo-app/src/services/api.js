const BASE_URL = 'http://localhost:8080'; // Ajuste sua porta se necessário

export const api = {
  getTasks: async () => {
    const response = await fetch(`${BASE_URL}/tarefas`);
    if (!response.ok) throw new Error('Erro ao buscar');
    return response.json(); // Retorna o array [ { id: 1... }, ... ]
  },

  createTask: async (body) => {
    const response = await fetch(`${BASE_URL}/tarefas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Erro ao criar');
    return response.json();
  },

  completeTask: async (id) => {
    const response = await fetch(`${BASE_URL}/tarefas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Erro ao completar');
    // Não precisa retornar JSON se o backend retornar void/204, mas se retornar o objeto atualizado:
    // return response.json(); 
  }
};