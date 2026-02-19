package com.example.demo.controller;

//adicionar todos os imports
import com.example.demo.dto.CriarTarefaRequest;
import com.example.demo.model.Tarefa;
import com.example.demo.repository.TarefaRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.dto.TarefaResponse;

@RestController
@RequestMapping("/tarefas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*") 
public class TarefaController {

    private final TarefaRespository tarefaRespository;

    @GetMapping
    public List<TarefaResponse> getAllTarefas() {
        log.info("Buscando todas as tarefas");
        List<Tarefa> tarefas = tarefaRespository.findAll();
        log.info("Encontradas {} tarefas", tarefas.size());
        List<TarefaResponse> tarefaResponses = tarefas.stream()
                .map(tarefa -> new TarefaResponse(
                        tarefa.getId(),
                        tarefa.getTitulo(),
                        tarefa.getDescricao(),
                        tarefa.getTags(),
                        tarefa.isConcluida()
                ))
                .toList();

        return tarefaResponses;
    }

    @PostMapping
    public TarefaResponse createTarefa(@RequestBody CriarTarefaRequest request) {
        log.info("Criando nova tarefa com título: {}", request.titulo());
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setTags(request.tags());
        Tarefa tarefaSalva = tarefaRespository.save(tarefa);

        TarefaResponse tarefaResponse = new TarefaResponse(
            tarefaSalva.getId(),
            tarefaSalva.getTitulo(),
            tarefaSalva.getDescricao(),
            tarefaSalva.getTags(),
            tarefaSalva.isConcluida()
        );

        log.info("Tarefa criada com ID: {}", tarefaSalva.getId());
        return tarefaResponse;
    }

    @PutMapping("/{id}")
    public TarefaResponse updateTarefa(@PathVariable Long id) {
        log.info("Atualizando tarefa com ID: {}", id);
        Tarefa tarefa = tarefaRespository.findById(id).orElse(null);

        if (tarefa == null) {
            throw new RuntimeException("Tarefa não encontrada");
        }

        tarefa.setConcluida(true);
        Tarefa tarefaSalva = tarefaRespository.save(tarefa);

        TarefaResponse tarefaResponse = new TarefaResponse(
            tarefaSalva.getId(),
            tarefaSalva.getTitulo(),
            tarefaSalva.getDescricao(),
            tarefaSalva.getTags(),
            tarefaSalva.isConcluida()
        );

        log.info("Tarefa criada com ID: {}", tarefaSalva.getId());
        return tarefaResponse;
    }
}
