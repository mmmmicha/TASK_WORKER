import express from 'express';
const router = express.Router();

/* aws healthCheck */
router.get('/health-check', (req, res, next) => {
    res.status(200).json('success');
});

export default router;
