package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Tarefa;

@Repository
public interface TarefaRespository extends JpaRepository<Tarefa, Long> {

}
