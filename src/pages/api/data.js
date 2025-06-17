import dayjs from 'dayjs';

export default async (req, res) => {
    try {
        const response = await fetch(
            `https://api.coindesk.com/v1/bpi/historical/close.json?start=${dayjs(
                req.query.startDate,
            ).format('YYYY-MM-DD')}&end=${dayjs(req.query.endDate).format(
                'YYYY-MM-DD',
            )}`,
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`External request failed: ${errorText}`);
        }
        const text = await response.text();

        const responseJSON = JSON.parse(text);

        let data = Object.entries(responseJSON.bpi)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([key, value]) => [key, value * req.query.amount]);

        let json = {...responseJSON, data};
        delete json.bpi;
        res.json(json);
    } catch (err) {
        const message = err instanceof Error ? err.message : err;

        res.status(500).send(message);
    }
};
