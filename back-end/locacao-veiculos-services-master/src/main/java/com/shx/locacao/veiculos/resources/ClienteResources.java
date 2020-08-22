package com.shx.locacao.veiculos.resources;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shx.locacao.veiculos.models.Cliente;
import com.shx.locacao.veiculos.models.Locacao;
import com.shx.locacao.veiculos.repository.ClienteRepository;



@RestController
@RequestMapping(value="/api")
public class ClienteResources {
	@Autowired
	ClienteRepository clienteRepository; 
	
	
	@CrossOrigin		
	@GetMapping("/clientes")
	public List<Cliente> listaClientes(){
		return clienteRepository.findAll();
	}
	
	@CrossOrigin
	@GetMapping("/cliente/{id}")
	public Cliente listaCliente(@PathVariable(value="id") long id){
		return clienteRepository.findById(id);
	}	
	
	@CrossOrigin
	@PostMapping("/cliente")
	public Cliente salvaCliente(@RequestBody Cliente cliente) {
		return clienteRepository.save(cliente);
	}
	
	@CrossOrigin
	@DeleteMapping("/cliente")
	public void deletaCliente(@RequestBody Cliente cliente) {
		clienteRepository.delete(cliente);
	}
	
	@CrossOrigin
	@PutMapping("/cliente")
	public Cliente atualizaCliente(@RequestBody Cliente cliente) {
		return clienteRepository.save(cliente);
	}
}
