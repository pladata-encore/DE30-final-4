import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useInfiniteQuery } from 'react-query';
import { Container, Paper, Typography, Table, TableBody, TableContainer, Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import TableHeader from '../../components/table/TableHeader';
import TableRowContent from '../../components/table/TableRowContent';
import { selectFilter } from '../../redux/modules/filter';
import { fetchPredictions } from '../../services/api';
import { transformFilterData } from '../../utils/filterUtils';

const RecommendationHeader = () => {
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  return (
    <div className="bg-[#f7f9fc] p-4 rounded-t-lg">
      <Typography variant="h5" className="font-bold text-[#2e2e48] mb-2">AI맞춤추천</Typography>
      <div className="flex items-center justify-center">
        <img src="/img/double_quotes_icon.png" alt="quotes" className="w-3 h-3 mr-1" />
        <Typography variant="subtitle1" className="text-[#47516b]">
          {nickname ? `${nickname}님` : '악명님'}을 위한 맞춤 추천랭킹
        </Typography>
        <img src="/img/down_arrow_icon.png" alt="arrow" className="w-3 하-3 ml-1" />
      </div>
    </div>
  );
};

const Ranking = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const filter = useSelector(selectFilter);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ['predictions', transformFilterData(filter)],
    ({ pageParam = 0 }) => fetchPredictions({ pageParam, queryKey: [null, transformFilterData(filter)] }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.last ? undefined : pages.length;
      },
    }
  );

  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.offsetHeight;
    const scrollThreshold = 0.7; // 80% 스크롤 시 다음 페이지 로드

    if (scrollPosition / pageHeight > scrollThreshold && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <RecommendationHeader />
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHeader isMobile={isMobile} />
            <TableBody>
              {status === 'success' &&
                data.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.content.map((prediction, index) => (
                      <TableRowContent key={index} data={prediction} isMobile={isMobile} />
                    ))}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {!hasNextPage && status === 'success' && (
          <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>모든 결과를 불러왔습니다.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Ranking;