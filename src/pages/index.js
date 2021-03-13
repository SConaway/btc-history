import {useState} from 'react';

import {Link, Text, Input, Button, Box} from '@chakra-ui/react';
import {ExternalLinkIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import {Container} from '../components/Container';
import {Main} from '../components/Main';
import {Footer} from '../components/Footer';

import {Chart} from 'react-google-charts';

import dayjs from 'dayjs';

const Index = () => {
    const [amount, setAmount] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        setFetching(true);

        const startDate = dayjs().subtract(7, 'days');

        try {
            const res = await fetch(
                `/api/data/?startDate=${startDate.format(
                    'YYYY-MM-DD',
                )}&endDate=${dayjs().format('YYYY-MM-DD')}&amount=${amount}`,
            );

            const json = await res.json();

            let data = [['Date', 'Price'], ...json.data];

            setChartData(data);
        } catch (e) {
            console.error(e);
        }

        setFetching(false);
    };

    /*

    - picker (month, week, year, 10years)
    - make chart fill parent (make container larger)
    */

    return (
        <Container minHeight="100vh">
            <Main>
                <Text>
                    Get started by entering the amount of BTC you wish to graph:
                </Text>

                <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="BTC"
                    size="sm"
                    variant="outline"
                    isInvalid={!amount || amount === '0'}
                    isRequired
                    label="Amount of Bitcoin"
                    borderColor="gray.300"
                />

                <Button
                    rightIcon={<ArrowForwardIcon />}
                    colorScheme="teal"
                    variant="outline"
                    isLoading={fetching}
                    onClick={fetchData}
                    disabled={!amount || amount === '0'}
                >
                    Go!
                </Button>

                <Box height="70vh" width="100%">
                    {chartData.length > 0 && (
                        <Chart
                            chartType="AreaChart"
                            data={chartData}
                            options={{
                                // title: 'Company Performance',
                                hAxis: {
                                    title: 'Time',
                                    titleTextStyle: {color: '#333'},
                                },
                                // vAxis: {minValue: 0},
                                // chartArea: {width: '50%', height: '70%'},
                                // lineWidth: 25
                                backgroundColor: '',
                                legend: 'none',
                            }}
                            // width="100%"
                            // height="100%"
                            // legendToggle
                        />
                    )}
                </Box>
            </Main>

            <Footer>
                <Text fontSize="xs" color="gray.300">
                    Powered by{' '}
                    <Link
                        href="https://www.coindesk.com/price/bitcoin"
                        isExternal
                    >
                        Coindesk
                        <ExternalLinkIcon mx="2px" />
                    </Link>
                </Text>
            </Footer>
        </Container>
    );
};

export default Index;
