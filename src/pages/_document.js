import NextDocument, {Html, Head, Main, NextScript} from 'next/document';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <title>Bitcoin Price History</title>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
