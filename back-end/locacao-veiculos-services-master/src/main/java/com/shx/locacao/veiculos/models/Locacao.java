package com.shx.locacao.veiculos.models;
import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="TB_LOCACAO")

public class Locacao implements Serializable {
		
		private static final long seriaLVersionUID = 1L;
		
		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		private long id;
		
		private Date data;
		private long id_veiculo;
		private long id_Cliente;
		private Date data_retirada;
		private Date data_devolucao;
		private String OBS;
		public long getId() {
			return id;
		}
		public void setId(long id) {
			this.id = id;
		}
		public Date getData() {
			return data;
		}
		public void setData(Date data) {
			this.data = data;
		}
		public long getId_veiculo() {
			return id_veiculo;
		}
		public void setId_veiculo(long id_veiculo) {
			this.id_veiculo = id_veiculo;
		}
		public long getId_Cliente() {
			return id_Cliente;
		}
		public void setId_Cliente(long id_Cliente) {
			this.id_Cliente = id_Cliente;
		}
		public Date getData_retirada() {
			return data_retirada;
		}
		public void setData_retirada(Date data_retirada) {
			this.data_retirada = data_retirada;
		}
		public Date getData_devolucao() {
			return data_devolucao;
		}
		public void setData_devolucao(Date data_devolucao) {
			this.data_devolucao = data_devolucao;
		}
		public String getOBS() {
			return OBS;
		}
		public void setOBS(String oBS) {
			OBS = oBS;
		}
}
