package com.springboot.fp_ml_web.data.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Data
public class UserSelection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userSelection_id;
    private int userId;
    private String service_industry_category;
    private String service_industry_name;
    private String district_name;
    private String administrative_dong_name;
    private String business_district_name;
    private int rent_fee_select ;
    private int rent_area;
}