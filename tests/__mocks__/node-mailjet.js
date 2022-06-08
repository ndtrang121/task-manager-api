const Mail = function ()
{
	this.connect = () => this
	this.post = () => this 
	// Repeat the above for all other methods you used,
	// which chain BEFORE .request()
	this.request = () => { }
}
 
module.exports = new Mail()