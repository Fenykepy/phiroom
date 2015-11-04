'use strict';

class PortfolioStore {

    constructor() {
        
        this.ActionCreators = this.alt.getActions('ActionCreators');

        this.bindActions(this.ActionCreators);

        this.portfolios = [];
        this.currentPortfolio = null;

        this.exportPublicMethods({
            getCurrentPortfolio: this.getCurrentPortfolio.bind(this),
            getPortfolios: this.getPortfolios.bind(this)
        });
    }

    onLoadOnePortfolio(portfolio){
        console.log( '\nPortfolioStore.onLoadPortfolio: ', portfolio);
        this.setState({currentPortfolio: portfolio});
    }

    getCurrentPortfolio() {
        return this.currentPortfolio;
    }

    getPortfolios() {
        return this.portfolios;
    }
};

module.exports = PortfolioStore;
