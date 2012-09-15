/**
 * Bytes por editor
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/Bytes por editor.js]] ([[File:User:Helder.wiki/Tools/Bytes por editor.js]])
 */
/*jslint browser: true, white: true, plusplus: true, devel: true*/
/*global mediaWiki, jQuery */
( function ( mw, $ ) {
'use strict';

function processHistory( data ) {
	var	revs, i, user, delta,
		bytes = {}, table = [],
		text = '<h2>Tamanho total das contribuições de cada editor desta página</h2>\n';
 
        if ( data.query && data.query.pages && data.query.pageids ) {
                revs = data.query.pages[ data.query.pageids[0] ].revisions;
		bytes[ revs[0].user ] = revs[0].size;
		for(i=1; i<revs.length; i++){
			user = revs[i].user;
			delta = revs[i].size - revs[i-1].size;
			if (bytes.hasOwnProperty(user)) {
				bytes[user] += delta;
			} else {
				bytes[user] = delta;
			}
		}
		$.each( bytes, function( user, size ){
			table.push(
				'<tr><td><a href="' + mw.util.wikiGetlink( 'User:' + user ) + '">' +
				user + '</a></td><td>' + size + '</td></tr>'
			);
		});
		text += '<table class="wikitable sortable"><thead><tr>' +
			'<th class="headerSort" title="Ordenar por ordem ascendente">Editor</th>' +
			'<th class="headerSort" title="Ordenar por ordem ascendente">Bytes</th>' +
			'</tr></thead><tbody>' +
			table.join( '\n' ) +
			'</tbody></table>';
		$('#mw-content-text')
			.prepend( text )
			.find( 'table' )
			.tablesorter();
        } else {
                alert( 'The edit query returned an error. =(' );
        }
}

function run() {
	var api = new mw.Api();
	api.get( {
		prop: 'revisions',
		titles: mw.config.get('wgPageName'),
		indexpageids: 1,
		rvlimit: 500,
		rvdir: 'newer',
		rvprop: 'user|size'
	}, {
		ok: processHistory,
		err: function() {
			alert( 'The ajax request failed.' );
		}
	} );
}

if( mw.config.get('wgNamespaceNumber') !== -1 ) {
	$(function(){
		$( mw.util.addPortletLink( 'p-cactions',
			'#',
			'Bytes por editor',
			't-bytes-editor',
			'Ver o tamanho total das contribuições de cada editor desta página'
		)).click( function (e) {
			e.preventDefault();
			mw.loader.using( ['mediawiki.api', 'jquery.tablesorter'], run);
		} );
	});
}

}( mediaWiki, jQuery ) );