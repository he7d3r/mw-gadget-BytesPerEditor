window.BytesPerEditor = {
	run: function(){
		var bytes = {},
			text = '<h2>Tamanho total das contribuições de cada editor desta página</h2>';
		//TODO: Use data from API, such as
		//https://secure.wikimedia.org/wikibooks/pt/w/api.php?action=query&prop=revisions&rvlimit=500&titles=Logística&rvprop=user|size
		$('#pagehistory li').each(function(){
			var	$li = $(this),
				user = $li.find('.history-user a:first').text(),
				delta = parseInt($li.find('.mw-plusminus-neg, .mw-plusminus-pos, .mw-plusminus-null, .history-size').text().replace(/[^\d+-]/g, ''), 10);
			if (bytes.hasOwnProperty(user)) {
				bytes[user] += delta;
			} else {
				bytes[user] = delta;
			}
		});

		for (var user in bytes){
			if (bytes.hasOwnProperty(user)) {
				text += '\n' + user + ': ' + bytes[user] + ' bytes.<br>';
			}
		}
		jsMsg( text );
	}
};

$(function(){
	if( mw.config.get('wgAction') === 'history' ) {
		mw.util.addPortletLink( 'p-cactions',
			'javascript:window.BytesPerEditor.run();',
			'Bytes por editor',
			't-bytes-editor',
			'Ver o tamanho total das contribuições de cada editor desta página');
	}
});