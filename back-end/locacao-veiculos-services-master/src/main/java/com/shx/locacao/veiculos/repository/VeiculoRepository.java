package com.shx.locacao.veiculos.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.shx.locacao.veiculos.models.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long>{

	Veiculo findById(long id);
	
}
