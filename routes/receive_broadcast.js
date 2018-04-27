var express = require('express');
var router = express.Router();



router.get('/', function(req, res)
{
	var user_name = req.session.user_name;
	var user_type = req.session.user_type;
	var group_name = req.session.group_name;
	var everyone_msg = null;
	var everyone_msg_tag = null;
	var everyone_msg_sender = null;
	var member_msg = null;
	var member_msg_tag = null;
	var member_msg_sender = null;
	var group_msg = null;
	var group_msg_tag = null;
	var group_msg_sender = null;
	var admin_msg = null;
	var admin_msg_tag = null;
	var admin_msg_sender = null;
	var cmd = "SELECT * FROM broadcast WHERE find_in_set(viewer_type, 'everyone')";
	conn.query(cmd, function (err, rows, fields){
		if(rows[0].message_tag && rows[0].msg_sender)
		{
			everyone_msg_tag = rows[0].message_tag;
			everyone_msg = rows[0].message;
			everyone_msg_sender = rows[0].msg_sender;
		}
		if(user_name)
		{
		
			cmd = "SELECT * FROM broadcast WHERE find_in_set(viewer_type, 'member')";
			conn.query(cmd, function (err, rows, fields){
				if(rows[0].message_tag && rows[0].msg_sender)
				{
					member_msg_tag = rows[0].message_tag;
					member_msg = rows[0].message;
					member_msg_sender = rows[0].msg_sender;
				}
				if(group_name && group_name != 'root')
				{
					cmd = "SELECT * FROM user_group WHERE find_in_set(group_name, '"+ group_name +"')";
					conn.query(cmd, function (err, rows, fields){
							if(rows[0].group_message_tag && rows[0].group_msg_sender)
							{
								group_msg_tag = rows[0].group_message_tag;
								group_msg_sender = rows[0].group_msg_sender;
								group_msg = rows[0].group_message;
							}
							if(user_type == 'admin')
							{
								cmd = "SELECT * FROM broadcast WHERE find_in_set(viewer_type, 'admin')";
								conn.query(cmd, function (err, rows, fields){
									if(rows[0].message_tag && rows[0].msg_sender)
									{
										admin_msg_tag = rows[0].message_tag;
										admin_msg_sender = rows[0].msg_sender;
										admin_msg = rows[0].message;
									}
									res.json({everyone_msg_tag : everyone_msg_tag, 
									everyone_msg_sender : everyone_msg_sender,
									everyone_msg : everyone_msg,
									member_msg_tag : member_msg_tag,
									member_msg_sender : member_msg_sender,
									member_msg : member_msg,
									group_msg_tag : group_msg_tag,
									group_msg_sender : group_msg_sender,
									group_msg : group_msg,
									admin_msg_tag : admin_msg_tag,
									admin_msg_sender : admin_msg_sender,
									admin_msg : admin_msg
								});
								});
							}
							else
							{
								res.json({everyone_msg_tag : everyone_msg_tag, 
									everyone_msg_sender : everyone_msg_sender,
									everyone_msg : everyone_msg,
									member_msg_tag : member_msg_tag,
									member_msg_sender : member_msg_sender,
									member_msg : member_msg,
									group_msg_tag : group_msg_tag,
									group_msg_sender : group_msg_sender,
									group_msg : group_msg,
									admin_msg_tag : admin_msg_tag,
									admin_msg_sender : admin_msg_sender,
									admin_msg : admin_msg
								});
							}
					});
				}
				else if(user_name == 'root' && group_name == 'root')
				{
					cmd = "SELECT * FROM broadcast WHERE find_in_set(viewer_type, 'admin')";
					conn.query(cmd, function (err, rows, fields){
						if(rows[0].message_tag && rows[0].msg_sender)
									{
										admin_msg_tag = rows[0].message_tag;
										admin_msg_sender = rows[0].msg_sender;
										admin_msg = rows[0].message;
									}
									res.json({everyone_msg_tag : everyone_msg_tag, 
									everyone_msg_sender : everyone_msg_sender,
									everyone_msg : everyone_msg,
									member_msg_tag : member_msg_tag,
									member_msg_sender : member_msg_sender,
									member_msg : member_msg,
									group_msg_tag : group_msg_tag,
									group_msg_sender : group_msg_sender,
									group_msg : group_msg,
									admin_msg_tag : admin_msg_tag,
									admin_msg_sender : admin_msg_sender,
									admin_msg : admin_msg
								});
					});
				}
				else
				{
					res.json({everyone_msg_tag : everyone_msg_tag, 
									everyone_msg_sender : everyone_msg_sender,
									everyone_msg : everyone_msg,
									member_msg_tag : member_msg_tag,
									member_msg_sender : member_msg_sender,
									member_msg : member_msg,
									group_msg_tag : group_msg_tag,
									group_msg_sender : group_msg_sender,
									group_msg : group_msg,
									admin_msg_tag : admin_msg_tag,
									admin_msg_sender : admin_msg_sender,
									admin_msg : admin_msg
								});
				}
			}
			);
			
		}
		else
		{
			res.json({everyone_msg_tag : everyone_msg_tag, 
									everyone_msg_sender : everyone_msg_sender,
									everyone_msg : everyone_msg,
									member_msg_tag : member_msg_tag,
									member_msg_sender : member_msg_sender,
									member_msg : member_msg,
									group_msg_tag : group_msg_tag,
									group_msg_sender : group_msg_sender,
									group_msg : group_msg,
									admin_msg_tag : admin_msg_tag,
									admin_msg_sender : admin_msg_sender,
									admin_msg : admin_msg
								});
		}
	}
	);
	
}
);
module.exports = router;