'use strict';

var React = require('react');

var Portfolio = require('./Portfolio.jsx');
var Lightbox = require('./Lightbox.jsx');

var App = React.createClass({
    // root view -- flux -- context
    // child component
    childContexttypes: {
        flux: React.PropTypes.object.isRequired
    },

    getChildContext: function() {
        console.log('\n\n getChildContext() props: ', this.props);
        return {
            flux: this.props.flux || new Error('flux not found!')
        };
    },

    _getStateFromStores: function() {
        return {
            currentView: this.RouteStore.getCurrentView(),
            currentPortfolio: this.PortfolioStore.getCurrentPortfolio(),
            portfolios: this.PortfolioStore.getPortfolios()
        }
    },

    getInitialState: function() {
        this.RouteStore = this.props.flux.getStore('RouteStore');
        this.PortfolioStore = this.props.flux.getStore('PortfolioStore');
        return this._getStateFromStores();
    },

    componentDidMount: function() {
        this.RouteStore.listen(this._onChange);
        this.PortfolioStore.listen(this._onChange);
    },

    componentWillUnmount: function() {
        this.RouteStore.unlisten(this._onChange);
        this.PortfolioStore.unlisten(this._onChange);
    },

    _onChange: function() {
        this.setState(this._getStateFromStores());
    },

    render: function () {

        var view;

        if (this.state.currentView == 'lightbox') {
            view = <Lightbox portfolio = { this.state.currentPortfolio } />;
        } else {
            view = <Portfolio portfolio = { this.state.currentPortfolio } />;
        }

        return ( <div> { view } </div>
        );
    }

});


module.exports = App;
