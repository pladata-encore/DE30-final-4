import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Chip, Stack, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const BusinessTypeFilter = ({ onSelect, onDataFetched, singleSelect = false, initialData, maxSelect = 5, mobileResponsive = false}) => {  const [allData, setAllData] = useState(initialData || []);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialData) {
      fetchData();
    } else {
      processData(initialData);
    }
  }, [initialData]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/service-industries');
      setAllData(response.data);
      onDataFetched(response.data);
      processData(response.data);
    } catch (error) {
      console.error('Error fetching business type data:', error);
      setError('업종 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  const processData = (data) => {
    const uniqueCategories = [...new Set(data.map(item => item.service_industry_category))];
    setCategories(uniqueCategories.map(name => ({ name })));
    if (uniqueCategories.length > 0) {
      handleCategorySelect({ name: uniqueCategories[0] });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const filteredData = allData.filter(item => item.service_industry_category === category.name);
    setBusinessTypes(filteredData.map(item => ({
      code: item.serviceIndustry_id.toString(),
      name: item.service_industry_name
    })));
  };

  const handleBusinessTypeToggle = (businessType) => {
    if (singleSelect) {
      const newSelection = [businessType];
      setSelectedBusinessTypes(newSelection);
      onSelect(newSelection);
    } else {
      setSelectedBusinessTypes(prev => {
        const newSelection = prev.some(b => b.code === businessType.code) 
          ? prev.filter(b => b.code !== businessType.code) 
          : [...prev, businessType];
        if (newSelection.length <= maxSelect) {
          onSelect(newSelection);
          return newSelection;
        } else {
          return prev;
        }
      });
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className={`filter-container ${mobileResponsive ? 'mobile-responsive' : ''}`}>
      <Typography variant="h6" className="filter-title">업종선택</Typography>
      <Grid container spacing={1} style={{ position: 'relative', minHeight: '200px' }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            zIndex: 1 
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid item xs={6} className="filter-column">
              <Typography variant="subtitle2" className="filter-subtitle">대카테고리 선택</Typography>
              <Box className="scroll-box">
                {categories.map(category => (
                  <Button 
                    key={category.name} 
                    onClick={() => handleCategorySelect(category)}
                    variant={selectedCategory?.name === category.name ? "contained" : "outlined"}
                    className="filter-button"
                  >
                    {category.name}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} className="filter-column">
              <Typography variant="subtitle2" className="filter-subtitle">업종 선택</Typography>
              <Box className="scroll-box">
                {businessTypes.map(businessType => (
                  <Button 
                    key={businessType.code} 
                    onClick={() => handleBusinessTypeToggle(businessType)}
                    variant={selectedBusinessTypes.some(b => b.code === businessType.code) ? "contained" : "outlined"}
                    className="filter-button"
                  >
                    {businessType.name}
                  </Button>
                ))}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
      {!singleSelect && (
        <>
          <Typography variant="subtitle2" className="filter-subtitle">선택한 업종</Typography>
          <Box className="selected-items-container">
            {selectedBusinessTypes.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {selectedBusinessTypes.map(businessType => (
                  <Chip
                    key={businessType.code}
                    label={businessType.name}
                    onDelete={() => handleBusinessTypeToggle(businessType)}
                    variant="outlined"
                    className="filter-chip"
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" className="selected-items-message">
                업종을 선택하세요
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default BusinessTypeFilter;