var Alt = require('alt');

export default class Flux extends Alt {

    constructor() {
        
        super()

        // actionCreators -- stores
        this.addActions('ActionCreators', require('./actions/ActionCreators') );

        this.addStore('PortfolioStore', require('./stores/PortfolioStore') );

    }
}
