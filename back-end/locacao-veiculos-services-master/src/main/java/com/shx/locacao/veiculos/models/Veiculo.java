package com.shx.locacao.veiculos.models;

	import java.io.Serializable;
    import javax.persistence.Entity;
	import javax.persistence.GeneratedValue;
	import javax.persistence.GenerationType;
	import javax.persistence.Id;
	import javax.persistence.Table;

	@Entity
	@Table(name="TB_VEICULO")

	public class Veiculo implements Serializable {
		
		private static final long seriaLVersionUID = 1L;
		
		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		private long id;
		
		private String placa;
		private String modelo;
		private String tipo;
		private long ano;
		public long getId() {
			return id;
		}
		public void setId(long id) {
			this.id = id;
		}
		public String getPlaca() {
			return placa;
		}
		public void setPlaca(String placa) {
			this.placa = placa;
		}
		public String getModelo() {
			return modelo;
		}
		public void setModelo(String modelo) {
			this.modelo = modelo;
		}
		public String getTipo() {
			return tipo;
		}
		public void setTipo(String tipo) {
			this.tipo = tipo;
		}
		public long getAno() {
			return ano;
		}
		public void setAno(long ano) {
			this.ano = ano;
		}
	
}
