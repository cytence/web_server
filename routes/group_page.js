var express = require('express');
var router = express.Router();
var ch_util = require('../util/ch_util');

router.get('/', function (req, res){
	if(req.session.user_type == 'admin')
	{
	}
	else
		res.end();
}
);

module.exports = router;