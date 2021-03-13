import {useState} from 'react';

import {
    Link,
    Text,
    Input,
    IconButton,
    Box,
    FormControl,
    FormLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    HStack,
} from '@chakra-ui/react';
import {ExternalLinkIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import {Container} from '../components/Container';
import {Main} from '../components/Main';
import {Footer} from '../components/Footer';

import {Chart} from 'react-google-charts';

import dayjs from 'dayjs';

const Index = () => {
    const [amount, setAmount] = useState(1);
    const [range, setRange] = useState('week');
    const [fetching, setFetching] = useState(false);
    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        setFetching(true);

        let startDate = dayjs();
        switch (range) {
            case 'week':
                startDate = startDate.subtract(7, 'days');
                break;

            case 'month':
                startDate = startDate.subtract(1, 'month');
                break;

            case 'year':
                startDate = startDate.subtract(1, 'year');
                break;

            case '10year':
                startDate = startDate.subtract(10, 'year');
                break;

            default:
                break;
        }

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

    - favicon and html <head> stuff
    - error handling
    */

    return (
        <Container minHeight="100vh">
            <Main>
                <FormControl>
                    <FormLabel htmlFor="amount" sx={{fontWeight: 'normal'}}>
                        How much BTC do you have?
                    </FormLabel>
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
                        id="amount"
                    />
                </FormControl>

                <FormControl as="fieldset">
                    <FormLabel as="legend" htmlFor="range">
                        Range for chart
                    </FormLabel>
                    <RadioGroup value={range} onChange={setRange} id="range">
                        <HStack spacing="24px">
                            <Radio value="week">Last week</Radio>
                            <Radio value="month">Last Month</Radio>
                            <Radio value="year">Last Year</Radio>
                            <Radio value="10year">Last 10 Years</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>

                <IconButton
                    variant="outline"
                    colorScheme="blue"
                    aria-label="Graph"
                    icon={<ArrowForwardIcon />}
                    isLoading={fetching}
                    onClick={fetchData}
                    disabled={!amount || amount === '0'}
                />

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
                            height="100%"
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
