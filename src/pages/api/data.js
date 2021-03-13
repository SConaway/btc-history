import dayjs from 'dayjs';

export default async (req, res) => {
    const response = await fetch(
        `https://api.coindesk.com/v1/bpi/historical/close.json?start=${dayjs(
            req.query.startDate,
        ).format('YYYY-MM-DD')}&end=${dayjs(req.query.endDate).format(
            'YYYY-MM-DD',
        )}`,
    );

    const text = await response.text();

    try {
        res.json(await response.json());
    } catch (err) {
        res.status(response.status).send(text);
    }
};
