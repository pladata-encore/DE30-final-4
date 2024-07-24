package com.springboot.fp_ml_web.data.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class DistrictWeeklySales {
    @Id
    private String businessDistrictName;
    private Long mondaySalesAmount;
    private Long tuesdaySalesAmount;
    private Long wednesdaySalesAmount;
    private Long thursdaySalesAmount;
    private Long fridaySalesAmount;
    private Long saturdaySalesAmount;
    private Long sundaySalesAmount;
}
