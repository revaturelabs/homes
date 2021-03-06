package com.revature.application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.application.model.Unit;
import com.revature.application.repository.ComplexRepository;
import com.revature.application.repository.UnitRepository;

@Service
@Transactional
public class UnitService {
	
	@Autowired
	UnitRepository unitRepository;
	
	@Autowired
	ComplexRepository complexRepository;
	
	public List<Unit> findAll(){
		return unitRepository.findAll();
	}
	
	public Unit findByUnitId(int id) {
		return unitRepository.findOne(id);
	}
	
	public int save(Unit unit) {
		return unitRepository.saveAndFlush(unit).getUnitId();
	}
	
//	public int update(Unit unit) {
//		return unitRepository.saveAndFlush(unit).getUnitId();
//	}
	
	public boolean delete(int id){
		unitRepository.delete(id);
		return true;
	}
}