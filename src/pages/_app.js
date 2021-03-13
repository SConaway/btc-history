import {ChakraProvider, ColorModeProvider} from '@chakra-ui/react';

function MyApp({Component, pageProps}) {
    return (
        <ChakraProvider resetCSS>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
