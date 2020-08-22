package com.shx.locacao.veiculos.repository;
import org.springframework.data.jpa.repository.JpaRepository;


import com.shx.locacao.veiculos.models.Locacao;

public interface LocacaoRepository extends JpaRepository<Locacao, Long>{
	Locacao findById(long id);
}
