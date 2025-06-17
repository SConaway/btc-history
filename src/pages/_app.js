import {Provider} from '../components/ui/provider';

function MyApp({Component, pageProps}) {
    return (
        <Provider resetCSS>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
