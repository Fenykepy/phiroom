var React = require('react');
var MainMenu = require('./MainMenu');


var PhiroomApp = React.createClass({
    render: function() {
        return (
            <div>
            <header role="banner">
                <div id="logo">
                    <a href=""><img src="/assets/images/phiroom-favicon.png" alt="Phiroom, le cms des photographes" /></a>
                </div>
                <h1>Phiroom</h1>
                <h2>Le cms des photographes…</h2>
                <nav role="navigation">
                    <MainMenu />
                </nav>
            </header>
            <section role="main">
            </section>
            </div>
        );
    }
});



module.exports = PhiroomApp;
