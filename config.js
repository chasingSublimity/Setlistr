exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://chasingSublimity:lavalamp1@ds151927.mlab.com:51927/setlist-generator';
exports.TEST_DATABASE_URL = (
											process.env.TEST_DATABASE_URL ||
											'mongodb://localhost/test-setlist-generator');
exports.PORT = process.env.PORT || 8080;

