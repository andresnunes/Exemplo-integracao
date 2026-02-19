package com.example.demo.dto;

import java.util.List;

public record CriarTarefaRequest(
    String titulo,
    
    String descricao,
    
    List<String> tags
) {}
