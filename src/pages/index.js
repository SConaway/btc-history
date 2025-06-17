import {useState} from 'react';

import {
    Link,
    Text,
    Input,
    IconButton,
    Box,
    Field,
    Icon,
    RadioGroup,
    HStack,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    CloseButton,
    VStack,
} from '@chakra-ui/react';
import {SlArrowRight, SlShareAlt} from 'react-icons/sl';
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

        try {
            // debugger;
            const res = await fetch(
                `/api/data/?startDate=${startDate.format(
                    'YYYY-MM-DD',
                )}&endDate=${dayjs().format('YYYY-MM-DD')}&amount=${amount}`,
            );

            if (!res.ok) throw await res.text();

            const json = await res.json();

            let data = [['Date', 'Price'], ...json.data];

            setStartPrice(data[1][1]);
            setEndPrice(data[data.length - 1][1]);

            setChartData(data);
            setError(null);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                setError(e.message);
            } else {
                console.error(e);
                setError(e);
            }
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
                    <Field.Root>
                        <Field.Label
                            htmlFor="amount"
                            sx={{fontWeight: 'normal'}}
                        >
                            How much BTC do you have?
                        </Field.Label>
                        <Input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="BTC"
                            size="sm"
                            variant="outline"
                            required
                            type="number"
                            label="Amount of Bitcoin"
                            borderColor="gray.300"
                            id="amount"
                        />
                    </Field.Root>

                    <Field.Root as="fieldset">
                        <Field.Label as="legend" htmlFor="range">
                            Range for chart
                        </Field.Label>
                        <RadioGroup.Root
                            value={range}
                            onValueChange={(e) => setRange(e.value)}
                            id="range"
                        >
                            <HStack spacing="24px">
                                <RadioGroup.Item value="week">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Last week
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="month">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Last Month
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="year">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Last Year
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="10year">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>
                                        Last 10 Years
                                    </RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </HStack>
                        </RadioGroup.Root>
                    </Field.Root>

                    <IconButton
                        variant="outline"
                        color="black"
                        aria-label="Graph"
                        isLoading={fetching}
                        onClick={fetchData}
                        disabled={!amount || amount === '0'}
                    >
                        <SlArrowRight />
                    </IconButton>

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
                            <Alert.Root status="error">
                                <Alert.Indicator />
                                <Alert.Content>
                                    <Alert.Title mr={2}>
                                        An error occurred:
                                    </Alert.Title>
                                    <Alert.Description>
                                        {error}
                                    </Alert.Description>
                                </Alert.Content>
                                <CloseButton
                                    onClick={() => setError(null)}
                                    pos="relative"
                                    top="-2"
                                    insetEnd="-2"
                                />
                            </Alert.Root>
                        )}
                    </Box>
                </Main>

                <Footer>
                    <Link
                        href="https://www.coindesk.com/price/bitcoin"
                        isExternal
                        color="gray.400"
                    >
                        <HStack verticalAlign="baseline">
                            <Text fontSize="xs">Powered by Coindesk </Text>
                            {/* <Icon> */}
                            <SlShareAlt size="12px" />
                            {/* </Icon> */}
                        </HStack>
                    </Link>
                </Footer>
            </Container>
        </>
    );
};

export default Index;
