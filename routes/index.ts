import express from 'express';
const router = express.Router();

router.get('/health-check', async (req, res, next) => {
	res.status(200).json({ msg: 'ok' });
});

export default router;
