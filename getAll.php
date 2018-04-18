<?php

	$str = file_get_contents($_GET['file']);
	echo json_decode($str, true);

?>