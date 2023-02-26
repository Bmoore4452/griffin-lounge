const router = require('express').Router();

router.use((req, res) => res.send('Wrong route'));

module.exports = router;
