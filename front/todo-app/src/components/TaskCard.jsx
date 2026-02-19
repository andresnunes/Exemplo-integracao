import { CheckCircle, Circle } from 'lucide-react';

export function TaskCard({ task, onComplete }) {
  // Mapeando exatamente as chaves do seu JSON:
  // task.titulo, task.descricao, task.tags, task.concluida, task.id

  return (
    <div className={`card ${task.concluida ? 'completed' : ''}`}>
      <div className="card-header">
        <h3>{task.titulo}</h3>
        <button 
          onClick={() => onComplete(task.id)}
          disabled={task.concluida}
          className="btn-icon"
          title={task.concluida ? "Concluída" : "Marcar como feita"}
        >
          {task.concluida ? (
            <CheckCircle color="#10b981" /> 
          ) : (
            <Circle color="#64748b" />
          )}
        </button>
      </div>
      
      {/* Aqui usamos 'descricao' conforme o JSON */}
      <p className="description">{task.descricao}</p>
      
      <div className="tags-container">
        {/* Verificamos se tags existe e é um array antes de fazer o map */}
        {Array.isArray(task.tags) && task.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>
    </div>
  );
}