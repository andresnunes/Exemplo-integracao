import { useEffect, useState } from 'react';
import './App.css';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { api } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca inicial
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      
      // O seu JSON é um array puro: [ {...}, {...} ]
      // Então salvamos direto no state
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Formato inesperado:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      await api.createTask(newTask);
      await fetchTasks(); // Recarrega a lista do servidor
    } catch (error) {
      alert("Erro ao criar tarefa");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await api.completeTask(id);
      
      // Atualização otimista local para feedback rápido
      setTasks(currentTasks => 
        currentTasks.map(t => 
          t.id === id ? { ...t, concluida: true } : t
        )
      );
    } catch (error) {
      alert("Erro ao completar tarefa");
      fetchTasks(); // Reverte em caso de erro
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Minhas Tarefas</h1>
      </header>
      <main className="layout">
        <aside className="sidebar">
          <TaskForm onSubmit={handleCreateTask} isLoading={loading} />
        </aside>
        <section className="task-list">
          {loading && <p>Carregando...</p>}
          
          <div className="grid">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={handleCompleteTask} 
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;