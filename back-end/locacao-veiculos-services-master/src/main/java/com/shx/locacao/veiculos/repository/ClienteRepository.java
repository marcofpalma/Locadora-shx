package com.shx.locacao.veiculos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shx.locacao.veiculos.models.Cliente;


public interface ClienteRepository extends JpaRepository<Cliente, Long>{

	Cliente findById(long id);
}
