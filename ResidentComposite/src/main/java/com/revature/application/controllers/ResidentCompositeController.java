package com.revature.application.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.MediaType;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

import com.revature.application.*;
import com.revature.application.model.Associate;
import com.revature.application.model.Complex;
import com.revature.application.model.ResidentUnitComplexOffice;
import com.revature.application.model.Unit;

@RestController
@RequestMapping("residentcomposite")
public class ResidentCompositeController {
	
	private final String ASSOCIATESERV = "http://localhost:8090/";
	private final String COMPLEXSERV = "http://localhost:8093/";
	
	public JsonElement getJsonFromService(String url) {
		Client client = Client.create();
		WebResource webResource = client.resource(url);
		String response = webResource.accept(MediaType.APPLICATION_JSON).get(String.class);
		System.out.println("WEB RESOURCE RESPONSE: "+response);
		return new JsonParser().parse(response);
	}
	
	@GetMapping(value = "residentinfo")
	public ResponseEntity<Object> getResidentInfo() {
		Gson gson = new Gson();
		
		Associate[] jsonArr = gson.fromJson(getJsonFromService(ASSOCIATESERV+"associates"), Associate[].class);
		
		return new ResponseEntity<Object>(jsonArr, HttpStatus.OK);
	}
	
	@GetMapping("residentinfo/withRoomDetails")
	public ResponseEntity<Object> findAllAssociatesWithRoomDetails() {
		Gson gson = new Gson();
		Associate[] associates = gson.fromJson(getJsonFromService(ASSOCIATESERV+"associates"), Associate[].class);
		
		List<ResidentUnitComplexOffice> residentInfoList = new ArrayList<>();
		
		for(Associate associate : associates) {
			ResidentUnitComplexOffice residentInfo = new ResidentUnitComplexOffice();
			residentInfo.setAssociate(associate);
			residentInfo.setUnit(
					gson.fromJson(getJsonFromService(COMPLEXSERV+"unit/"+associate.getUnitId().toString()), Unit.class)
					);
			if (residentInfo.getUnit() != null) {
				residentInfo.setComplex(residentInfo.getUnit().getComplex());
				if (residentInfo.getComplex() != null)
					residentInfo.setOffice(residentInfo.getUnit().getComplex().getOffice());
			}
			
			residentInfoList.add(residentInfo);
		}
		
		return ResponseEntity.ok(residentInfoList);
	}
	
	
}