import {useState} from 'react';

import {Link, Text, Input, Button} from '@chakra-ui/react';
import {ExternalLinkIcon, LinkIcon, ArrowForwardIcon} from '@chakra-ui/icons';
import {Container} from '../components/Container';
import {Main} from '../components/Main';
import {Footer} from '../components/Footer';

import {Chart} from 'react-google-charts';

import dayjs from 'dayjs';

const Index = () => {
    const [amount, setAmount] = useState('');
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState([
        ['Age', 'Weight'],
        [3, 3.5],
        [4, 5],
        [6.5, 7],
        [8, 12],
        [11, 14],
    ]);

    const fetchData = async () => {
        // setFetching(true);
        const startDate = new dayjs();
        const today = new Date();
        // try {

        const res = await fetch(
            `https://api.coindesk.com/v1/bpi/historical/close.json?start=${dayjs()
                .subtract(7, 'days')
                .format('YYYY-MM-DD')}&end=${dayjs().format('YYYY-MM-DD')}`,
            {mode: 'no-cors'},
        );
        console.log(res);

        const json = await res.json();
        console.log(json);

        // } catch (e) {
        //     console.error(e);
        // }

        // setFetching(false);
    };

    return (
        <Container height="100vh">
            {/* <Hero /> */}
            <Main>
                <Text>
                    Get started by entering the amount of BTC you wish to graph:
                </Text>

                <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="BTC"
                    size="sm"
                />

                <Button
                    rightIcon={<ArrowForwardIcon />}
                    colorScheme="teal"
                    variant="outline"
                    isLoading={fetching}
                    onClick={fetchData}
                >
                    Go!
                </Button>

                <Chart
                    chartType="AreaChart"
                    data={data}
                    options={{
                        // title: 'Company Performance',
                        hAxis: {title: 'Time', titleTextStyle: {color: '#333'}},
                        // vAxis: {minValue: 0},
                        // For the legend to fit, we make the chart area smaller
                        chartArea: {width: '50%', height: '70%'},
                        // lineWidth: 25
                        backgroundColor: '',
                        legend: 'none',
                    }}
                    // width="80%"
                    // height="400px"
                    // legendToggle
                />
            </Main>

            <Footer>
                <Text fontSize="xs" color="gray.500">
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
