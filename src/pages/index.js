import {useState} from 'react';

import {
    Link,
    Text,
    Input,
    IconButton,
    Box,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    HStack,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    CloseButton,
} from '@chakra-ui/react';
import {ExternalLinkIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import {Container} from '../components/Container';
import {Main} from '../components/Main';
import {Footer} from '../components/Footer';

import {Chart} from 'react-google-charts';

import Head from 'next/head';

import dayjs from 'dayjs';

const Index = () => {
    const [amount, setAmount] = useState(1);
    const [range, setRange] = useState('week');
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(0);

    const fetchData = async () => {
        setFetching(true);

        let startDate = dayjs();
        switch (range) {
            case 'week':
                startDate = startDate.subtract(1, 'week');
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

        const res = await fetch(
            `/api/data/?startDate=${startDate.format(
                'YYYY-MM-DD',
            )}&endDate=${dayjs().format('YYYY-MM-DD')}&amount=${amount}`,
        );

        try {
            const json = await res.json();

            let data = [['Date', 'Price'], ...json.data];

            setStartPrice(data[1][1]);
            setEndPrice(data[data.length - 1][1]);

            setChartData(data);
            setError(null);
        } catch (e) {
            console.error(e);
            setFetching(false);
            setError('Invalid Response Received');
            return;
        }

        setFetching(false);
    };

    return (
        <>
            <Head>
                <title>Bitcoin Price History</title>
            </Head>
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
                        <RadioGroup
                            value={range}
                            onChange={setRange}
                            id="range"
                        >
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
                            <>
                                <HStack
                                    flexWrap="wrap"
                                    align="center"
                                    justifyContent="space-between"
                                >
                                    <Box textAlign="center">
                                        <Text color="gray.400">Start:</Text>
                                        <HStack spacing={0}>
                                            <Text fontWeight="light">$</Text>
                                            <Text>
                                                {Math.round(startPrice * 100) /
                                                    100}
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <Box textAlign="center">
                                        <Text color="gray.400">End:</Text>
                                        <HStack spacing={0}>
                                            <Text fontWeight="light">$</Text>
                                            <Text>
                                                {Math.round(endPrice * 100) /
                                                    100}
                                            </Text>
                                        </HStack>
                                    </Box>
                                    <Box textAlign="center">
                                        <Text color="gray.400">
                                            Difference:
                                        </Text>{' '}
                                        <HStack
                                            spacing={0}
                                            color={
                                                endPrice - startPrice > 0
                                                    ? 'green'
                                                    : endPrice - startPrice < 0
                                                    ? 'red'
                                                    : ''
                                            }
                                        >
                                            <Text fontWeight="light">$</Text>
                                            <Text>
                                                {Math.round(
                                                    (endPrice - startPrice) *
                                                        100,
                                                ) / 100}
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>
                                <Chart
                                    chartType="AreaChart"
                                    data={chartData}
                                    options={{
                                        // title: 'Company Performance',
                                        hAxis: {
                                            title: 'Time',
                                            titleTextStyle: {color: '#333'},
                                        },
                                        vAxis: {title: 'Value in Dollars'},
                                        // chartArea: {width: '75%', height: '70%'},
                                        // lineWidth: 25
                                        backgroundColor: '',
                                        legend: 'none',
                                    }}
                                    // width={`${window.width * 0.9}px`}
                                    width="100%"
                                    height="100%"
                                    // legendToggle
                                />
                            </>
                        )}
                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>
                                    An error occurred.
                                </AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                                <CloseButton
                                    position="absolute"
                                    right="8px"
                                    top="8px"
                                    onClick={() => setError(null)}
                                />
                            </Alert>
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
        </>
    );
};

export default Index;
