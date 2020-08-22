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

import com.shx.locacao.veiculos.models.Cliente;
import com.shx.locacao.veiculos.models.Veiculo;
import com.shx.locacao.veiculos.repository.VeiculoRepository;


@RestController
@RequestMapping(value="/api")
public class VeiculoResources {
		
	@Autowired
	VeiculoRepository veiculoRepository; 
		
	@GetMapping("/veiculos")
	public List<Veiculo> listaVeiculos(){
		return veiculoRepository.findAll();
	}
	@GetMapping("/veiculo/{id}")
	public Veiculo listaVeiculo(@PathVariable(value="id") long id){
		return veiculoRepository.findById(id);
	}
	@PostMapping("/veiculo")
	public Veiculo salvaVeiculo(@RequestBody Veiculo veiculo) {
		return veiculoRepository.save(veiculo);
	}
	
	@DeleteMapping("/veiculo")
	public void deletaVeiculo(@RequestBody Veiculo veiculo) {
		veiculoRepository.delete(veiculo);
	}

	@PutMapping("/veiculo")
	public Veiculo atualizaVeiculo(@RequestBody Veiculo veiculo) {
		return veiculoRepository.save(veiculo);
	}
	
}
