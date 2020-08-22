package com.shx.locacao.veiculos.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shx.locacao.veiculos.models.Locacao;
import com.shx.locacao.veiculos.repository.LocacaoRepository;

@RestController
@RequestMapping(value="/api")
public class LocacaoResources {
	
	@Autowired
	LocacaoRepository locacaoRepository; 
	
	@GetMapping("/locacoes")
	public List<Locacao> listaLocacoes(){
		return locacaoRepository.findAll();
	}
	
	@GetMapping("/locacoes2")
	public List<Locacao> listaLocacoes2(){
		
		return locacaoRepository.findAll();
	}
	
	@GetMapping("/locacao/{id}")
	public Locacao listaLocacao(@PathVariable(value="id") long id){
		return locacaoRepository.findById(id);
	}
	
	@PostMapping("/locacao")
	public Locacao salvaLocacao(@RequestBody Locacao locacao) {
		return locacaoRepository.save(locacao);
	}
	
	@DeleteMapping("/locacao")
	public void deletaLocacao(@RequestBody Locacao locacao) {
		locacaoRepository.delete(locacao);
	}	
	
	@PutMapping("/locacao")
	public Locacao atualizaLocacao(@RequestBody Locacao locacao) {
		return locacaoRepository.save(locacao);
	}
	
	
	
}
