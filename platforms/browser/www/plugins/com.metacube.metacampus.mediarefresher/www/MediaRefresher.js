cordova.define("com.metacube.metacampus.mediarefresher.MediaRefresher", function(require, exports, module) { var mediaRefresh = {
	scanMedia : function(fileUri,successCallback,errorCallback) {
		cordova.exec(
			successCallback,
			errorCallback,
			'MediaRefresher',
			'refresh',
			[fileUri]
		);
	}
}

module.exports = mediaRefresh;
});
