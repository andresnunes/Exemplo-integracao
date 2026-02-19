package com.example.demo.dto;

import java.util.List;

public record TarefaResponse(
    Long id,
    String titulo,
    String descricao,
    List<String> tags,
    boolean concluida
) {}